<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Icon from '@iconify/svelte';
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import { createMutation } from '@tanstack/svelte-query';
  import { _axios } from '../_axios';
  import { writableGlobalStore } from '../stores/global-store';

  let isExpanded = $state(true); // State to track if sidebar is expanded

  function toggleSidebar() {
    isExpanded = !isExpanded; // Toggle the state
  }

  const logoutMutation = createMutation({
    mutationFn: () => _axios.post('/auth/logout'),
    onSuccess() {
      localStorage.clear();
      goto('/');
    }
  });

  function handleLogout() {
    $logoutMutation.mutate();
  }

  // Define role-based navigation routes
  const getRoutesByRole = (role: string) => {
    switch (role) {
      case 'admin':
        return [
          { name: 'Dashboard', href: '/admin/dashboard', icon: 'mdi:view-dashboard' },
          { name: 'Master', href: '/admin/master', icon: 'mdi:database' },
          { name: 'Purchase Entry', href: '/admin/purchase-entry', icon: 'mdi:cart' },
          { name: 'Sales Entry', href: '/admin/sales-entry', icon: 'mdi:cash-register' },
          { name: 'Collection Entry', href: '/admin/collection-entry', icon: 'mdi:credit-card' },
          { name: 'Settlement Entry', href: '/admin/settlement-entry', icon: 'mdi:handshake' },
          { name: 'Expense Entry', href: '/admin/expense-entry', icon: 'mdi:currency-usd' },
          { name: 'Purchase Report', href: '/admin/purchase-report', icon: 'mdi:chart-bar' },
          { name: 'Sales Report', href: '/admin/sales-report', icon: 'mdi:chart-line' },
          { name: 'Collection Report', href: '/admin/collection-report', icon: 'mdi:chart-pie' },
          { name: 'Settlement Report', href: '/admin/settlement-report', icon: 'mdi:chart-box' },
          { name: 'Expense Report', href: '/admin/expense-report', icon: 'mdi:chart-timeline' },
          { name: 'Transaction', href: '/admin/transaction', icon: 'mdi:swap-horizontal' },
          { name: 'Overall Balance', href: '/admin/overall-balance', icon: 'mdi:account-balance' },
        ];
      case 'super_admin':
        return [
          { name: 'Dashboard', href: '/super-admin/dashboard', icon: 'material-symbols:space-dashboard-rounded' },
          { name: 'Institute Management', href: '/super-admin/institute-management', icon: 'material-symbols:groups-rounded' },
          { name: 'School Overview', href: '/super-admin/school-overview', icon: 'mdi:school' },
          { name: 'Global Reports', href: '/super-admin/global-reports', icon: 'mdi:chart-bar' },
          { name: 'Content Management', href: '/super-admin/content-management', icon: 'mdi:library' },
        ];
      case 'teacher':
        return [
          { name: 'Dashboard', href: '/staff/dashboard', icon: 'mdi:view-dashboard' },
          { name: 'Class Management', href: '/staff/class-management', icon: 'mdi:clipboard-text' },
          { name: 'Student Records', href: '/staff/student-records', icon: 'mdi:account-box' },
          { name: 'Attendance', href: '/staff/attendance', icon: 'mdi:calendar-check' },
          { name: 'Reports', href: '/staff/reports', icon: 'mdi:chart-bar' },
        ];
      default:
        return [];
    }
  };

  // Secondary routes (e.g., Settings, consistent across roles but with role-based prefix)
  const getSecondaryRoutesByRole = (role: string) => {
    const prefix = role === 'admin' ? '/admin' : role === 'super-admin' ? '/super-admin' : '/staff';
    return [
      { name: 'Settings', href: `${prefix}/settings`, icon: 'mdi:cog' },
    ];
  };
  // Function to get cookie value by name
  function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    console.log('Cookie value:', value); // Log the cookie value for debugging
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }
  let role = getCookie('role')||''
  // Use $derived for reactive computations
  const routes = $derived(getRoutesByRole(role));
  const routes2 = $derived(getSecondaryRoutesByRole(role));

  // Helper function to determine if a route is active
  function isRouteActive(href: string): boolean {
    const currentPath = $page.url.pathname.endsWith('/') ? $page.url.pathname.slice(0, -1) : $page.url.pathname;
    const routeHref = href.endsWith('/') ? href.slice(0, -1) : href;
    const isExactMatch = currentPath === routeHref;
    const isNestedMatch = currentPath.startsWith(routeHref) && !['/admin/dashboard', '/super-admin/dashboard', '/staff/dashboard'].includes(routeHref);
    const isActive = isExactMatch || isNestedMatch;
    console.log(`Checking if ${routeHref} is active: ${isActive}, Current Path: ${currentPath}`);
    return isActive;
  }
</script>

<!-- The rest of your component remains unchanged -->
<div
  class="hidden z-50 md:block h-screen text-white font-pt bg-[#1A0C52]  transition-all duration-500 ease-in-out"
  class:min-w-[250px]={isExpanded}
  class:max-w-[250px]={isExpanded}
  class:min-w-[70px]={!isExpanded}
  class:max-w-[70px]={!isExpanded}
>
  <div
    class="flex flex-col justify-between h-[100vh] overflow-y-auto gap-2 hidescrollbarthumb py-3"
  >
    <!-- Logo -->
    <button class="sticky top-0 left-0 z-20 bg-[#1A0C52] w-full transition-all duration-500 ease-in-out" onclick={() => goto(role === 'admin' ? '/admin/dashboard' : role === 'super-admin' ? '/super-admin/dashboard' : '/staff/dashboard')}>
      <div
        class={`min-h-[50px] cursor-pointer flex ${isExpanded?'pl-4':'justify-center'} items-center`}
      >
      {#if isExpanded}
        <img src="/images/Logo.png" width={isExpanded ? 200 : 100} class="py-1 transition-all duration-900 " alt="Logo">
        {:else}
        <img src="/images/logo-small.png" width={50} class="py-1 transition-all duration-900" alt="Logo">

        {/if}
      </div>
    </button>

    <!-- Toggle Button -->
    <button
      class="absolute top-11 z-20 bg-[#1A0C52] p-2 rounded-full transition-all duration-500"
      class:left-[230px]={isExpanded}
      class:left-[50px]={!isExpanded}
      onclick={toggleSidebar}
    >
      <Icon width="20" icon={isExpanded ? 'mdi:chevron-left' : 'mdi:chevron-right'} class="text-white transition-all duration-500 ease-in-out" />
    </button>

    <!-- Navigation Menu -->
    <nav class={`flex flex-col ${isExpanded?'items-start':'items-center'} justify-between  text-sm h-full`}>
      <div>
        {#each routes as route}
          <div class="w-full rounded-md relative">
            <button
              class="w-full py-1"
              onclick={() => {
                if (route.href) goto(route.href);
              }}
            >
              <div
                class={`flex cursor-pointer !items-center group transition-all duration-300 ease-in-out relative ${
                  isExpanded ? 'justify-start pl-4' : 'justify-center items-center'
                }`}
              >
                <!-- Left Indicator Line -->
                <div
                  class={`absolute left-0 top-1/2 -translate-y-1/2 ${isExpanded?'translate-x-5':'-translate-x-1'} h-[80%] w-1 rounded-md bg-white transition-opacity duration-300 ease-in-out ${
                    isRouteActive(route.href) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                ></div>

                <div
                  class={`rounded-md w-[100%] p-2 flex transition-all duration-300 ease-in-out ${
                    isRouteActive(route.href)
                      ? `bg-[#483D76] ${isExpanded?'translate-x-3':'translate-x-1'}`
                      : `group-hover:bg-[#483D76] ${isExpanded?'group-hover:translate-x-3':'group-hover:translate-x-1'}`
                  }`}
                >
                  <Icon
                    icon={route.icon}
                    class={`min-h-6 min-w-6 transition-all duration-300 ease-in-out ${
                      isExpanded ? 'mr-1' : 'mx-auto'
                    }`}
                  />
                  {#if isExpanded}
                    <p
                      class="text-md text-white whitespace-nowrap flex items-center gap-3 rounded-lg px-3 font-normal opacity-0 animate-slide-in"
                      class:opacity-100={isExpanded}
                    >
                      {route.name}
                    </p>
                  {/if}
                </div>
              </div>
            </button>
          </div>
        {/each}
      </div>

      <div class="w-[90%]">
        {#each routes2 as route}
          <div class="w-full rounded-md relative">
            <button
              class="w-full py-1"
              onclick={() => {
                if (route.href) goto(route.href);
              }}
            >
              <div
                class={`flex cursor-pointer !items-center group transition-all duration-300 ease-in-out relative ${
                  isExpanded ? 'justify-start pl-4' : 'justify-center'
                }`}
              >
                <!-- Left Indicator Line -->
                <div
                  class={`absolute left-0 top-1/2 -translate-y-1/2 h-[80%] w-1 translate-x-3 rounded-md bg-white transition-opacity duration-300 ease-in-out ${
                    isRouteActive(route.href) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                ></div>

                <div
                  class={`rounded-md w-[90%] p-2 flex transition-all duration-300 ease-in-out ${
                    isRouteActive(route.href)
                      ? 'bg-[#483D76] translate-x-3'
                      : 'group-hover:bg-[#483D76] group-hover:translate-x-3'
                  }`}
                >
                  <Icon
                    icon={route.icon}
                    class={`h-6 w-6 transition-all duration-300 ease-in-out ${
                      isExpanded ? 'mr-1' : 'mx-auto'
                    }`}
                  />
                  {#if isExpanded}
                    <p
                      class="text-md text-white whitespace-nowrap flex items-center gap-3 rounded-lg px-3 font-normal opacity-0 animate-slide-in"
                      class:opacity-100={isExpanded}
                    >
                      {route.name}
                    </p>
                  {/if}
                </div>
              </div>
            </button>
          </div>
        {/each}

        <!-- Logout Button -->
        <AlertDialog.Root>
          <AlertDialog.Trigger class="w-full py-1">
            <div class="w-full rounded-md relative">
              <button class="w-full py-1">
                <div
                  class={`flex cursor-pointer !items-center group transition-all duration-300 ease-in-out relative ${
                    isExpanded ? 'justify-start pl-4' : 'justify-center'
                  }`}
                >
                  <!-- Left Indicator Line -->
                  <div
                    class="absolute left-0 top-1/2 -translate-y-1/2 h-[80%] w-1 translate-x-3 rounded-md bg-white transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100"
                  ></div>

                  <div
                    class="group-hover:bg-[#483D76] rounded-md w-[90%] p-2 group-hover:translate-x-3 flex transition-all duration-300 ease-in-out"
                  >
                    <Icon
                      icon="mdi:logout"
                      class={`h-6 w-6 transition-all duration-300 ease-in-out ${
                        isExpanded ? 'mr-2' : 'mx-auto'
                      }`}
                    />
                    {#if isExpanded}
                      <p
                        class="text-md text-white whitespace-nowrap flex items-center gap-3 rounded-lg px-3 font-normal opacity-0 animate-slide-in"
                        class:opacity-100={isExpanded}
                      >
                        Logout
                      </p>
                    {/if}
                  </div>
                </div>
              </button>
            </div>
          </AlertDialog.Trigger>
          <AlertDialog.Content>
            <AlertDialog.Header>
              <AlertDialog.Title>Are you sure you want to logout?</AlertDialog.Title>
              <AlertDialog.Description>
                This will end your session and you will need to log in again.
              </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer>
              <AlertDialog.Cancel class={buttonVariants({ variant: "outline" })}>
                Cancel
              </AlertDialog.Cancel>
              <AlertDialog.Action class={buttonVariants({ variant: "default" })} onclick={handleLogout}>
                Confirm
              </AlertDialog.Action>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog.Root>
      </div>
    </nav>
  </div>
</div>

<style>
  .hidescrollbarthumb::-webkit-scrollbar {
    display: none;
  }
  .hidescrollbarthumb {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  @keyframes slide-in {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .animate-slide-in {
    animation: slide-in 300ms ease-in-out forwards;
  }
</style>