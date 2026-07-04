<script lang="ts">
	import '$lib/styles/layout.css';

	let { children } = $props();
</script>

<div class="flex flex-col w-min-screen w-screen h-min-screen h-screen">
	{@render children()}

	<footer>
		<p>
			visit 
			<a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a>
			to learn about SvelteKit
		</p>
	</footer>
</div>

<style>
</style>
