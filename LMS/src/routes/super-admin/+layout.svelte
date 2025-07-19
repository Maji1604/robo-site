<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Sidebar from '$lib/components/sidebar.svelte';
	import Topbar from '@/lib/components/topbar.svelte';
  
	let { children } = $props();
  
	onMount(() => {
	  // Retrieve tokens from cookies and localStorage
	//   const cookieToken = document.cookie.split('; ').find(row => row.startsWith('admin='))?.split('=')[1];
	  const localStorageToken = localStorage.getItem('token');
  
	  // Check if tokens exist and match
	  if (!localStorageToken) {
		// Redirect to login or another appropriate route
		goto('/');
	  }
	});
  </script>
  
  <div class="bg-zinc-100 flex w-screen">
	<Sidebar />
	<div class="flex flex-col w-full h-screen overflow-y-auto">
		<Topbar />
	  {@render children()}
	</div>
  </div>
  