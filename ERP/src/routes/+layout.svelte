<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { authStore, authActions } from '$lib/stores/auth';
	import Sidebar from '$lib/components/common/Sidebar.svelte';
	import Header from '$lib/components/common/Header.svelte';

	let sidebarCollapsed = false;
	
	$: isAuthenticated = $authStore.isAuthenticated;
	$: isAuthPage = $page.url.pathname === '/login' || $page.url.pathname === '/register';

	onMount(() => {
		authActions.checkAuth();
	});
</script>

<svelte:head>
	<title>Creoleap ERP - Enterprise Resource Planning</title>
	<meta name="description" content="Complete ERP solution for modern businesses" />
</svelte:head>

{#if !isAuthenticated && !isAuthPage}
	<!-- Redirect to login or show login form -->
	<div class="min-h-screen flex items-center justify-center bg-gray-50">
		<div class="max-w-md w-full space-y-8">
			<div class="text-center">
				<h2 class="mt-6 text-3xl font-extrabold text-gray-900">
					Sign in to Creoleap ERP
				</h2>
			</div>
			<form class="mt-8 space-y-6" on:submit|preventDefault={() => authActions.login('admin@creoleap.com', 'password')}>
				<div class="rounded-md shadow-sm -space-y-px">
					<div>
						<input type="email" required class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address" />
					</div>
					<div>
						<input type="password" required class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password" />
					</div>
				</div>
				<button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
					{#if $authStore.loading}
						Signing in...
					{:else}
						Sign in
					{/if}
				</button>
			</form>
		</div>
	</div>
{:else if isAuthenticated}
	<div class="flex h-screen bg-gray-50">
		<Sidebar bind:collapsed={sidebarCollapsed} />
		<div class="flex-1 flex flex-col overflow-hidden">
			<Header />
			<main class="flex-1 overflow-y-auto">
				<div class="p-6">
					<slot />
				</div>
			</main>
		</div>
	</div>
{:else}
	<slot />
{/if}