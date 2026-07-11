<script lang="ts">
    import { auth } from "$lib/auth/auth.svelte";
    import FolderList from "$lib/components/folder-list.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import FolderPlusIcon from "@lucide/svelte/icons/folder-plus";
    import { loadFolders } from "$lib/services/folders";
    import type { Folder } from "$lib/types";
    import { folders } from "$lib/states/folders.svelte";

    let foldersList = $state<Folder[]>([]);
    let loading = $state<boolean>(true);

    $effect(() => {
        if (!auth.auth_token) return;
        loadFolders().then(({ data }) => {
            if (!data) return;
            foldersList = data;
            folders.updateFolders(foldersList);
            loading = false;
        });
    });
</script>

<section class="gap-6 pb-8 pt-6 px-6 md:px-8">
    <div class="flex items-center gap-6">
        <h1 class="text-2xl">Folders</h1>
        <Button
            class="w-min hover:cursor-pointer order-2"
            href="/folders/new"><FolderPlusIcon class="size-3" /> New folder</Button
        >
    </div>
    <FolderList folders={foldersList} {loading} />
</section>
