<script lang="ts">
	import { formatDate } from '$lib/utils';
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	interface Activity {
		id: string;
		type: 'task' | 'employee' | 'leave' | 'attendance';
		title: string;
		description: string;
		timestamp: string;
		user: string;
	}

	const activities: Activity[] = [
		{
			id: '1',
			type: 'task',
			title: 'Task Completed',
			description: 'Website redesign project completed by John Doe',
			timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
			user: 'John Doe'
		},
		{
			id: '2',
			type: 'employee',
			title: 'New Employee',
			description: 'Sarah Wilson joined the Marketing team',
			timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
			user: 'HR Team'
		},
		{
			id: '3',
			type: 'leave',
			title: 'Leave Approved',
			description: 'Mike Johnson\'s vacation request approved',
			timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
			user: 'Jane Smith'
		},
		{
			id: '4',
			type: 'attendance',
			title: 'Late Check-in',
			description: 'Tom Brown checked in 30 minutes late',
			timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
			user: 'System'
		}
	];

	function getBadgeVariant(type: Activity['type']) {
		switch (type) {
			case 'task': return 'default';
			case 'employee': return 'secondary';
			case 'leave': return 'outline';
			case 'attendance': return 'destructive';
			default: return 'default';
		}
	}
</script>

<Card class="p-6">
	<h3 class="text-lg font-semibold mb-4">Recent Activity</h3>
	<div class="space-y-4">
		{#each activities as activity}
			<div class="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-b-0">
				<Badge variant={getBadgeVariant(activity.type)} class="mt-1">
					{activity.type}
				</Badge>
				<div class="flex-1 min-w-0">
					<h4 class="font-medium text-sm">{activity.title}</h4>
					<p class="text-sm text-muted-foreground">{activity.description}</p>
					<p class="text-xs text-muted-foreground mt-1">
						{formatDate(activity.timestamp, 'time')} • {activity.user}
					</p>
				</div>
			</div>
		{/each}
	</div>
	<div class="mt-4 pt-4 border-t">
		<a href="/activity" class="text-sm text-blue-600 hover:text-blue-700 font-medium">
			View all activity →
		</a>
	</div>
</Card>