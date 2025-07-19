<script lang="ts">
  import { queryClient } from '@/lib/query-client';
	import '../app.css';
	import { QueryClientProvider } from '@tanstack/svelte-query'
  import { Toaster } from 'svelte-sonner';



	let { children } = $props();
</script>

<Toaster position="top-center" />
<QueryClientProvider client={queryClient}>
	{@render children()}
</QueryClientProvider>
