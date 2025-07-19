<script lang="ts">
	import { Users, CheckSquare, Clock, TrendingUp } from 'lucide-svelte';
	import StatsCard from '$lib/components/dashboard/StatsCard.svelte';
	import QuickActions from '$lib/components/dashboard/QuickActions.svelte';
	import RecentActivity from '$lib/components/dashboard/RecentActivity.svelte';

	// Mock data - replace with real API calls
	const stats = [
		{
			title: 'Total Employees',
			value: 127,
			change: 8.2,
			icon: Users,
			color: 'blue'
		},
		{
			title: 'Active Tasks',
			value: 45,
			change: -2.1,
			icon: CheckSquare,
			color: 'green'
		},
		{
			title: 'Hours Logged',
			value: '1,024',
			change: 12.5,
			icon: Clock,
			color: 'orange'
		},
		{
			title: 'Productivity',
			value: '94%',
			change: 3.8,
			icon: TrendingUp,
			color: 'purple'
		}
	];
</script>

<div class="space-y-6">
	<!-- Page Header -->
	<div>
		<h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
		<p class="text-gray-600">Welcome back! Here's what's happening at Creoleap today.</p>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		{#each stats as stat}
			<StatsCard
				title={stat.title}
				value={stat.value}
				change={stat.change}
				icon={stat.icon}
				color={stat.color}
			/>
		{/each}
	</div>

	<!-- Main Content Grid -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Quick Actions -->
		<div class="lg:col-span-1">
			<QuickActions />
		</div>

		<!-- Recent Activity -->
		<div class="lg:col-span-2">
			<RecentActivity />
		</div>
	</div>
</div>