<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils";
	import { auth } from "$lib/auth/auth.svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import { Button } from "$lib/components/ui/button";

	let {
		class: className,
		children,
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<header
	class={cn(
		"flex items-center justify-between p-2 h-12 bg-accent top-0 sticky",
		className,
	)}
>
	<nav class="">
		{@render children?.()}
	</nav>
	<div class="flex items-center space-x-4 pr-2">
		<span class="text-accent-foreground text-sm">
			{auth.user?.first_name}{auth.user?.last_name ? `, ${auth.user?.last_name}` : ""}
		</span>
		<Button
		variant="link"
			class="min-w-24 hover:cursor-pointer hover:bg-accent text-accent-foreground"
			disabled={!auth.initialized}
			onclick={() => auth.deauth()}
		>
			<span class="text-sm">Logout</span>
		</Button>
	</div>
</header>

<style>
</style>
