<script lang="ts">
  import { goto } from '$app/navigation';
  import Icon from '@iconify/svelte';
  import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
  import { _axios } from '$lib/_axios';
  import { page } from '$app/stores';
  import { toast } from 'svelte-sonner';
  import { Switch } from "$lib/components/ui/switch/index.js";

  // Route-to-icon and title mapping
  const routeConfig = {
    dashboard: { title: 'Dashboard', icon: 'mdi:view-dashboard' },
    staffManagement: { title: 'Staff Management', icon: 'mdi:account-tie' },
    default: { title: 'Home', icon: 'mdi:home' },
  };

  // Function to get title and icon from route path
  function getRouteConfig(pathname: string) {
    const route = pathname.split('/').filter(Boolean).pop() || 'default';
    const normalizedRoute = route.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    return routeConfig[normalizedRoute] || routeConfig.default;
  }

  // Get institutionId from URL params
  const institutionId = $derived(() => {
    const pathSegments = $page.url.pathname.split('/');
    const institutionIndex = pathSegments.findIndex(segment => segment === 'institute-management');
    return institutionIndex !== -1 && pathSegments[institutionIndex + 1] ? pathSegments[institutionIndex + 1] : null;
  });

  // Validate UUID format
  function isValidUUID(id: string | null): boolean {
    if (!id) return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }

  // Reactive title and icon
  const currentConfig = $derived(getRouteConfig($page.url.pathname));
  const title = $derived(currentConfig.title);
  const icon = $derived(currentConfig.icon);

  // Query client for invalidating queries
  const queryClient = useQueryClient();

  // State for UI
  let searchQuery = $state('');
  let currentPage = $state(1);
  const itemsPerPage = 5;
  let showCreateEditModal = $state(false);
  let showDeleteDialog = $state(false);
  let selectedStaff = $state<{
    id?: string;
    name: string;
    email: string;
    type: string;
    institutionId?: string;
    isActive: boolean;
  }>({
    name: '',
    email: '',
    type: 'other',
    isActive: true,
    institutionId: institutionId(),
  });
  let isEditing = $state(false);
  let debounceTimeout: ReturnType<typeof setTimeout>;

  $effect(() => {
    console.log('Search query changed:', searchQuery);
    handleSearch();
  });

  function handleSearch() {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      console.log('Executing search with query:', searchQuery);
      currentPage = 1;
      $staffsQuery.refetch();
    }, 300);
  }

  function handleSearchInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    searchQuery = inputElement.value;
    console.log('Search input changed to:', searchQuery);
  }

  const staffsQuery = createQuery({
    queryKey: ['staffs', searchQuery, currentPage, institutionId()],
    queryFn: async () => {
      console.log('Fetching staffs with search:', searchQuery, 'page:', currentPage, 'institutionId:', institutionId());
      try {
        const response = await _axios.get('/staff/', {
          params: {
            search: searchQuery,
            page: currentPage,
            limit: itemsPerPage,
            institutionId: institutionId(),
          },
        });
        return response.data;
      } catch (error: any) {
        console.error('API fetch error:', error.message, error.response?.data);
        toast.error(error.response?.data?.message || 'Failed to fetch staffs');
        throw new Error(error.response?.data?.message || 'Failed to fetch staffs');
      }
    },
  });

  // Derived state for pagination
  const staffData = $derived($staffsQuery.data?.data || []);
  const totalItems = $derived($staffsQuery.data?.data?.pagination?.totalItems || 0);
  const totalPages = $derived(Math.ceil(totalItems / itemsPerPage));

  let formErrors = $state({
    name: '',
    email: '',
    type: '',
    institutionId: '',
  });

  function validateForm(): boolean {
    formErrors = { name: '', email: '', type: '', institutionId: '' };
    let isValid = true;

    if (!selectedStaff.name.trim()) {
      formErrors.name = 'Name is required';
      isValid = false;
    }

    if (!selectedStaff.email.trim()) {
      formErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(selectedStaff.email)) {
      formErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!selectedStaff.type.trim()) {
      formErrors.type = 'Type is required';
      isValid = false;
    }

    return isValid;
  }

  const createStaffMutation = createMutation({
    mutationFn: (data: typeof selectedStaff) => {
      const apiData = {
        name: data.name.trim(),
        email: data.email.trim(),
        type: data.type,
        institutionId: institutionId(),
      };
      console.log('Creating staff with payload:', apiData);
      return _axios.post('/staff/', apiData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffs'] });
      showCreateEditModal = false;
      resetSelectedStaff();
      toast.success('Staff created successfully');
    },
    onError: (error: any) => {
      console.error('Create staff error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        institutionId: institutionId(),
      });
      const message = error.response?.data?.message || 'Failed to create staff';
      toast.error(message);
    },
  });

  const updateStaffMutation = createMutation({
    mutationFn: (data: typeof selectedStaff) => {
      const apiData: any = {
        name: data.name.trim(),
        email: data.email.trim(),
        type: data.type,
        institutionId: institutionId(),
        isActive: true,
      };
      console.log('Updating staff with payload:', apiData);
      return _axios.put(`/staff/${data.id}`, apiData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffs'] });
      showCreateEditModal = false;
      resetSelectedStaff();
      toast.success('Staff updated successfully');
    },
    onError: (error: any) => {
      console.error('Update staff error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const message = error.response?.data?.message || 'Failed to update staff';
      toast.error(message);
    },
  });

  const deleteStaffMutation = createMutation({
    mutationFn: (id: string) => {
      console.log('Deleting staff with id:', id);
      return _axios.delete(`/staff/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffs'] });
      showDeleteDialog = false;
      resetSelectedStaff();
      toast.success('Staff deleted successfully');
    },
    onError: (error: any) => {
      console.error('Delete staff error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const message = error.response?.data?.message || 'Failed to delete staff';
      toast.error(message);
    },
  });

  const toggleStaffStatusMutation = createMutation({
    mutationFn: (id: string) => {
      console.log('Toggling staff status with id:', id);
      return _axios.patch(`/staff/${id}/toggle-status`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffs'] });
      toast.success('Staff status toggled successfully');
    },
    onError: (error: any) => {
      console.error('Toggle staff status error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const message = error.response?.data?.message || 'Failed to toggle staff status';
      toast.error(message);
    },
  });

  function resetSelectedStaff() {
    selectedStaff = {
      name: '',
      email: '',
      type: 'other',
      isActive: true,
      institutionId: institutionId(),
    };
  }

  function handleCreateEdit() {
    if (!validateForm()) return;
    if (isEditing) {
      $updateStaffMutation.mutate(selectedStaff);
    } else {
      $createStaffMutation.mutate(selectedStaff);
    }
  }

  function openCreateModal() {
    isEditing = false;
    resetSelectedStaff();
    showCreateEditModal = true;
  }

  function openEditModal(staff: any) {
    isEditing = true;
    selectedStaff = {
      id: staff.id,
      name: staff.name || '',
      email: staff.email || '',
      type: staff.type || 'other',
      isActive: staff.isActive,
      institutionId: institutionId(),
    };
    showCreateEditModal = true;
  }

  function openDeleteDialog(staff: any) {
    selectedStaff = { ...staff, type: staff.type || 'other', isActive: true };
    showDeleteDialog = true;
  }

  function handleDelete() {
    if (selectedStaff.id) {
      $deleteStaffMutation.mutate(selectedStaff.id);
    }
  }

  function handleToggleStatus(staff: any) {
    if (staff.id) {
      $toggleStaffStatusMutation.mutate(staff.id);
    }
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      $staffsQuery.refetch();
    }
  }
</script>

<main class="flex-1 p-6 bg-gradient-to-br from-gray-50 to-blue-100">
  <div class="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-semibold text-gray-800">Manage Staff</h2>
      </div>
      <div class="relative flex gap-4 ">
        <button
        class="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-2 py-2 px-4 rounded-md"
        onclick={openCreateModal}
      >
        <Icon icon="mdi:plus" class="h-5 w-5" />
        <span class="whitespace-nowrap">Add Staff</span>
      </button>
        <input
          type="text"
          placeholder="Search staff..."
          bind:value={searchQuery}
          oninput={handleSearchInput}
          class="w-full pr-10 py-2 px-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
        {#if searchQuery}
          <Icon
            icon="mdi:clear-outline"
            onclick={() => {
              searchQuery = '';
              handleSearchInput({ target: { value: '' } });
            }}
            class="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer h-5 w-5 text-gray-500"
          />
        {:else}
          <Icon
            icon="mdi:magnify"
            class="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"
          />
        {/if}
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-100">
            <th class="p-3 text-left">Sl.no</th>
            <th class="p-3 text-left">Name</th>
            <th class="p-3 text-left">Email</th>
            <th class="p-3 text-left">Type</th>
            <th class="p-3 text-left">Status</th>
            <th class="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {#if $staffsQuery.isLoading}
            <tr>
              <td colspan="6" class="p-3 text-center text-gray-600">
                Loading...
              </td>
            </tr>
          {:else if $staffsQuery.isError}
            <tr>
              <td colspan="6" class="p-3 text-center text-red-600">
                Error: {$staffsQuery.error?.message}
              </td>
            </tr>
          {:else if staffData.length === 0}
            <tr>
              <td colspan="6" class="p-3 text-center text-gray-600">
                No staffs found.
              </td>
            </tr>
          {:else}
            {#each staffData as staff, i}
              <tr class="border-b hover:bg-gray-50">
                <td class="p-3">{i + 1 + (currentPage - 1) * itemsPerPage}</td>
                <td class="p-3">
                  <button
                    class="text-blue-600 hover:underline text-left"
                    onclick={() => goto(`/super-admin/staff-management/${staff.id}`)}
                  >
                    {staff.name}
                  </button>
                </td>
                <td class="p-3">{staff.email}</td>
                <td class="p-3">{staff.type}</td>
                <td class="p-3">
                  <Switch
                    checked={staff.isActive}
                    onCheckedChange={() => handleToggleStatus(staff)}
                    class="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-200"
                  />
                </td>
                <td class="p-3">
                  <div class="flex space-x-2">
                    <button
                      class="border border-gray-300 hover:bg-gray-200 py-1 px-2 rounded"
                      onclick={() => openEditModal(staff)}
                    >
                      <Icon icon="mdi:pencil" class="h-4 w-4" />
                    </button>
                    <button
                      class="bg-red-600 text-white hover:bg-red-700 py-1 px-2 rounded"
                      onclick={() => openDeleteDialog(staff)}
                    >
                      <Icon icon="mdi:delete" class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>

    {#if totalPages > 1}
      <div class="flex justify-center items-center space-x-2 mt-6">
        <button
          class="border border-gray-300 py-2 px-4 rounded disabled:opacity-50"
          disabled={currentPage === 1}
          onclick={() => goToPage(currentPage - 1)}
        >
          Previous
        </button>
        {#each Array(totalPages) as _, i}
          <button
            class="{currentPage === i + 1 ? 'bg-blue-600 text-white' : 'border border-gray-300'} py-2 px-4 rounded"
            onclick={() => goToPage(i + 1)}
          >
            {i + 1}
          </button>
        {/each}
        <button
          class="border border-gray-300 py-2 px-4 rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
          onclick={() => goToPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    {/if}
  </div>

  {#if showCreateEditModal}
    <div class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold">{isEditing ? 'Edit Staff' : 'Add Staff'}</h3>
        <p class="text-gray-600 mb-4">
          {isEditing ? 'Update the staff details below.' : 'Enter the details for the new staff.'}
        </p>
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <label for="name" class="w-1/4 text-right">Name</label>
            <div class="w-3/4">
              <input
                id="name"
                bind:value={selectedStaff.name}
                placeholder="Full Name"
                class="w-full py-2 px-3 border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              onclick={(e)=>e.stopPropagation(e)}
              />
              {#if formErrors.name}
                <p class="text-red-500 text-sm">{formErrors.name}</p>
              {/if}
            </div>
          </div>

          <div class="flex items-center gap-4">
            <label for="email" class="w-1/4 text-right">Email</label>
            <div class="w-3/4">
              <input
                id="email"
                type="email"
                bind:value={selectedStaff.email}
                placeholder="email@example.com"
                class="w-full py-2 px-3 border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              onclick={(e)=>e.stopPropagation(e)}
              />
              {#if formErrors.email}
                <p class="text-red-500 text-sm">{formErrors.email}</p>
              {/if}
            </div>
          </div>

          <div class="flex items-center gap-4">
            <label for="type" class="w-1/4 text-right">Type</label>
            <div class="w-3/4">
              <select
                id="type"
                bind:value={selectedStaff.type}
                class="w-full py-2 px-3 border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              onclick={(e)=>e.stopPropagation(e)}
              >
                <option value="teacher">Teacher</option>
                <option value="clerk">Clerk</option>
                <option value="librarian">Librarian</option>
                <option value="other">Other</option>
              </select>
              {#if formErrors.type}
                <p class="text-red-500 text-sm">{formErrors.type}</p>
              {/if}
            </div>
          </div>

          <div class="flex items-center gap-4">
            <label for="institutionId" class="w-1/4 text-right">Institution ID</label>
            <div class="w-3/4">
              <input
                id="institutionId"
                value={institutionId() || ''}
                disabled
                class="w-full py-2 px-3 bg-gray-100 border border-gray-300 rounded"
              onclick={(e)=>e.stopPropagation(e)}
              />
              {#if formErrors.institutionId}
                <p class="text-red-500 text-sm">{formErrors.institutionId}</p>
              {/if}
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <button
            class="border border-gray-300 py-2 px-4 rounded hover:bg-gray-200"
            onclick={() => (showCreateEditModal = false)}
          >
            Cancel
          </button>
          <button
            class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            onclick={handleCreateEdit}
            disabled={$createStaffMutation.isPending || $updateStaffMutation.isPending}
          >
            {#if $createStaffMutation.isPending || $updateStaffMutation.isPending}
              <Icon icon="mdi:loading" class="h-4 w-4 animate-spin inline mr-2" />
            {/if}
            {isEditing ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  {/if}

  {#if showDeleteDialog}
    <div class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold">Are you sure you want to delete this staff?</h3>
        <p class="text-gray-600 mb-4">
          This action cannot be undone. The staff "{selectedStaff.name}" will be permanently deleted.
        </p>
        <div class="flex justify-end gap-2">
          <button
            class="border border-gray-300 py-2 px-4 rounded hover:bg-gray-200"
            onclick={() => (showDeleteDialog = false)}
          >
            Cancel
          </button>
          <button
            class="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            onclick={handleDelete}
            disabled={$deleteStaffMutation.isPending}
          >
            {#if $deleteStaffMutation.isPending}
              <Icon icon="mdi:loading" class="h-4 w-4 animate-spin inline mr-2" />
            {/if}
            Delete
          </button>
        </div>
      </div>
    </div>
  {/if}
</main>

<style>
  button:hover {
    transform: scale(1.05);
    transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
  }
</style>
