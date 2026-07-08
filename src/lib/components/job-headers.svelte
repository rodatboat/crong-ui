<script lang="ts">
    import Input from "$lib/components/ui/input/input.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import TrashIcon from "@lucide/svelte/icons/trash";
    import SquarePlusIcon from "@lucide/svelte/icons/square-plus";
    import type { JobHeaders } from "$lib/types";

    let { headers = $bindable<JobHeaders[]>() } = $props();

    function addHeader() {
        headers = [...headers, { key: "", value: "" }];
    }

    function removeHeader(index: number) {
        headers = headers.filter((_: unknown, i: number) => i !== index);
    }
</script>

<div class="space-y-2">
    {#each headers as header, i (i)}
        <div class="flex gap-2">
            <Input
                placeholder="Key"
                value={header.key}
                onchange={(e) => {
                    headers[i].key = e.currentTarget.value;
                }}
            />

            <Input
                placeholder="Value"
                value={header.value}
                onchange={(e) => {
                    headers[i].value = e.currentTarget.value;
                }}
            />

            <Button
                variant="destructive"
                onclick={() => removeHeader(i)}
                class="hover:cursor-pointer"
                ><TrashIcon class="size-3" /></Button
            >
        </div>
    {/each}

    <div class="flex justify-end w-full">
        <Button
            variant="default"
            onclick={addHeader}
            class="hover:cursor-pointer"
            ><SquarePlusIcon class="size-3" /></Button
        >
    </div>
</div>
