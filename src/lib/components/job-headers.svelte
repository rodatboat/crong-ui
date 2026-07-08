<script lang="ts">
    import Input from "$lib/components/ui/input/input.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import Label from "$lib/components/ui/label/label.svelte";

    let { headers = $bindable() } = $props();

    function addHeader() {
        headers = [...headers, { key: "", value: "" }];
    }

    function removeHeader(index: number) {
        headers = headers.filter((_: unknown, i: number) => i !== index);
    }
</script>

<div class="space-y-2">
    <Label for="headers">Headers</Label>
    {#each headers as header, i (header.key + i)}
        <div class="flex gap-2">
            <Input placeholder="Header" bind:value={header.key} />

            <Input placeholder="Value" bind:value={header.value} />

            <Button onclick={() => removeHeader(i)} class="hover:cursor-pointer"
                >Delete</Button
            >
        </div>
    {/each}

    <Button variant="secondary" onclick={addHeader} class="mt-2 hover:cursor-pointer">Add Entry</Button
    >
</div>
