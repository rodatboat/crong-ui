<script lang="ts">
    import * as Pagination from "$lib/components/ui/pagination/index.js";
    import * as Card from "$lib/components/ui/card";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import type { APIResponse, JobExecution } from "$lib/types";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import { LOGGER } from "$lib/logger";
    import { auth } from "$lib/auth/auth.svelte";
    import { loadJobExecutions } from "$lib/services/jobs";
    import { activeJob } from "$lib/states/job.svelte";

    interface Props {
        jobId: string;
    }

    const { jobId }: Props = $props();

    let jobExecutions = $state<JobExecution[]>([]);
    let loading = $state<boolean>(true);
    let error = $state<string | undefined>();

    const jobIdNum = $derived(Number(jobId));
    const pageNum = $derived(Number(page.url.searchParams.get("page")) || 1);
    const limit = $derived(Number(page.url.searchParams.get("limit")) || 10);

    // For now, estimate total count. In a real app, the API should return this
    const totalCount = $derived(
        jobExecutions.length > 0
            ? Math.max(
                  pageNum * limit + 1,
                  pageNum * limit + jobExecutions.length,
              ) : 0,
    );

    async function loadJobHistory() {
        if (!jobId || !jobIdNum) return;

        loading = true;
        try {
            const resp: APIResponse<JobExecution[]> = await loadJobExecutions(
                jobIdNum,
                pageNum,
                limit,
            );

            if (resp.status === 200 && resp.data) {
                jobExecutions = resp.data;
                error = undefined;
            } else {
                error = resp.message || "Failed to load job executions";
                LOGGER.error("Failed to load job executions", error);
            }
        } catch (err) {
            error = "An error occurred while loading executions";
            LOGGER.error("Error loading executions", err);
        } finally {
            loading = false;
        }
    }

    async function handlePageChange(newPage: number) {
        const url = new URL(page.url);
        url.searchParams.set("page", String(newPage));
        url.searchParams.set("limit", String(limit));
        // eslint-disable-next-line svelte/no-navigation-without-resolve
        goto(url.toString(), { invalidateAll: true });
    }

    $effect(() => {
        if (!auth.initialized || !jobIdNum || !activeJob.initialized) return;
        loadJobHistory();
    });
</script>

<section class="items-center gap-6 pb-8 pt-6 md:py-10">
    {#if error}
        <div class="text-destructive">
            {error}
        </div>
    {:else if loading}
        <div class="space-y-4">
            {#each [1, 2, 3] as idx (idx)}
                <Card.Root class="p-4">
                    <Skeleton class="w-full h-20" />
                </Card.Root>
            {/each}
        </div>
    {:else if jobExecutions.length === 0}
        <div class="text-center text-muted-foreground">
            No job executions found
        </div>
    {:else}
        <div class="space-y-4">
            {#each jobExecutions as execution (execution.id)}
                <Card.Root>
                    <Card.Header>
                        <Card.Title>
                            {new Date(
                                execution.executed_at || execution.created_at,
                            ).toLocaleString()}
                        </Card.Title>
                        <Card.Description>
                            Status: {execution.status_text} ({execution.status_code})
                            • Duration: {execution.duration_ms}ms
                        </Card.Description>
                    </Card.Header>
                </Card.Root>
            {/each}

            <Pagination.Root count={totalCount} perPage={limit} page={pageNum}>
                {#snippet children({ pages, currentPage: activePage })}
                    <Pagination.Content>
                        <Pagination.Item>
                            <Pagination.Previous
                                onclick={() =>
                                    activePage > 1 &&
                                    handlePageChange(activePage - 1)}
                                disabled={activePage === 1}
                            />
                        </Pagination.Item>
                        {#each pages as pageItem (pageItem.key)}
                            {#if pageItem.type === "ellipsis"}
                                <Pagination.Item>
                                    <Pagination.Ellipsis />
                                </Pagination.Item>
                            {:else}
                                <Pagination.Item>
                                    <Pagination.Link
                                        page={pageItem}
                                        isActive={activePage === pageItem.value}
                                        onclick={() =>
                                            handlePageChange(pageItem.value)}
                                    >
                                        {pageItem.value}
                                    </Pagination.Link>
                                </Pagination.Item>
                            {/if}
                        {/each}
                        <Pagination.Item>
                            <Pagination.Next
                                onclick={() => handlePageChange(activePage + 1)}
                            />
                        </Pagination.Item>
                    </Pagination.Content>
                {/snippet}
            </Pagination.Root>
        </div>
    {/if}
</section>
