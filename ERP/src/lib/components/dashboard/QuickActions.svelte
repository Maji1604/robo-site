<script lang="ts">
	import { Plus, Clock, FileText, Users } from 'lucide-svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	const actions = [
		{
			title: 'Add Employee',
			description: 'Register a new team member',
			icon: Users,
			href: '/employees/new',
			color: 'bg-blue-500'
		},
		{
			title: 'Create Task',
			description: 'Assign a new task',
			icon: Plus,
			href: '/tasks/new',
			color: 'bg-green-500'
		},
		{
			title: 'Clock In/Out',
			description: 'Record attendance',
			icon: Clock,
			href: '/attendance',
			color: 'bg-orange-500'
		},
		{
			title: 'Generate Report',
			description: 'Create performance reports',
			icon: FileText,
			href: '/reports',
			color: 'bg-purple-500'
		}
	];
</script>

<Card class="p-6">
	<h3 class="text-lg font-semibold mb-4">Quick Actions</h3>
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		{#each actions as action}
			<a href={action.href} class="block">
				<div class="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors group">
					<div class="{action.color} p-2 rounded-lg mr-3 group-hover:scale-105 transition-transform">
						<svelte:component this={action.icon} class="text-white" size={20} />
					</div>
					<div>
						<h4 class="font-medium">{action.title}</h4>
						<p class="text-sm text-muted-foreground">{action.description}</p>
					</div>
				</div>
			</a>
		{/each}
	</div>
</Card>