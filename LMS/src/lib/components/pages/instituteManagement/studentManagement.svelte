<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import * as Button from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Input from '$lib/components/ui/input';
  import * as Select from '$lib/components/ui/select';
  import { Switch } from '$lib/components/ui/switch';
  import * as Table from '$lib/components/ui/table';
  import Icon from '@iconify/svelte';
  import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
  import { _axios } from '$lib/_axios';
  import { toast } from 'svelte-sonner';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  interface Student {
    id?: string;
    name: string;
    classId: string;
    isActive: boolean;
    createdAt?: string;
    class?: Class; // Add class property to include class details
    institution?: any; // Add institution property to include institution details
  }

  interface Class {
    _id: string;
    grade: string;
    section: string;
  }

  interface Pagination {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  }

  interface StudentsResponse {
    message: string;
    data: Student[];
    pagination: Pagination;
  }

  interface ClassesResponse {
    message: string;
    data: Class[];
  }

  // Query client for invalidating queries
  const queryClient = useQueryClient();

  // State for UI
  let searchQuery = $state('');
  let currentPage = $state(1);
  const itemsPerPage = 5;
  let showAddEditDialog = $state(false);
  let showDeleteDialog = $state(false);
  let selectedStudentId: string | null = $state(null);
  let studentToDelete: string | null = $state(null);
  let isEditMode = $state(false);
  let debounceTimeout: ReturnType<typeof setTimeout>;

  let form = $state({
    name: '',
    classId: '',
    isActive: true,
  });

  let formErrors = $state({
    name: '',
    classId: '',
  });

  const institutionId = $derived(() => {
    const pathSegments = $page.url.pathname.split('/');
    const institutionIndex = pathSegments.findIndex(segment => segment === 'institute-management');
    return institutionIndex !== -1 && pathSegments[institutionIndex + 1] ? pathSegments[institutionIndex + 1] : null;
  });

  // Query for fetching students
  const studentsQuery = createQuery({
    queryKey: ['students', searchQuery, currentPage, institutionId()],
    queryFn: async () => {
      console.log('Fetching students:', searchQuery, 'page:', currentPage, 'institutionId:', institutionId());
      try {
        const response = await _axios.get('/students/', {
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
        toast.error(error.response?.data?.message || 'Failed to fetch students');
        throw new Error(error.response?.data?.message || 'Failed to fetch students');
      }
    },
  });

  // Query for fetching classes
  const classesQuery = createQuery<ClassesResponse, Error>({
    queryKey: ['classes', institutionId()],
    queryFn: async () => {
      console.log('Fetching classes with institutionId:', institutionId());
      try {
        const response = await _axios.get<ClassesResponse>('/classes/', {
          params: {
            institutionId: institutionId(),
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

  // Derived state for UI
  const studentsData = $derived($studentsQuery.data?.data || []);
  const totalItems = $derived($studentsQuery.data?.pagination?.totalItems || 0);
  const totalPages = $derived(Math.ceil(totalItems / itemsPerPage));
  const classes = $derived(
    $classesQuery.data?.data.map((cls) => ({
      id: cls._id,
      label: `${cls.grade}  ${cls.section}`,
    })) || [],
  );

  // Toggle student status mutation
  const toggleStudentStatusMutation = createMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => {
      return _axios.patch(`/students/${id}/toggle-status`, { isActive: !isActive });
    },
    onSuccess: () => {
      toast.success('Student status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update student status');
    },
  });

  function toggleStudentStatus(id: string, isActive: boolean) {
    if (!id) {
      toast.error('Invalid student ID');
      return;
    }
    $toggleStudentStatusMutation.mutate({ id, isActive });
  }

  const createStudentMutation = createMutation({
    mutationFn: (data: Student) => {
      return _axios.post('/students', { ...data, institutionId: institutionId() });
    },
    onSuccess: () => {
      toast.success('Student created successfully');
      queryClient.invalidateQueries({ queryKey: ['students'] });
      showAddEditDialog = false;
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create student');
    },
  });

  const updateStudentMutation = createMutation({
    mutationFn: (data: Student) => {
      return _axios.put(`/students/${data.id}`, { ...data, institutionId: institutionId() });
    },
    onSuccess: () => {
      toast.success('Student updated successfully');
      queryClient.invalidateQueries({ queryKey: ['students'] });
      showAddEditDialog = false;
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update student');
    },
  });

  const deleteStudentMutation = createMutation({
    mutationFn: (id: string) => _axios.delete(`/students/${id}`),
    onSuccess: () => {
      toast.success('Student deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['students'] });
      showDeleteDialog = false;
      studentToDelete = null;
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete student');
    },
  });

  function validateForm(): boolean {
    formErrors = { name: '', classId: '' };
    let isValid = true;

    if (!form.name.trim()) {
      formErrors.name = 'Name is required';
      isValid = false;
    }

    if (!form.classId) {
      formErrors.classId = 'Class is required';
      isValid = false;
    }

    return isValid;
  }

  function resetForm() {
    form = {
      name: '',
      classId: '',
      isActive: true,
    };
    formErrors = { name: '', classId: '' };
    selectedStudentId = null;
  }

  function openAddDialog() {
    isEditMode = false;
    resetForm();
    showAddEditDialog = true;
  }

  function openEditDialog(student: Student) {
    if (!student.id) {
      toast.error('Invalid student ID');
      return;
    }
    isEditMode = true;
    selectedStudentId = student.id;
    form = {
      name: student.name,
      classId: student.classId,
      isActive: student.isActive,
    };
    showAddEditDialog = true;
  }

  function handleSubmit() {
    if (!validateForm()) return;

    if (isEditMode && selectedStudentId) {
      $updateStudentMutation.mutate({ ...form, id: selectedStudentId });
    } else {
      $createStudentMutation.mutate(form);
    }
  }

  function openDeleteDialog(id: string) {
    if (!id) {
      toast.error('Invalid student ID');
      return;
    }
    studentToDelete = id;
    showDeleteDialog = true;
  }

  function handleDelete() {
    if (studentToDelete) {
      $deleteStudentMutation.mutate(studentToDelete);
    }
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      queryClient.invalidateQueries({ queryKey: ['students'] });
    }
  }

  function handleSearchInput(event: Event) {
    clearTimeout(debounceTimeout);
    const inputElement = event.target as HTMLInputElement;
    searchQuery = inputElement.value;
    currentPage = 1; // Reset to first page on search

    debounceTimeout = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    }, 300); // Debounce delay of 300ms
  }

  function getClassLabel(classId: string): string {
    const cls = classes.find((c) => c.id === classId);
    return cls ? cls.label : 'Unknown';
  }

  // Debug logging
  $effect(() => {
    console.log('Institution ID:', institutionId());
    console.log('Students Query Status:', {
      isLoading: $studentsQuery.isLoading,
      isError: $studentsQuery.isError,
      error: $studentsQuery.error,
      data: $studentsQuery.data
    });
  });
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center">
    <h3 class="text-lg font-semibold text-gray-800">Student Management</h3>
    <Button.Root onclick={openAddDialog} class="bg-blue-600 hover:bg-blue-700 text-white">
      <Icon icon="mdi:plus" class="h-5 w-5 mr-2" />
      Add Student
    </Button.Root>
  </div>

  <Card.Root class="bg-white rounded-xl shadow-lg">
    <Card.Content>
      <div class="mb-4">
        <Input.Root placeholder="Search students..." bind:value={searchQuery} oninput={handleSearchInput} />
      </div>
      {#if $studentsQuery.isLoading}
        <div class="text-center py-8 text-gray-500">
          <Icon icon="mdi:loading" class="h-12 w-12 mx-auto text-gray-400 animate-spin" />
          <p>Loading...</p>
        </div>
      {:else if $studentsQuery.isError}
        <div class="text-center py-8 text-red-500">
          <Icon icon="mdi:alert-circle" class="h-12 w-12 mx-auto text-red-400" />
          <p>Error: {$studentsQuery.error?.message}</p>
        </div>
      {:else if studentsData.length === 0}
        <div class="text-center py-8 text-gray-500">
          <Icon icon="mdi:account-group" class="h-12 w-12 mx-auto text-gray-400" />
          <p>No students found. Add a student to get started.</p>
        </div>
      {:else}
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head>Name</Table.Head>
              <Table.Head>Class</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head>Created At</Table.Head>
              <Table.Head class="text-right">Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#each studentsData as student}
              <Table.Row class="hover:bg-gray-50">
                <Table.Cell>{student.name}</Table.Cell>
                <Table.Cell>{student.class?.grade} {student.class?.section}</Table.Cell>
                <Table.Cell>
                  <Switch
                    checked={student.isActive}
                    onchange={() => toggleStudentStatus(student.id || '', student.isActive)}
                    disabled={!student.id}
                  />
                </Table.Cell>
                <Table.Cell>{new Date(student.createdAt || '').toLocaleDateString()}</Table.Cell>
                <Table.Cell class="text-right">
                  <Button.Root
                    variant="outline"
                    size="sm"
                    class="mr-2"
                    onclick={() => openEditDialog(student)}
                    disabled={!student.id}
                  >
                    <Icon icon="mdi:pencil" class="h-4 w-4 mr-1" />
                    Edit
                  </Button.Root>
                  <Button.Root
                    variant="destructive"
                    size="sm"
                    onclick={() => openDeleteDialog(student.id || '')}
                    disabled={!student.id}
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

<Dialog.Root bind:open={showAddEditDialog}>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>{isEditMode ? 'Edit Student' : 'Add Student'}</Dialog.Title>
      <Dialog.Description>
        {isEditMode ? 'Update the student details below.' : 'Enter details for the new student.'}
      </Dialog.Description>
    </Dialog.Header>
    <div class="grid gap-4 py-4">
      <div class="grid grid-cols-4 items-center gap-4">
        <label for="name" class="text-right">Name</label>
        <div class="col-span-3">
          <Input.Root
            id="name"
            bind:value={form.name}
            placeholder="Enter name"
            class="{formErrors.name ? 'border-red-500' : ''}"
          />
          {#if formErrors.name}
            <p class="text-red-500 text-sm">{formErrors.name}</p>
          {/if}
        </div>
      </div>
      <div class="grid grid-cols-4 items-center gap-4">
        <label for="classId" class="text-right">Class</label>
        <div class="col-span-3">
          <Select.Root bind:value={form.classId}>
            <Select.Trigger class="{formErrors.classId ? 'border-red-500' : ''}">
              <Select.Value placeholder="Select class">
                {form.classId && classes.find(cls => cls.id === form.classId)?.label}
              </Select.Value>
            </Select.Trigger>
            <Select.Content>
              {#if $classesQuery.isLoading}
                <Select.Item value="" disabled>Loading classes...</Select.Item>
              {:else if $classesQuery.isError}
                <Select.Item value="" disabled>Error loading classes</Select.Item>
              {:else}
                {#each classes as cls}
                  <Select.Item value={cls.id}>{cls.label}</Select.Item>
                {/each}
              {/if}
            </Select.Content>
          </Select.Root>
          {#if formErrors.classId}
            <p class="text-red-500 text-sm">{formErrors.classId}</p>
          {/if}
        </div>
      </div>
    </div>
    <Dialog.Footer>
      <Button.Root variant="outline" onclick={() => (showAddEditDialog = false)}>
        Cancel
      </Button.Root>
      <Button.Root onclick={handleSubmit}>
        {isEditMode ? 'Update' : 'Add'}
      </Button.Root>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={showDeleteDialog}>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Delete Student</Dialog.Title>
      <Dialog.Description>
        Are you sure you want to delete this student? This action cannot be undone.
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
