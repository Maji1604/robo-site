<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import { 
		Home, 
		Users, 
		Calendar, 
		CheckSquare, 
		Clock, 
		FileText, 
		Building, 
		Settings, 
		LogOut,
		ChevronLeft,
		ChevronRight,
		BarChart3
	} from 'lucide-svelte';
	import { authActions } from '$lib/stores/auth';

	export let collapsed = false;

	const navigation = [
		{ name: 'Dashboard', href: '/', icon: Home },
		{ name: 'Employees', href: '/employees', icon: Users },
		{ name: 'Tasks', href: '/tasks', icon: CheckSquare },
		{ name: 'Calendar', href: '/calendar', icon: Calendar },
		{ name: 'Attendance', href: '/attendance', icon: Clock },
		{ name: 'HR', href: '/hr', icon: FileText },
		{ name: 'Departments', href: '/departments', icon: Building },
		{ name: 'Reports', href: '/reports', icon: BarChart3 },
		{ name: 'Settings', href: '/settings', icon: Settings }
	];

	function toggleSidebar() {
		collapsed = !collapsed;
	}

	function handleLogout() {
		authActions.logout();
	}
</script>

<div class={cn(
	'flex flex-col h-screen bg-slate-900 text-white transition-all duration-300 ease-in-out',
	collapsed ? 'w-16' : 'w-64'
)}>
	<!-- Header -->
	<div class="flex items-center justify-between p-4 border-b border-slate-700">
		{#if !collapsed}
			<div class="flex items-center space-x-2">
				<div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
					<span class="font-bold text-sm">C</span>
				</div>
				<span class="font-semibold text-lg">Creoleap ERP</span>
			</div>
		{/if}
		<button
			on:click={toggleSidebar}
			class="p-1 rounded-md hover:bg-slate-700 transition-colors"
		>
			{#if collapsed}
				<ChevronRight size={20} />
			{:else}
				<ChevronLeft size={20} />
			{/if}
		</button>
	</div>

	<!-- Navigation -->
	<nav class="flex-1 p-4 space-y-2">
		{#each navigation as item}
			<a
				href={item.href}
				class={cn(
					'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors group',
					$page.url.pathname === item.href
						? 'bg-blue-600 text-white'
						: 'text-slate-300 hover:bg-slate-700 hover:text-white'
				)}
			>
				<svelte:component this={item.icon} size={20} />
				{#if !collapsed}
					<span class="font-medium">{item.name}</span>
				{/if}
			</a>
		{/each}
	</nav>

	<!-- Footer -->
	<div class="p-4 border-t border-slate-700">
		<button
			on:click={handleLogout}
			class="flex items-center space-x-3 px-3 py-2 w-full text-left text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors"
		>
			<LogOut size={20} />
			{#if !collapsed}
				<span class="font-medium">Logout</span>
			{/if}
		</button>
	</div>
</div>