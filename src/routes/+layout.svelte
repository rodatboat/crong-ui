<script lang="ts">
	import '$lib/styles/layout.css';

	let { children } = $props();
</script>

<div class="app flex-col h-min-screen flex h-screen">
	<main class="flex-1">
		{@render children()}
	</main>

	<footer>
		<p>
			visit 
			<a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a>
			to learn about SvelteKit
		</p>
	</footer>
</div>

<style>
	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
