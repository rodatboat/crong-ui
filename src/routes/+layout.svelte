<script lang="ts">
	import '$lib/styles/layout.css';

	let { children } = $props();
</script>

<div class="w-screen max-w-screen h-screen">
	{@render children()}
</div>

<style>
</style>
