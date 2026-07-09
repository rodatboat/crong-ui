<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import type { Folder } from "$lib/types";
    import EditIcon from "@lucide/svelte/icons/edit";
    import EyeIcon from "@lucide/svelte/icons/eye";
    import { resolve } from "$app/paths";

    let { folders, loading }: { folders: Folder[]; loading: boolean } =
        $props();
    const sortedFolders = $derived.by(() => [...folders].sort((a, b) => a.id - b.id));
</script>


<section class="items-center gap-6 pb-8 pt-6 md:py-10">
    <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
        {#if !loading}
            {#each sortedFolders as folder (folder.id)}
                <Card.Root>
                    <Card.Header>
                        <Card.Title>
                            <a href={resolve(`/jobs/folders/${folder.id}`)}
                                >{folder.name}</a
                            >
                        </Card.Title>
                    </Card.Header>

                    <Card.Footer
                        class="flex justify-start md:justify-end gap-2 p-2"
                    >
                        <Button
                            variant="secondary"
                            class="w-min hover:cursor-pointer order-1"
                            // href={`/jobs/folders/${folder.id}`}
                            ><EditIcon class="size-3" /> Edit
                        </Button>
                        <Button
                            class="w-min hover:cursor-pointer order-2"
                            href={`/jobs/folders/${folder.id}`}
                            ><EyeIcon class="size-3" /> View
                        </Button>
                    </Card.Footer>
                </Card.Root>
            {/each}
        {:else}
            {@render loadingFolder()}
            {@render loadingFolder()}
            {@render loadingFolder()}
        {/if}
    </div>
</section>

{#snippet loadingFolder()}
    <Card.Root class="h-25">
        <Card.Header class="flex-1">
            <Card.Title><Skeleton class="w-36 h-4" /></Card.Title>
        </Card.Header>

        <Card.Footer class="flex justify-start md:justify-end gap-2 p-2">
            {#each [1, 2] as _ (_)}
                <Skeleton class="w-16 h-8" />
            {/each}
        </Card.Footer>
    </Card.Root>
{/snippet}
