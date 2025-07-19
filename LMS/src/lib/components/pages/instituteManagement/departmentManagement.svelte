<script lang="ts">
    import { goto } from '$app/navigation';
    import Icon from '@iconify/svelte';
    import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
    import { _axios } from '$lib/_axios';
    import { page } from '$app/stores';
    import { toast } from 'svelte-sonner';
    import { Switch } from "$lib/components/ui/switch/index.js";
  
    // Get institutionId from URL params
    const institutionId = $derived(() => {
      const pathSegments = $page.url.pathname.split('/');
      const institutionIndex = pathSegments.findIndex(segment => segment === 'institute-management');
      return institutionIndex !== -1 && pathSegments[institutionIndex + 1] ? pathSegments[institutionIndex + 1] : null;
    });
  
    // Query client for invalidating queries
    const queryClient = useQueryClient();
  
    // State for UI
    let searchQuery = $state('');
    let currentPage = $state(1);
    const itemsPerPage = 5;
    let showCreateEditModal = $state(false);
    let showDeleteDialog = $state(false);
    let selectedDepartment = $state<{
      id?: string;
      name: string;
      institutionId?: string;
      isActive: boolean;
    }>({
      name: '',
      institutionId: institutionId(),
      isActive: true
    });
    let isEditing = $state(false);
    let debounceTimeout: ReturnType<typeof setTimeout>;
  
    // Handle search with debounce
    $effect(() => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        currentPage = 1;
        $departmentsQuery.refetch();
      }, 300);
    });
  
    function handleSearchInput(event: Event) {
      const inputElement = event.target as HTMLInputElement;
      searchQuery = inputElement.value;
    }
  
    const departmentsQuery = createQuery({
      queryKey: ['departments', searchQuery, currentPage, institutionId()],
      queryFn: async () => {
        try {
          const response = await _axios.get('/departments/', {
            params: {
              search: searchQuery,
              page: currentPage,
              limit: itemsPerPage,
              institutionId: institutionId(),
            },
          });
          return response.data;
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Failed to fetch departments');
          throw new Error(error.response?.data?.message || 'Failed to fetch departments');
        }
      },
    });
  
    // Derived state for pagination
    const departmentsData = $derived($departmentsQuery.data?.data || []);
    const totalItems = $derived($departmentsQuery.data?.pagination?.totalItems || 0);
    const totalPages = $derived(Math.ceil(totalItems / itemsPerPage));
  
    let formErrors = $state({
      name: '',
      institutionId: '',
    });
  
    function validateForm(): boolean {
      formErrors = { name: '', institutionId: '' };
      let isValid = true;
  
      if (!selectedDepartment.name.trim()) {
        formErrors.name = 'Name is required';
        isValid = false;
      }
  
      return isValid;
    }
  
    const createDepartmentMutation = createMutation({
      mutationFn: (data: typeof selectedDepartment) => {
        return _axios.post('/departments', {
          name: data.name.trim(),
          institutionId: institutionId(),
        });
      },
      onSuccess: () => {
        toast.success('Department created successfully');
        queryClient.invalidateQueries({ queryKey: ['departments'] });
        showCreateEditModal = false;
        resetSelectedDepartment();
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to create department');
      }
    });
  
    const updateDepartmentMutation = createMutation({
      mutationFn: (data: typeof selectedDepartment) => {
        return _axios.put(`/departments/${data.id}`, {
          name: data.name.trim(),
          institutionId: institutionId(),
        });
      },
      onSuccess: () => {
        toast.success('Department updated successfully');
        queryClient.invalidateQueries({ queryKey: ['departments'] });
        showCreateEditModal = false;
        resetSelectedDepartment();
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to update department');
      }
    });
  
    const deleteDepartmentMutation = createMutation({
      mutationFn: (id: string) => _axios.delete(`/departments/${id}`),
      onSuccess: () => {
        toast.success('Department deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['departments'] });
        showDeleteDialog = false;
        resetSelectedDepartment();
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to delete department');
      }
    });
  
    const toggleDepartmentStatusMutation = createMutation({
      mutationFn: (id: string) => _axios.patch(`/departments/${id}/toggle-status`),
      onSuccess: () => {
        toast.success('Department status toggled successfully');
        queryClient.invalidateQueries({ queryKey: ['departments'] });
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to toggle department status');
      }
    });
  
    function resetSelectedDepartment() {
      selectedDepartment = {
        name: '',
        institutionId: institutionId(),
        isActive: true
      };
    }
  
    function handleCreateEdit() {
      if (!validateForm()) return;
      if (isEditing && selectedDepartment.id) {
        $updateDepartmentMutation.mutate(selectedDepartment);
      } else {
        $createDepartmentMutation.mutate(selectedDepartment);
      }
    }
  
    function openCreateModal() {
      isEditing = false;
      resetSelectedDepartment();
      showCreateEditModal = true;
    }
  
    function openEditModal(department: any) {
      isEditing = true;
      selectedDepartment = {
        id: department.id,
        name: department.name || '',
        institutionId: institutionId(),
        isActive: department.isActive
      };
      showCreateEditModal = true;
    }
  
    function openDeleteDialog(department: any) {
      selectedDepartment = {
        ...department,
        institutionId: institutionId(),
        isActive: department.isActive
      };
      showDeleteDialog = true;
    }
  
    function handleDelete() {
      if (selectedDepartment.id) {
        $deleteDepartmentMutation.mutate(selectedDepartment.id);
      }
    }
  
    function handleToggleStatus(department: any) {
      if (department.id) {
        $toggleDepartmentStatusMutation.mutate(department.id);
      }
    }
  
    function goToPage(page: number) {
      if (page >= 1 && page <= totalPages) {
        currentPage = page;
        $departmentsQuery.refetch();
      }
    }
  </script>
  
  <main class="flex-1 p-6 bg-gradient-to-br from-gray-50 to-blue-100">
    <div class="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-semibold text-gray-800">Manage Departments</h2>
        </div>
        <div class="relative flex gap-4">
          <button
            class="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-2 py-2 px-4 rounded-md"
            onclick={openCreateModal}
          >
            <Icon icon="mdi:plus" class="h-5 w-5" />
            <span class="whitespace-nowrap">Add Department</span>
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
              <th class="p-3 text-left">Status</th>
              <th class="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {#if $departmentsQuery.isLoading}
              <tr>
                <td colspan="4" class="p-3 text-center text-gray-600">
                  Loading...
                </td>
              </tr>
            {:else if $departmentsQuery.isError}
              <tr>
                <td colspan="4" class="p-3 text-center text-red-600">
                  Error: {$departmentsQuery.error?.message}
                </td>
              </tr>
            {:else if departmentsData.length === 0}
              <tr>
                <td colspan="4" class="p-3 text-center text-gray-600">
                  No departments found.
                </td>
              </tr>
            {:else}
              {#each departmentsData as department, i}
                <tr class="border-b hover:bg-gray-50">
                  <td class="p-3">{i + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td class="p-3">
                    <button
                      class="text-blue-600 hover:underline text-left"
                      onclick={() => goto(`/super-admin/department-management/${department.id}`)}
                    >
                      {department.name}
                    </button>
                  </td>
                  <td class="p-3">
                    <Switch
                      checked={department.isActive}
                      onchange={() => handleToggleStatus(department)}
                      class="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-200"
                    />
                  </td>
                  <td class="p-3">
                    <div class="flex space-x-2">
                      <button
                        class="border border-gray-300 hover:bg-gray-200 py-1 px-2 rounded"
                        onclick={() => openEditModal(department)}
                      >
                        <Icon icon="mdi:pencil" class="h-4 w-4" />
                      </button>
                      <button
                        class="bg-red-600 text-white hover:bg-red-700 py-1 px-2 rounded"
                        onclick={() => openDeleteDialog(department)}
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
  
    <!-- Create/Edit Modal -->
    {#if showCreateEditModal}
      <div class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">
            {isEditing ? 'Edit Department' : 'Add Department'}
          </h3>
  
          <div class="space-y-4">
            <div class="flex flex-col gap-4">
              <div class="flex flex-col gap-2">
                <label for="name" class="text-sm font-medium">Name</label>
                <input
                  id="name"
                  bind:value={selectedDepartment.name}
                  placeholder="Department Name"
                  class="w-full py-2 px-3 border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                {#if formErrors.name}
                  <p class="text-red-500 text-sm mt-1">{formErrors.name}</p>
                {/if}
              </div>
  
              <div class="flex flex-col gap-2">
                <label for="institutionId" class="text-sm font-medium">Institution ID</label>
                <input
                  id="institutionId"
                  value={institutionId() || ''}
                  disabled
                  class="w-full py-2 px-3 bg-gray-100 border border-gray-300 rounded"
                />
                {#if formErrors.institutionId}
                  <p class="text-red-500 text-sm mt-1">{formErrors.institutionId}</p>
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
              class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-70"
              onclick={handleCreateEdit}
              disabled={$createDepartmentMutation.isPending || $updateDepartmentMutation.isPending}
            >
              {#if $createDepartmentMutation.isPending || $updateDepartmentMutation.isPending}
                <Icon icon="mdi:loading" class="h-4 w-4 animate-spin inline mr-2" />
              {/if}
              {isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    {/if}
  
    <!-- Delete Confirmation Dialog -->
    {#if showDeleteDialog}
      <div class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 class="text-lg font-semibold mb-2">Delete Department</h3>
          <p class="text-gray-600 mb-4">
            Are you sure you want to delete the department "{selectedDepartment.name}"? This action cannot be undone.
          </p>
          <div class="flex justify-end gap-2">
            <button
              class="border border-gray-300 py-2 px-4 rounded hover:bg-gray-200"
              onclick={() => (showDeleteDialog = false)}
            >
              Cancel
            </button>
            <button
              class="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 disabled:opacity-70"
              onclick={handleDelete}
              disabled={$deleteDepartmentMutation.isPending}
            >
              {#if $deleteDepartmentMutation.isPending}
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
    button:hover:not(:disabled) {
      transform: scale(1.02);
      transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
    }
  </style>
  