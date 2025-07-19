<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import * as Button from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Input from '$lib/components/ui/input';
  import * as Select from '$lib/components/ui/select';
  import { Switch } from "$lib/components/ui/switch/index.js";
  import * as Table from '$lib/components/ui/table';
  import Icon from '@iconify/svelte';
  import { onMount } from 'svelte';
  import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
  import { _axios } from '$lib/_axios';
  import { page } from '$app/stores';
  import { toast } from 'svelte-sonner';

  interface Class {
	_id: string;
    id?: string;
    grade?: string;
    section?: string;
    institutionId?: string;
    departmentId?: string;
    isActive: boolean;
    createdAt?: string;
  }

  interface Pagination {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  }

  interface ClassesResponse {
    message: string;
    data: Class[];
    pagination: Pagination;
  }

  // Reactive statement to get institutionId from URL
  const getInstitutionId = () => {
    const pathSegments = $page.url.pathname.split('/');
    const institutionIndex = pathSegments.findIndex(segment => segment === 'institute-management');
    return institutionIndex !== -1 && pathSegments[institutionIndex + 1] ? pathSegments[institutionIndex + 1] : null;
  };

  let institutionId = $derived(getInstitutionId());

  // Query client for invalidating queries
  const queryClient = useQueryClient();

  // State for UI
  let searchQuery = $state('');
  let currentPage = $state(1);
  const itemsPerPage = 5;
  let showCreateEditModal = $state(false);
  let showDeleteDialog = $state(false);
  let selectedClass = $state<Class>({
    grade: '',
    section: '',
    institutionId: institutionId,
    isActive: true
  });
  let isEditing = $state(false);
  let debounceTimeout: ReturnType<typeof setTimeout>;

  // Handle search with debounce
  $effect(() => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      currentPage = 1;
      $classesQuery.refetch();
    }, 300);
  });

  function handleSearchInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    searchQuery = inputElement.value;
  }

  const toggleClassStatusMutation = createMutation<void, Error, { id: string; isActive: boolean }>({
  mutationFn: ({ id, isActive }) => {
    return _axios.patch(`/classes/${id}/toggle-status`, { isActive });
  },
  onSuccess: () => {
    toast.success('Class status updated successfully');
    queryClient.invalidateQueries({ queryKey: ['classes'] });
  },
  onError: (error: Error) => {
    toast.error(error.message || 'Failed to update class status');
  },
});


function toggleClassStatus(id: string, isActive: boolean) {
  console.log('Toggling class status with id:', id, 'isActive:', isActive);
  $toggleClassStatusMutation.mutate({ id, isActive });
}


  const classesQuery = createQuery<ClassesResponse, Error>({
    queryKey: ['classes', searchQuery, currentPage, institutionId],
    queryFn: async () => {
      console.log('Fetching classes with search:', searchQuery, 'page:', currentPage, 'institutionId:', institutionId);
      try {
        const response = await _axios.get<ClassesResponse>('/classes/', {
          params: {
            search: searchQuery,
            page: currentPage,
            limit: itemsPerPage,
            institutionId: institutionId,
          },
        });
        return response.data;
      } catch (error: any) {
        console.error('API fetch error:', error.message, error.response?.data);
        toast.error(error.response?.data?.message || 'Failed to fetch classes');
        throw new Error(error.response?.data?.message || 'Failed to fetch classes');
      }
    },
  });

  // Derived state for pagination
  const classesData = $derived($classesQuery.data?.data || []);
  const totalItems = $derived($classesQuery.data?.pagination?.totalItems || 0);
  const totalPages = $derived(Math.ceil(totalItems / itemsPerPage));

  let formErrors = $state({
    name: '',
    institutionId: '',
  });

  function validateForm(): boolean {
    formErrors = { grade: '',section:'', institutionId: '' };
    let isValid = true;

    if (!selectedClass.grade.trim()||!selectedClass.section.trim()) {
      formErrors.name = 'Grade is required';
      isValid = false;
    }

    return isValid;
  }

  const createClassMutation = createMutation<Class, Error, Class>({
    mutationFn: (data: Class) => {
      return _axios.post('/classes', {
        grade: data.grade,
        section: data.section,
        institutionId: institutionId,
        departmentId: data.departmentId,
      });
    },
    onSuccess: () => {
      toast.success('Class created successfully');
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      showCreateEditModal = false;
      resetSelectedClass();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create class');
    }
  });

  const updateClassMutation = createMutation<Class, Error, Class>({
  mutationFn: (data: Class) => {
    const payload = {
      grade: data.grade,
      section: data.section,
      institutionId: institutionId,
    };

    // Conditionally include departmentId
    if (data.departmentId) {
      payload.departmentId = data.departmentId;
    }

    return _axios.put(`/classes/${data.id}`, payload);
  },
  onSuccess: () => {
    toast.success('Class updated successfully');
    queryClient.invalidateQueries({ queryKey: ['classes'] });
    showCreateEditModal = false;
    resetSelectedClass();
  },
  onError: (error: Error) => {
    toast.error(error.message || 'Failed to update class');
  },
});


  const deleteClassMutation = createMutation<void, Error, string>({
    mutationFn: (id: string) => _axios.delete(`/classes/${id}`),
    onSuccess: () => {
      toast.success('Class deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      showDeleteDialog = false;
      resetSelectedClass();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete class');
    },
  });

  function resetSelectedClass() {
    selectedClass = {
      grade: '',
      section: '',
      institutionId: institutionId,
      isActive: true
    };
  }

  function handleCreateEdit() {
  if (!validateForm()) return;

  // Create a copy of the selectedClass object
  const classData = { ...selectedClass };

  // Remove departmentId if it's not applicable (e.g., for schools)
  if (!isDepartmentIdApplicable()) {
    delete classData.departmentId;
  }

  if (isEditing && selectedClass.id) {
    $updateClassMutation.mutate(classData);
  } else {
    $createClassMutation.mutate(classData);
  }
}

function isDepartmentIdApplicable(): boolean {
 
  return institutionId?.type === 'college'; // Replace with actual logic
}


  function openCreateModal() {
    isEditing = false;
    resetSelectedClass();
    showCreateEditModal = true;
  }

  function openEditModal(cls: Class) {
    isEditing = true;
    selectedClass = {
      id: cls.id,
      grade: cls.grade || '',
      section: cls.section || '',
      institutionId: institutionId,
      departmentId: cls.departmentId || '',
      isActive: cls.isActive
    };
    showCreateEditModal = true;
  }

  function openDeleteDialog(cls: Class) {
    selectedClass = { ...cls, institutionId: institutionId };
    showDeleteDialog = true;
  }

  function handleDelete() {
    if (selectedClass.id) {
      $deleteClassMutation.mutate(selectedClass.id);
    }
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      $classesQuery.refetch();
    }
  }
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center">
    <h3 class="text-lg font-semibold text-gray-800">Class Management</h3>
    <Button.Root onclick={openCreateModal} class="bg-blue-600 hover:bg-blue-700 text-white">
      <Icon icon="mdi:plus" class="h-5 w-5 mr-2" />
      Add Class
    </Button.Root>
  </div>

  <Card.Root class="bg-white rounded-xl shadow-lg">
    <Card.Content>
      {#if $classesQuery.isLoading}
        <div class="text-center py-8 text-gray-500">
          <Icon icon="mdi:loading" class="h-12 w-12 mx-auto text-gray-400 animate-spin" />
          <p>Loading...</p>
        </div>
      {:else if $classesQuery.isError}
        <div class="text-center py-8 text-red-500">
          <Icon icon="mdi:alert-circle" class="h-12 w-12 mx-auto text-red-400" />
          <p>Error: {$classesQuery.error?.message}</p>
        </div>
      {:else if classesData.length === 0}
        <div class="text-center py-8 text-gray-500">
          <Icon icon="mdi:google-classroom" class="h-12 w-12 mx-auto text-gray-400" />
          <p>No classes found. Add a class to get started.</p>
        </div>
      {:else}
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head>Grade</Table.Head>
              <Table.Head>Section</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head>Created At</Table.Head>
              <Table.Head class="text-right">Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#each classesData as cls}
              <Table.Row class="hover:bg-gray-50">
                <Table.Cell>{cls.grade}</Table.Cell>
                <Table.Cell>{cls.section}</Table.Cell>
                <Table.Cell>
                  <Switch
                checked={cls.isActive}
                onCheckedChange={() => toggleClassStatus(cls.id, cls.isActive)}
                />
                </Table.Cell>
                <Table.Cell>{new Date(cls?.createdAt).toLocaleDateString()}</Table.Cell>
                <Table.Cell class="text-right">
                  <Button.Root
                    variant="outline"
                    size="sm"
                    class="mr-2"
                    onclick={() => openEditModal(cls)}
                  >
                    <Icon icon="mdi:pencil" class="h-4 w-4 mr-1" />
                    Edit
                  </Button.Root>
                  <Button.Root
                    variant="destructive"
                    size="sm"
                    onclick={() => openDeleteDialog(cls)}
                  >
                    <Icon icon="mdi:delete" class="h-4 w-4 mr-1" />
                    Delete
                  </Button.Root>
                </Table.Cell>
              </Table.Row>
            {/each}
          </Table.Body>
        </Table.Root>
      {/if}
    </Card.Content>
  </Card.Root>

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

<Dialog.Root bind:open={showCreateEditModal}>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>{isEditing ? 'Edit Class' : 'Add Class'}</Dialog.Title>
      <Dialog.Description>
        {isEditing ? 'Update the class details below.' : 'Enter details for the new class.'}
      </Dialog.Description>
    </Dialog.Header>
    <div class="grid gap-4 py-4">
      <div class="grid grid-cols-4 items-center gap-4">
        <label for="grade" class="text-right">Grade</label>
        <Input.Root
          id="grade"
          bind:value={selectedClass.grade}
          class="col-span-3"
          placeholder="Enter class grade"
        />
      </div>
      <div class="grid grid-cols-4 items-center gap-4">
        <label for="section" class="text-right">Section</label>
        <Input.Root
          id="section"
          bind:value={selectedClass.section}
          class="col-span-3"
          placeholder="Enter class section"
        />
      </div>
    </div>
    <Dialog.Footer>
      <Button.Root variant="outline" onclick={() => (showCreateEditModal = false)}>
        Cancel
      </Button.Root>
      <Button.Root onclick={handleCreateEdit}>
        {isEditing ? 'Update' : 'Add'}
      </Button.Root>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={showDeleteDialog}>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Delete Class</Dialog.Title>
      <Dialog.Description>
        Are you sure you want to delete this class? This action cannot be undone.
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Button.Root variant="outline" onclick={() => (showDeleteDialog = false)}>
        Cancel
      </Button.Root>
      <Button.Root variant="destructive" onclick={handleDelete}>
        Delete
      </Button.Root>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<style>
  button:hover:not(:disabled) {
    transform: scale(1.05);
    transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
  }
</style>
