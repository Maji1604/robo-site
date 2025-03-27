<script lang="ts">
	import '../app.css';
	import NavBar from '../components/NavBar.svelte';
	import "@fontsource/ubuntu";
	let { children } = $props();
</script>
<NavBar />
{@render children()}
