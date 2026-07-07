<script lang="ts">
    import { auth } from "$lib/auth/auth.svelte";
    import FolderList from "$lib/components/folder-list.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import SquarePlusIcon from "@lucide/svelte/icons/square-plus";
    import { loadFolders } from "$lib/services/folders";
    import type { Folder } from "$lib/types";

    let folders = $state<Folder[]>([]);
    let loading = $state<boolean>(true);

    $effect(() => {
        if (!auth.auth_token) return;
        loadFolders().then(({ data }) => {
            if (!data) return;
            folders = data;
            loading = false;
        });
    });
</script>

<section class="gap-6 pb-8 pt-6 px-6 md:px-8">
    <div class="flex items-center gap-6">
        <h1 class="text-2xl">Folders</h1>
        <Button
            class="w-min hover:cursor-pointer order-2"
            href="/folders/new"><SquarePlusIcon class="size-3" /> New</Button
        >
    </div>
    <FolderList {folders} {loading} />
</section>
