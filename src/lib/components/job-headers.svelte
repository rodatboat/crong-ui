<script lang="ts">
    import Input from "$lib/components/ui/input/input.svelte";
    import Button from "$lib/components/ui/button/button.svelte";

    let { headers = $bindable() } = $props();

    function addHeader() {
        headers.push({
            key: "",
            value: ""
        });
    }

    function removeHeader(index: number) {
        headers.splice(index, 1);
    }
</script>

<div>
    {#each headers as header, i (header.name)}
    <div class="flex gap-2">
        <Input
            placeholder="Header"
            bind:value={header.key}
        />

        <Input
            placeholder="Value"
            bind:value={header.value}
        />

        <Button onclick={() => removeHeader(i)}>
            Delete
        </Button>
    </div>
{/each}

<Button onclick={addHeader}>
    Add Header
</Button>
</div>