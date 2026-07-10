<script lang="ts">
    import { page } from "$app/state";
    import JobHistory from "$lib/components/job-history.svelte";
    import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";
    // import Button from "$lib/components/ui/button/button.svelte";

    const jobId = $derived(page.params.jobId);

    $effect(() => {
        if (!jobId) goto(resolve(`/jobs`));
    });
</script>

<section class="gap-6 pb-8 pt-6 px-6 md:px-8">
    <div class="flex items-center gap-6">
        <h1 class="text-2xl">History</h1>
        <!-- <Button
            class="w-min hover:cursor-pointer order-2"
            href="/folders/new"><FolderPlusIcon class="size-3" /> New folder</Button
        > -->
    </div>
    {#if jobId}
        <JobHistory {jobId} />
    {/if}
</section>
