<script lang="ts">
    import { goto } from '$app/navigation';
    import Icon from '@iconify/svelte';
    import * as Card from '$lib/components/ui/card';
    import * as Table from '$lib/components/ui/table';
    import * as Dialog from '$lib/components/ui/dialog';
    import { Input } from '$lib/components/ui/input';
    import * as Button from '$lib/components/ui/button';
    import * as AlertDialog from '$lib/components/ui/alert-dialog';
    import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
    import { _axios } from '$lib/_axios';
    import { page } from '$app/stores';
    import { tick } from 'svelte';

    // Route-to-icon and title mapping
    const routeConfig = {
        dashboard: { title: 'Dashboard', icon: 'mdi:view-dashboard' },
        instituteManagement: { title: 'Institute Management', icon: 'mdi:school' },
        default: { title: 'Home', icon: 'mdi:home' }
    };

    // Function to get title and icon from route path
    function getRouteConfig(pathname: string) {
        const route = pathname.split('/').filter(Boolean).pop() || 'default';
        const normalizedRoute = route.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        return routeConfig[normalizedRoute] || routeConfig.default;
    }

    // Reactive title and icon using $derived
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
    let selectedInstitute = $state<{
        id?: string;
        name: string;
        type: 'college' | 'school';
        address: string;
        contactDetails: { inchargePerson: string; mobileNumber: string; email?: string; officePhone?: string };
    }>({
        name: '',
        type: 'college',
        address: '',
        contactDetails: { inchargePerson: '', mobileNumber: '', email: '', officePhone: '' }
    });
    let isEditing = $state(false);
    let debounceTimeout: ReturnType<typeof setTimeout>;
        $effect(() => {
    // This effect will run whenever searchQuery changes
    console.log('Search query changed:', searchQuery);
    handleSearch();
});
function handleSearch() {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        console.log('Executing search with query:', searchQuery);
        currentPage = 1; // Reset to first page when searching
        $institutesQuery.refetch();
    }, 300);
}

    function handleSearchInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    searchQuery = inputElement.value;
    console.log('Search input changed to:', searchQuery);
    // The $effect above will handle the debouncing
}

    const institutesQuery = createQuery({
    queryKey: ['institutions', searchQuery, currentPage],
    queryFn: async () => {
        console.log('Fetching institutes with search:', searchQuery, 'page:', currentPage);
        try {
            const response = await _axios.get('/institutions/', {
                params: {
                    search: searchQuery,
                    page: currentPage,
                    limit: itemsPerPage
                }
            });
            console.log('API response:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('API fetch error:', error.message);
            throw new Error(error.response?.data?.message || 'Failed to fetch institutions');
        }
    }
});

    // Derived state for pagination
    const paginatedInstitutes = $derived($institutesQuery.data?.data || []);
    const totalItems = $derived($institutesQuery.data?.total || 0);
    const totalPages = $derived(Math.ceil(totalItems / itemsPerPage));

    let formErrors = $state({
        name: '',
        type: '',
        address: '',
        inchargePerson: '',
        mobileNumber: '',
        email: ''
    });



    // Handle mobile number input
    function handleMobileNumberInput(event: Event) {
        const input = event.target as HTMLInputElement;
        const digits = input.value.replace(/\D/g, '').slice(0, 10);
        selectedInstitute.contactDetails.mobileNumber = digits;
    }

    function validateForm(): boolean {
        formErrors = { name: '', type: '', address: '', inchargePerson: '', mobileNumber: '', email: '' };
        let isValid = true;

        if (!selectedInstitute.name) {
            formErrors.name = 'Name is required';
            isValid = false;
        }
        if (!selectedInstitute.type) {
            formErrors.type = 'Type is required';
            isValid = false;
        }
        if (!selectedInstitute.address) {
            formErrors.address = 'Address is required';
            isValid = false;
        }
        if (!selectedInstitute.contactDetails.inchargePerson) {
            formErrors.inchargePerson = 'Incharge person is required';
            isValid = false;
        }
        const mobileDigits = selectedInstitute.contactDetails.mobileNumber.replace(/\D/g, '');
        if (!mobileDigits) {
            formErrors.mobileNumber = 'Mobile number is required';
            isValid = false;
        } else if (mobileDigits.length !== 10) {
            formErrors.mobileNumber = 'Mobile number must be exactly 10 digits';
            isValid = false;
        } else if (/^(\d)\1{9}$/.test(mobileDigits)) {
            formErrors.mobileNumber = 'Mobile number cannot consist of repeating digits (e.g., 9999999999)';
            isValid = false;
        }
        if (selectedInstitute.contactDetails.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(selectedInstitute.contactDetails.email)) {
            formErrors.email = 'Invalid email format';
            isValid = false;
        }

        return isValid;
    }

    const createInstituteMutation = createMutation({
        mutationFn: (data: typeof selectedInstitute) => _axios.post('/institutions', {
            ...data,
            contactDetails: {
                ...data.contactDetails,
                mobileNumber: data.contactDetails.mobileNumber.replace(/\D/g, '')
            }
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['institutions'] });
            showCreateEditModal = false;
            selectedInstitute = { name: '', type: 'college', address: '', contactDetails: { inchargePerson: '', mobileNumber: '', email: '', officePhone: '' } };
        },
        onError: (error: any) => {
            const errorData = error.response?.data?.body?.[0] || error.response?.data;
            if (errorData?.path) {
                const field = errorData.path.split('/').pop();
                if (field && field in formErrors) {
                    formErrors[field as keyof typeof formErrors] = errorData.message || 'Invalid input';
                } else {
                    formErrors.mobileNumber = errorData.message || 'Failed to create institute';
                }
            } else {
                formErrors.mobileNumber = errorData.message || 'Failed to create institute';
            }
        }
    });

    const updateInstituteMutation = createMutation({
        mutationFn: (data: typeof selectedInstitute) => _axios.put(`/institutions/${data.id}`, {
            ...data,
            contactDetails: {
                ...data.contactDetails,
                mobileNumber: data.contactDetails.mobileNumber.replace(/\D/g, '')
            }
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['institutions'] });
            showCreateEditModal = false;
            selectedInstitute = { name: '', type: 'college', address: '', contactDetails: { inchargePerson: '', mobileNumber: '', email: '', officePhone: '' } };
        },
        onError: (error: any) => {
            const errorData = error.response?.data?.body?.[0] || error.response?.data;
            if (errorData?.path) {
                const field = errorData.path.split('/').pop();
                if (field && field in formErrors) {
                    formErrors[field as keyof typeof formErrors] = errorData.message || 'Invalid input';
                } else {
                    formErrors.mobileNumber = errorData.message || 'Failed to update institute';
                }
            } else {
                formErrors.mobileNumber = errorData.message || 'Failed to update institute';
            }
        }
    });

    const deleteInstituteMutation = createMutation({
        mutationFn: (id: string) => _axios.delete(`/institutions/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['institutions'] });
            showDeleteDialog = false;
            selectedInstitute = { name: '', type: 'college', address: '', contactDetails: { inchargePerson: '', mobileNumber: '', email: '', officePhone: '' } };
        },
        onError: (error: any) => {
            formErrors.mobileNumber = error.response?.data?.message || 'Failed to delete institute';
        }
    });

    function handleCreateEdit() {
        if (!validateForm()) return;
        if (isEditing) {
            $updateInstituteMutation.mutate(selectedInstitute);
        } else {
            $createInstituteMutation.mutate(selectedInstitute);
        }
    }

    function openCreateModal() {
        isEditing = false;
        selectedInstitute = { name: '', type: 'college', address: '', contactDetails: { inchargePerson: '', mobileNumber: '', email: '', officePhone: '' } };
        showCreateEditModal = true;
    }

    function openEditModal(institute: typeof selectedInstitute) {
        isEditing = true;
        selectedInstitute = { ...institute };
        showCreateEditModal = true;
    }

    function openDeleteDialog(institute: typeof selectedInstitute) {
        selectedInstitute = { ...institute };
        showDeleteDialog = true;
    }

    function handleDelete() {
        if (selectedInstitute.id) {
            $deleteInstituteMutation.mutate(selectedInstitute.id);
        }
    }

    function goToPage(page: number) {
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
            $institutesQuery.refetch();
        }
    }
</script>

<main class="flex-1 p-6 bg-gradient-to-br from-gray-50 to-blue-100">
    <Card.Root class="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <Card.Header>
            <div class="flex items-center justify-between space-x-4">
                <div>
                    <Card.Title class="text-xl font-semibold text-gray-800">Manage Institutes</Card.Title>
                    <Card.Description>Add, edit, or remove institutes on the platform</Card.Description>
                </div>
                <div class="w-64 relative">
                    <Input
                        type="text"
                        placeholder="Search institutes..."
                        bind:value={searchQuery}
                        oninput={handleSearchInput}
                        class="w-full pr-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    {#if searchQuery}
                        <Icon
                            icon="mdi:clear-outline"
                            on:click={() => {
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
        </Card.Header>

        <Card.Content>
                <div class="flex justify-end mb-6">
                    <Button.Root
                        class="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-2"
                        onclick={openCreateModal}
                    >
                        <Icon icon="mdi:plus" class="h-5 w-5" />
                        <span>Add Institute</span>
                    </Button.Root>
                </div>

                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.Head>Sl.no</Table.Head>
                            <Table.Head>Name</Table.Head>
                            <Table.Head>Type</Table.Head>
                            <Table.Head>Address</Table.Head>
                            <Table.Head>Incharge Person</Table.Head>
                            <Table.Head>Mobile Number</Table.Head>
                            <Table.Head>Email</Table.Head>
                            <Table.Head>Actions</Table.Head>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {#if paginatedInstitutes.length === 0}
                            <Table.Row>
                                <Table.Cell colspan="7" class="text-center text-gray-600">
                                    No institutes found.
                                </Table.Cell>
                            </Table.Row>
                        {:else}
                            {#each paginatedInstitutes as institute,i}
                                <Table.Row>
                                    <Table.Cell>{i + 1 + (currentPage - 1) * itemsPerPage}</Table.Cell>
                                    <Table.Cell>
                                        <button
                                            class="text-blue-600 hover:underline text-left" 
                                            on:click={() => goto(`/super-admin/institute-management/${institute.id}`)}
                                        >
                                            {institute.name}
                                        </button>
                                    </Table.Cell>
                                    <Table.Cell>{institute.type}</Table.Cell>
                                    <Table.Cell>{institute.address}</Table.Cell>
                                    <Table.Cell>{institute.contactDetails.inchargePerson}</Table.Cell>
                                    <Table.Cell>{institute.contactDetails.mobileNumber}</Table.Cell>
                                    <Table.Cell>{institute.contactDetails.email || '-'}</Table.Cell>
                                    <Table.Cell>
                                        <div class="flex space-x-2">
                                            <Button.Root
                                                variant="outline"
                                                size="sm"
                                                onclick={() => openEditModal(institute)}
                                            >
                                                <Icon icon="mdi:pencil" class="h-4 w-4" />
                                            </Button.Root>
                                            <Button.Root
                                                variant="destructive"
                                                size="sm"
                                                onclick={() => openDeleteDialog(institute)}
                                            >
                                                <Icon icon="mdi:delete" class="h-4 w-4" />
                                            </Button.Root>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            {/each}
                        {/if}
                    </Table.Body>
                </Table.Root>

                {#if totalPages > 1}
                    <div class="flex justify-center items-center space-x-2 mt-6">
                        <Button.Root
                            variant="outline"
                            disabled={currentPage === 1}
                            onclick={() => goToPage(currentPage - 1)}
                        >
                            Previous
                        </Button.Root>
                        {#each Array(totalPages) as _, i}
                            <Button.Root
                                variant={currentPage === i + 1 ? 'default' : 'outline'}
                                onclick={() => goToPage(i + 1)}
                            >
                                {i + 1}
                            </Button.Root>
                        {/each}
                        <Button.Root
                            variant="outline"
                            disabled={currentPage === totalPages}
                            onclick={() => goToPage(currentPage + 1)}
                        >
                            Next
                        </Button.Root>
                    </div>
                {/if}
        </Card.Content>
    </Card.Root>

    <Dialog.Root bind:open={showCreateEditModal}>
        <Dialog.Content class="sm:max-w-[425px]">
            <Dialog.Header>
                <Dialog.Title>{isEditing ? 'Edit Institute' : 'Add Institute'}</Dialog.Title>
                <Dialog.Description>
                    {isEditing ? 'Update the institute details below.' : 'Enter the details for the new institute.'}
                </Dialog.Description>
            </Dialog.Header>
            <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                    <label for="name" class="text-right">Name</label>
                    <div class="col-span-3">
                        <Input
                            id="name"
                            bind:value={selectedInstitute.name}
                            placeholder="Institute Name"
                            class="max-w-xs"
                        />
                        {#if formErrors.name}
                            <p class="text-red-500 text-sm">{formErrors.name}</p>
                        {/if}
                    </div>
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <label for="type" class="text-right">Type</label>
                    <div class="col-span-3">
                        <select
                            id="type"
                            bind:value={selectedInstitute.type}
                            class="w-full border rounded px-2 py-1 max-w-xs"
                        >
                            <option value="college">College</option>
                            <option value="school">School</option>
                        </select>
                        {#if formErrors.type}
                            <p class="text-red-500 text-sm">{formErrors.type}</p>
                        {/if}
                    </div>
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <label for="address" class="text-right">Address</label>
                    <div class="col-span-3">
                        <Input
                            id="address"
                            bind:value={selectedInstitute.address}
                            placeholder="Institute Address"
                            class="max-w-xs"
                        />
                        {#if formErrors.address}
                            <p class="text-red-500 text-sm">{formErrors.address}</p>
                        {/if}
                    </div>
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <label for="inchargePerson" class="text-right">Incharge</label>
                    <div class="col-span-3">
                        <Input
                            id="inchargePerson"
                            bind:value={selectedInstitute.contactDetails.inchargePerson}
                            placeholder="Incharge Person"
                            class="max-w-xs"
                        />
                        {#if formErrors.inchargePerson}
                            <p class="text-red-500 text-sm">{formErrors.inchargePerson}</p>
                        {/if}
                    </div>
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <label for="mobileNumber" class="text-right">Mobile</label>
                    <div class="col-span-3">
                        <Input
                            id="mobileNumber"
                            type="tel"
                            bind:value={selectedInstitute.contactDetails.mobileNumber}
                            oninput={handleMobileNumberInput}
                            placeholder="XXXXXXXXXX"
                            class="max-w-xs"
                            maxlength="10"
                        />
                        {#if formErrors.mobileNumber}
                            <p class="text-red-500 text-sm">{formErrors.mobileNumber}</p>
                        {/if}
                    </div>
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <label for="email" class="text-right">Email</label>
                    <div class="col-span-3">
                        <Input
                            id="email"
                            type="email"
                            bind:value={selectedInstitute.contactDetails.email}
                            placeholder="Contact Email"
                            class="max-w-xs"
                        />
                        {#if formErrors.email}
                            <p class="text-red-500 text-sm">{formErrors.email}</p>
                        {/if}
                    </div>
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <label for="officePhone" class="text-right">Office Phone</label>
                    <div class="col-span-3">
                        <Input
                            id="officePhone"
                            bind:value={selectedInstitute.contactDetails.officePhone}
                            placeholder="XXX-XXX-XXXX (Optional)"
                            class="max-w-xs"
                        />
                    </div>
                </div>
            </div>
            <Dialog.Footer>
                <Button.Root variant="outline" onclick={() => (showCreateEditModal = false)}>
                    Cancel
                </Button.Root>
                <Button.Root
                    class="bg-blue-600 text-white hover:bg-blue-700"
                    onclick={handleCreateEdit}
                >
                    {isEditing ? 'Update' : 'Create'}
                </Button.Root>
            </Dialog.Footer>
        </Dialog.Content>
    </Dialog.Root>

    <AlertDialog.Root bind:open={showDeleteDialog}>
        <AlertDialog.Content>
            <AlertDialog.Header>
                <AlertDialog.Title>Are you sure you want to delete this institute?</AlertDialog.Title>
                <AlertDialog.Description>
                    This action cannot be undone. The institute "{selectedInstitute.name}" will be permanently deleted.
                </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer>
                <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                <AlertDialog.Action
                    class="bg-red-600 text-white hover:bg-red-700"
                    onclick={handleDelete}
                >
                    Delete
                </AlertDialog.Action>
            </AlertDialog.Footer>
        </AlertDialog.Content>
    </AlertDialog.Root>
</main>

<style>
    .card:hover {
        transform: translateY(-4px);
        transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    }
    button:hover {
        transform: scale(1.05);
        transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
    }
</style>