<script lang="ts">
    import { page } from '$app/stores';
    import { createQuery } from '@tanstack/svelte-query';
    import * as Card from '$lib/components/ui/card';
    import * as Button from '$lib/components/ui/button';
    import * as Tabs from '$lib/components/ui/tabs';
    import Icon from '@iconify/svelte';
    import { _axios } from '$lib/_axios';
    import { goto } from '$app/navigation';
    import Overview from '@/lib/components/pages/instituteManagement/overview.svelte';
    import StaffManagement from '@/lib/components/pages/instituteManagement/staffManagement.svelte';
    import AdminManagement from '@/lib/components/pages/instituteManagement/adminManagement.svelte';
    import ClassManagement from '@/lib/components/pages/instituteManagement/classManagement.svelte';
    import StudentManagement from '@/lib/components/pages/instituteManagement/studentManagement.svelte';
    import DepartmentManagement from '@/lib/components/pages/instituteManagement/departmentManagement.svelte';

    // Extract institute ID from URL params
    const instituteId = $page.params.id;

    // Current active tab
    let activeTab = 'overview';

    // State for collapsible sections
    let isOverviewCollapsed = false;
    let isManagementCollapsed = false;

    // Query to fetch institute details by ID
    const instituteQuery = createQuery({
        queryKey: ['institute', instituteId],
        queryFn: async () => {
            try {
                const response = await _axios.get(`/institutions/${instituteId}`);
                return response.data;
            } catch (error: any) {
                throw new Error(error.response?.data?.message || 'Failed to fetch institute details');
            }
        }
    });

    // Query to fetch institute statistics
    const statsQuery = createQuery({
        queryKey: ['institute-stats', instituteId],
        queryFn: async () => {
            try {
                const response = await _axios.get(`/institutions/${instituteId}/stats`);
                return response.data;
            } catch (error: any) {
                throw new Error('Failed to fetch institute statistics');
            }
        }
    });

    // Derived institute data
    $: institute = $instituteQuery.data?.data;
    $: stats = $statsQuery.data?.data;

    // Function to handle tab change
    function handleTabChange(event: Event) {
        event.preventDefault();
        const target = event.target as HTMLElement;
        const value = target.getAttribute('data-value');
        if (value) {
            activeTab = value;
        }
    }
</script>

<main class="flex-1 py-0 p-6 bg-gradient-to-br from-gray-50 to-blue-50">
    <div class="space-y-6">
        <!-- Institute overview card -->
        <Card.Root class={`bg-white pb-5 rounded-xl shadow-lg ${isOverviewCollapsed ? 'h-20' : ''}`}>
            <Card.Header class="sticky top-16 z-10 bg-white">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="p-3 rounded-full bg-blue-100">
                            <Icon icon="mdi:school" class="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <Card.Title class="text-xl font-semibold text-gray-800">
                                {institute?.name || 'Loading...'}
                            </Card.Title>
                            <Card.Description>
                                {institute?.type ? `${institute.type.charAt(0).toUpperCase() + institute.type.slice(1)}` : ''} • {institute?.address || ''}
                            </Card.Description>
                        </div>
                    </div>
                    <Button.Root
                        class="bg-transparent hover:bg-transparent focus:ring-0 outline-none border-none"
                        on:click={() => isOverviewCollapsed = !isOverviewCollapsed}
                    >
                        <Icon icon={isOverviewCollapsed ? "mdi:chevron-down" : "mdi:chevron-up"} class="h-6 w-6" />
                    </Button.Root>
                </div>
            </Card.Header>
            {#if !isOverviewCollapsed}
                <Card.Content>
                    {#if $instituteQuery.isLoading}
                        <div class="flex justify-center items-center py-4">
                            <Icon icon="mdi:loading" class="h-6 w-6 animate-spin text-blue-600" />
                            <p class="ml-2 text-gray-600">Loading institute details...</p>
                        </div>
                    {:else if $instituteQuery.isError}
                        <p class="text-center text-red-500">Error: {$instituteQuery.error?.message}</p>
                    {:else if institute}
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-4">
                                <h3 class="font-medium text-gray-700 border-b pb-2">Basic Information</h3>
                                <div class="grid grid-cols-3 gap-4">
                                    <div>
                                        <p class="text-sm text-gray-500">Institute Type</p>
                                        <p class="font-medium">{institute.type}</p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-500">Status</p>
                                        <p class="font-medium">
                                            {#if institute.isActive}
                                                <span class="text-green-600 flex items-center">
                                                    <Icon icon="mdi:check-circle" class="h-4 w-4 mr-1" /> Active
                                                </span>
                                            {:else}
                                                <span class="text-red-600 flex items-center">
                                                    <Icon icon="mdi:close-circle" class="h-4 w-4 mr-1" /> Inactive
                                                </span>
                                            {/if}
                                        </p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-500">Created At</p>
                                        <p class="font-medium">{new Date(institute.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500">Address</p>
                                    <p class="font-medium">{institute.address}</p>
                                </div>
                            </div>

                            <div class="space-y-4">
                                <h3 class="font-medium text-gray-700 border-b pb-2">Contact Information</h3>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <p class="text-sm text-gray-500">Incharge Person</p>
                                        <p class="font-medium">{institute.contactDetails.inchargePerson}</p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-500">Mobile Number</p>
                                        <p class="font-medium">{institute.contactDetails.mobileNumber}</p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-500">Email</p>
                                        <p class="font-medium">{institute.contactDetails.email || '-'}</p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-500">Office Phone</p>
                                        <p class="font-medium">{institute.contactDetails.officePhone || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/if}
                </Card.Content>
            {/if}
        </Card.Root>

        <!-- Stats cards -->
        {#if stats}
            <div class="grid px-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card.Root class="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                    <Card.Content class="flex items-center p-4">
                        <div class="p-3 rounded-full bg-indigo-100 mr-4">
                            <Icon icon="mdi:account-tie" class="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Admins</p>
                            <p class="text-2xl font-bold">{stats.adminCount}</p>
                        </div>
                    </Card.Content>
                </Card.Root>

                <Card.Root class="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                    <Card.Content class="flex items-center p-4">
                        <div class="p-3 rounded-full bg-green-100 mr-4">
                            <Icon icon="mdi:teach" class="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Teachers</p>
                            <p class="text-2xl font-bold">{stats.teacherCount}</p>
                        </div>
                    </Card.Content>
                </Card.Root>

                <Card.Root class="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                    <Card.Content class="flex items-center p-4">
                        <div class="p-3 rounded-full bg-blue-100 mr-4">
                            <Icon icon="mdi:account-group" class="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Students</p>
                            <p class="text-2xl font-bold">{stats.studentCount}</p>
                        </div>
                    </Card.Content>
                </Card.Root>

                <Card.Root class="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                    <Card.Content class="flex items-center p-4">
                        <div class="p-3 rounded-full bg-purple-100 mr-4">
                            <Icon icon="mdi:google-classroom" class="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Classes</p>
                            <p class="text-2xl font-bold">{stats.classCount}</p>
                        </div>
                    </Card.Content>
                </Card.Root>
            </div>
        {/if}

        <!-- Tabs for different management sections -->
        <Tabs.Root value={activeTab} class="bg-white rounded-lg shadow">
            <Tabs.List class="sticky top-32 z-10 w-full border-b bg-white">
                <div class="flex w-full items-center justify-between">
                    <div class="flex">
                        <Tabs.Trigger
                            value="overview"
                            onclick={(e)=>{handleTabChange(e)}}
                        >
                            <Icon icon="mdi:view-dashboard" class="h-5 w-5 mr-2" />
                            Overview
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            value="admins"
                            onclick={(e)=>{handleTabChange(e)}}
                        >
                            <Icon icon="mdi:account-tie" class="h-5 w-5 mr-2" />
                            Admin Management
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            value="staffs"
                            onclick={(e)=>{handleTabChange(e)}}
                        >
                            <Icon icon="mdi:teach" class="h-5 w-5 mr-2" />
                            Staff Management
                        </Tabs.Trigger>
                        {#if institute?.type === "college"}
                            <Tabs.Trigger
                                value="departments"
                                onclick={(e)=>{handleTabChange(e)}}
                            >
                                <Icon icon="mdi:google-classroom" class="h-5 w-5 mr-2" />
                                Department Management
                            </Tabs.Trigger>
                        {/if}
                        <Tabs.Trigger
                            value="classes"
                            onclick={(e)=>{handleTabChange(e)}}
                        >
                            <Icon icon="mdi:google-classroom" class="h-5 w-5 mr-2" />
                            Class Management
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            value="students"
                            onclick={(e)=>{handleTabChange(e)}}
                        >
                            <Icon icon="mdi:account-group" class="h-5 w-5 mr-2" />
                            Student Management
                        </Tabs.Trigger>
                    </div>
                    <Button.Root
                        class="bg-transparent hover:bg-transparent focus:ring-0 outline-none border-none"
                        onclick={() => isManagementCollapsed = !isManagementCollapsed}
                    >
                        <Icon icon={isManagementCollapsed ? "mdi:chevron-down" : "mdi:chevron-up"} class="h-6 w-6" />
                    </Button.Root>
                </div>
            </Tabs.List>

            {#if !isManagementCollapsed}
                <div class="p-4 max-h-[60vh] overflow-y-auto">
                    {#if activeTab === 'overview'}
                        <Overview />
                    {:else if activeTab === 'admins'}
                        <AdminManagement />
                    {:else if activeTab === 'staffs'}
                        <StaffManagement />
                    {:else if activeTab === 'departments'}
                        <DepartmentManagement />
                    {:else if activeTab === 'classes'}
                        <ClassManagement />
                    {:else if activeTab === 'students'}
                        <StudentManagement />
                    {/if}
                </div>
            {/if}
        </Tabs.Root>
    </div>
</main>

<style>
    [data-state="active"] {
        border-bottom: 2px solid #3b82f6;
        color: #1e40af;
        font-weight: 500;
    }

    .card-hover:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar {
        width: 8px;
    }

    ::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
</style>
