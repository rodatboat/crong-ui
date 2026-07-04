<script lang="ts">
	import '$lib/styles/layout.css';

	let { children } = $props();
</script>

<div class="flex flex-col w-min-screen w-screen h-min-screen h-screen">
	{@render children()}
</div>

<style>
</style>
