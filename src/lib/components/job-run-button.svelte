<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import PlayIcon from "@lucide/svelte/icons/play";
    import LoaderIcon from "@lucide/svelte/icons/loader-circle";
    import { triggerJob } from "$lib/services/jobs";

    interface Props {
        jobId: number;
        class?: string;
    }

    let { jobId, class: className = "" }: Props = $props();
    let loading = $state(false);

    async function handleRunJob() {
        loading = true;
        await triggerJob(jobId);
        loading = false;
    }
</script>

<Button
    variant="secondary"
    class={`hover:cursor-pointer ${className}`}
    disabled={loading}
    onclick={handleRunJob}
>
    {#if loading}
        <LoaderIcon class="size-3 animate-spin" />
    {:else}
        <PlayIcon class="size-3" />
        Run
    {/if}
</Button>
