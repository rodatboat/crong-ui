<script lang="ts">
    import { cn, type WithElementRef } from "$lib/utils";
    import type { HTMLAttributes } from "svelte/elements";


	let {
		class: className,
		children,
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<header class={cn("flex items-center justify-between p-2", className)}>
	<nav class="">
		{@render children?.()}
	</nav>
</header>

<style>
</style>
