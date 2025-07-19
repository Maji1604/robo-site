<script lang="ts">
	import { Bell, Search, User } from 'lucide-svelte';
	import { authStore } from '$lib/stores/auth';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';

	let searchQuery = '';
	
	$: user = $authStore.user;
</script>

<header class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
	<div class="flex items-center justify-between">
		<!-- Search -->
		<div class="flex-1 max-w-md">
			<div class="relative">
				<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
				<Input
					type="text"
					placeholder="Search employees, tasks, projects..."
					bind:value={searchQuery}
					class="pl-10 pr-4 py-2 w-full"
				/>
			</div>
		</div>

		<!-- Right section -->
		<div class="flex items-center space-x-4">
			<!-- Notifications -->
			<Button variant="ghost" size="icon" class="relative">
				<Bell size={20} />
				<span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
					3
				</span>
			</Button>

			<!-- User profile -->
			<Button variant="ghost" class="flex items-center space-x-2">
				<div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
					<User size={16} class="text-white" />
				</div>
				{#if user}
					<span class="font-medium">{user.email}</span>
				{/if}
			</Button>
		</div>
	</div>
</header>