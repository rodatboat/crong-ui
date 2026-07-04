<script lang="ts">
    import { goto } from '$app/navigation';
    import { auth } from '$lib/auth/auth.svelte';
    import { resolve } from '$app/paths';
    import { onMount } from 'svelte';

	let { children } = $props();

    onMount(async () => {
        await auth.initialize();
    });

    $effect(() => {
        if (auth.initialized && !auth.auth_token) goto(resolve("/login"))
        else goto(resolve("/"))
    })
</script>

{@render children()}