<script>
    import Icon from "@iconify/svelte";
    import { writableGlobalStore } from "../stores/global-store";
    import { page } from "$app/stores";
    import { createQuery } from "@tanstack/svelte-query";
    import { _axios } from '$lib/_axios';


    // Route-to-icon and title mapping
    const routeConfig = {
      dashboard: {
        title: "Dashboard",
        icon: "mdi:view-dashboard"
      },
      instituteManagement: {
        title: "Institute Management",
        icon: "mdi:school"
      },
      // Add more routes as needed
      default: {
        title: "Home",
        icon: "mdi:home"
      }
    };

    // Function to get title and icon from route path
    function getRouteConfig(pathname) {
      // Extract the last segment of the path and remove any leading/trailing slashes
      const route = pathname.split("/").filter(Boolean).pop() || "default";
      // Convert kebab-case to camelCase for consistency (e.g., institute-management -> instituteManagement)
      const normalizedRoute = route.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      // Return config for the route or default
      return routeConfig[normalizedRoute] || routeConfig.default;
    }

    // Reactive title and icon based on current route
    $: currentConfig = getRouteConfig($page.url.pathname);
    $: title = currentConfig.title;
    $: icon = currentConfig.icon;

    // Extract institute ID from URL params
    $: instituteId = $page.params.id;

    // Query to fetch institute details by ID
    $: instituteQuery = createQuery({
        queryKey: ['institute', instituteId],
        queryFn: async () => {
            if (!instituteId) return null;
            try {
                const response = await _axios.get(`/institutions/${instituteId}`);
                return response.data;
            } catch (error) {
                throw new Error(error.response?.data?.message || 'Failed to fetch institute details');
            }
        },
        enabled: !!instituteId // Only fetch if instituteId is available
    });

    // Derived institute data
    $: institute = $instituteQuery.data?.data;
  </script>

  <header class="bg-white shadow-lg w-full z-30 rounded-lg min-h-16 flex items-center justify-between px-6 sticky top-0 mb-6">
    <div class="flex items-center space-x-4">
      <Icon icon={icon} class="h-8 w-8 text-blue-600" />
   
      {#if institute}
        <h2 class="text-xl font-semibold text-gray-700 capitalize">{institute.name}</h2>
    {:else}
    <h1 class="text-2xl font-bold text-gray-800">{title}</h1>
      {/if}
    </div>
    <div class="flex items-center space-x-4">
      <span class="text-gray-600 font-medium">{$writableGlobalStore.role}</span>
      <img
        src="/images/profile.jpg"
        alt="User Avatar"
        class="w-10 h-10 rounded-full object-cover border-2 border-blue-400 hover:scale-110 transition-transform duration-300"
      />
    </div>
  </header>
