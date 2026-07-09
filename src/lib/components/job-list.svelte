<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import { JOB_METHOD_MAP } from "$lib/const";
    import type { Job } from "$lib/types";
    import EditIcon from "@lucide/svelte/icons/edit";
    import HistoryIcon from "@lucide/svelte/icons/history";
    import JobRunButton from "$lib/components/job-run-button.svelte";
    import FolderIcon from "@lucide/svelte/icons/folder";
    import { resolve } from "$app/paths";
    import { folders } from "$lib/states/folders.svelte";
    import { page } from "$app/state";

    const pathname = $derived(page.url.pathname);
    let { jobs, loading }: { jobs: Job[]; loading: boolean } = $props();
    const sortedJobs = $derived.by(() => [...jobs].sort((a, b) => a.id - b.id));
</script>

<section class="items-center gap-6 pb-8 pt-6 md:py-10">
    <div class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4">
        {#if !loading}
            {#each sortedJobs as job (job.id)}
                <Card.Root>
                    <Card.Header>
                        <Card.Title
                            ><a href={resolve(`/jobs/${job.id}`)}>{job.title}</a
                            ></Card.Title
                        >
                        <Card.Description class="space-x-2">
                            <span class="font-bold"
                                >{JOB_METHOD_MAP.get(job.method)}</span
                            >
                            <a
                                class="text-accent max-w-xs md:max-w-lg truncate hover:underline"
                                target="_blank"
                                rel="external"
                                href={job.url}
                            >
                                {job.url}
                            </a>
                        </Card.Description>
                    </Card.Header>

                    <Card.Footer class="flex justify-between gap-2 p-2">
                        {#if pathname !== `/jobs/folders/${job.folder_id}` && job.folder_id !== null && folders.folders.get(job.folder_id as number)?.id !== undefined}
                            <Button
                                variant="secondary"
                                class="md:order-0 order-4 w-min hover:cursor-pointer"
                                href={`/jobs/folders/${job.folder_id}`}
                            >
                                <FolderIcon class="size-3" />
                            </Button>
                        {:else}
                            <span></span>
                        {/if}
                        <div class="flex gap-2 order-1">
                            <Button
                                variant="ghost"
                                class="md:order-1 order-3 w-min hover:cursor-pointer"
                                href={`/jobs/${job.id}/executions`}
                                ><HistoryIcon class="size-3" /> History</Button
                            >
                            <Button
                                variant="secondary"
                                class="w-min hover:cursor-pointer order-2"
                                href={`/jobs/${job.id}`}
                                ><EditIcon class="size-3" /> Edit</Button
                            >
                            <JobRunButton
                                jobId={job.id}
                                class="md:order-3 order-1 w-16"
                            />
                        </div>
                    </Card.Footer>
                </Card.Root>
            {/each}
        {:else}
            {@render loadingJob()}
            {@render loadingJob()}
            {@render loadingJob()}
        {/if}
    </div>
</section>

{#snippet loadingJob()}
    <Card.Root class="h-31">
        <Card.Header class="flex-1">
            <Card.Title><Skeleton class="w-36 h-4" /></Card.Title>
            <Card.Description class="space-x-2">
                <Skeleton class="w-48 h-2" />
            </Card.Description>
        </Card.Header>

        <Card.Footer class="flex justify-start md:justify-end gap-2 p-2">
            {#each [1, 2, 3] as _ (_)}
                <Skeleton class="w-16 h-8" />
            {/each}
        </Card.Footer>
    </Card.Root>
{/snippet}
