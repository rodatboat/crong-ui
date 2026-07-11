<script lang="ts">
    import { page } from "$app/state";
    import { auth } from '$lib/auth/auth.svelte';
    import { activeJob } from "$lib/states/job.svelte";

	let { children } = $props();

    const jobId = $derived(page.params.jobId);
    const jobIdNum = $derived(Number(jobId));

    $effect(() => {
        if (!auth.initialized || !jobIdNum) return;
        if (activeJob.initialized) return;
        activeJob.initialize(jobIdNum);
    })

</script>

{@render children?.()}
