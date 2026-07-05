<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { JOB_METHOD_MAP } from "$lib/const";
    import type { Job } from "$lib/types";
    import PlayIcon from "@lucide/svelte/icons/play";
    import EditIcon from "@lucide/svelte/icons/edit";
    import HistoryIcon from "@lucide/svelte/icons/history";
    import LoaderIcon from "@lucide/svelte/icons/loader-circle";
    import { triggerJob } from "$lib/services/jobs";
    // import { resolve } from "$app/paths";

    let { jobs }: { jobs: Job[] } = $props();
    let runningJob: boolean = $state(false);
</script>

<section class="items-center gap-6 pb-8 pt-6 md:py-10">
    <div class="flex flex-col gap-4 bg-">
        {#each jobs as job (job.title)}
            <Card.Root>
                <Card.Header>
                    <Card.Title>{job.title}</Card.Title>
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

                <Card.Footer class="flex justify-start md:justify-end gap-2 p-2">
                    <Button variant="ghost" class="md:order-1 order-3 w-min hover:cursor-pointer"
                        ><HistoryIcon class="size-3" /> History</Button
                    >
                    <Button
                        variant="secondary"
                        class="w-min hover:cursor-pointer order-2"
                        ><EditIcon class="size-3" /> Edit</Button
                    >
                    <Button
                        variant="default"
                        class="md:order-3 order-1 w-16 hover:cursor-pointer"
                        onclick={async () => {
                            runningJob = true;
                            await triggerJob(job.id);
                            runningJob = false;
                        }}
                    >
                        {#if runningJob}
                            <LoaderIcon class="size-3 animate-spin" />
                        {:else}
                            <PlayIcon class="size-3" />
                            Run
                        {/if}
                    </Button>
                </Card.Footer>
            </Card.Root>
        {/each}
    </div>
</section>
