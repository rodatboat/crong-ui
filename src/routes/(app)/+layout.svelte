<script lang="ts">
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import AppSidebar from "$lib/components/app-sidebar.svelte";
	import "$lib/styles/layout.css";
	import { auth } from "$lib/auth/auth.svelte";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import Header from "./Header.svelte";

	let { children } = $props();

	onMount(async () => {
		await auth.initialize();
	});

	$effect(() => {
		if (auth.initialized && !auth.auth_token) goto(resolve("/login"));
	});
</script>

<Sidebar.Provider class="max-w-screen w-screen max-h-screen overflow-x-hidden overflow-y-scroll">
	<AppSidebar />
	<main
		class="flex-1 flex flex-col"
	>
		<Header class="h-12">
			<Sidebar.Trigger
				class="hover:cursor-pointer text-accent-foreground hover:bg-transparent"
			/>
		</Header>
		{@render children?.()}
	</main>
</Sidebar.Provider>
