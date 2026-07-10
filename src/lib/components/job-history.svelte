<script lang="ts">
    import * as Pagination from "$lib/components/ui/pagination/index.js";
    import * as Card from "$lib/components/ui/card";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import type { JobExecution } from "$lib/types";
    import { page } from "$app/state";
    // import { goto } from "$app/navigation";
    // import { resolve } from "$app/paths";

    interface Props {
        jobExecutions: JobExecution[];
        loading: boolean;
        error?: string;
        currentPage: number;
        perPage: number;
    }

    const { jobExecutions, loading, error, currentPage, perPage }: Props = $props();

    // For now, estimate total count. In a real app, the API should return this
    const totalCount = $derived(jobExecutions.length > 0 ? Math.max(currentPage * perPage + 1, currentPage * perPage + jobExecutions.length) : 0);

    async function handlePageChange(newPage: number) {
        const url = new URL(page.url);
        url.searchParams.set("page", String(newPage));
        url.searchParams.set("limit", String(perPage));
        // await goto(resolve(url.toString()));
    }
</script>

<section class="pb-8 pt-6 md:py-10">
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
                <Card.Root class="p-4">
                    <Card.Header class="pb-2">
                        <Card.Title class="text-base">
                            {new Date(execution.executed_at || execution.created_at).toLocaleString()}
                        </Card.Title>
                        <Card.Description>
                            Status: {execution.status_text} ({execution.status_code}) • Duration: {execution.duration_ms}ms
                        </Card.Description>
                    </Card.Header>
                </Card.Root>
            {/each}

            <Pagination.Root {totalCount} perPage={perPage}>
                {#snippet children({ pages, currentPage: activePage })}
                    <Pagination.Content>
                        <Pagination.Item>
                            <Pagination.Previous 
                                onclick={() => activePage > 1 && handlePageChange(activePage - 1)}
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
                                        onclick={() => handlePageChange(pageItem.value)}
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
