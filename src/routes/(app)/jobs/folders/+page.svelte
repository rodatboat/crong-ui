<script lang="ts">
    import { auth } from "$lib/auth/auth.svelte";
    import FolderList from "$lib/components/folder-list.svelte";
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
    <h1 class="text-2xl">Folders</h1>
    <FolderList {folders} {loading} />
</section>
