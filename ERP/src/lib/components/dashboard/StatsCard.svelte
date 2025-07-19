<script lang="ts">
	import type { ComponentType } from 'svelte';
	import * as Card from "$lib/components/ui/card/index.js";
	import { cn } from '$lib/utils';

	export let title: string;
	export let value: string | number;
	export let change: number;
	export let icon: ComponentType;
	export let color: string = 'blue';

	$: isPositive = change >= 0;
	$: colorClasses = {
		blue: 'bg-blue-500',
		green: 'bg-green-500',
		orange: 'bg-orange-500',
		purple: 'bg-purple-500'
	};
</script>

<Card class="p-6">
	<div class="flex items-center justify-between">
		<div>
			<p class="text-sm font-medium text-muted-foreground">{title}</p>
			<p class="text-2xl font-bold">{value}</p>
			<p class={cn('text-sm', isPositive ? 'text-green-600' : 'text-red-600')}>
				{isPositive ? '+' : ''}{change}% from last month
			</p>
		</div>
		<div class={cn('p-3 rounded-full', colorClasses[color])}>
			<svelte:component this={icon} class="text-white" size={24} />
		</div>
	</div>
</Card>