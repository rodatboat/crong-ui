<script lang="ts">
    import { goto } from '$app/navigation';
    import { auth } from '$lib/auth/auth.svelte';
    import { onMount } from 'svelte';

	let { children } = $props();

    onMount(async () => {
        await auth.initialize();
    });

    $effect(() => {
        if (!auth.auth_token) goto("/login")
        else goto("/")
    })
</script>

{@render children()}