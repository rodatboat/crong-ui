<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { JOB_METHOD_MAP } from "$lib/const";
    import type { Job } from "$lib/types";

    let { jobs }: { jobs: Job[] } = $props();
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

                <Card.Footer>
                    <Card.Action>Apply</Card.Action>
                </Card.Footer>
            </Card.Root>
        {/each}
    </div>
</section>
