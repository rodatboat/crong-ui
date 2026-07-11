<script lang="ts">
    import { page } from "$app/state";
    import JobHistory from "$lib/components/job-history.svelte";
    import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";
    import JobRunButton from "$lib/components/job-run-button.svelte";
    // import Button from "$lib/components/ui/button/button.svelte";

    const jobId = $derived(page.params.jobId);
    const jobIdNum = $derived(Number(jobId));

    $effect(() => {
        if (!jobId) goto(resolve(`/jobs`));
    });
</script>

<section class="gap-6 pb-8 pt-6 px-6 md:px-8">
    <div class="flex items-center gap-6">
        <h1 class="text-2xl">History</h1>
        <JobRunButton jobId={jobIdNum} />
    </div>
    {#if jobId}
        <JobHistory {jobId} />
    {/if}
</section>
