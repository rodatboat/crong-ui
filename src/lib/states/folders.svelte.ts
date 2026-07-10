import { LOGGER } from "$lib/logger";
import { loadFolders as fetchFolders } from "$lib/services/folders";
import type { APIResponse, Folder } from "$lib/types";
import type { AuthState } from "$lib/auth/auth.svelte";

class FolderState {
    folders = $state<Map<number, Folder>>(new Map());
    initialized = $state(false);

    async initialize(authState: AuthState) {
        if (!authState.initialized) {
            LOGGER.warn("Auth not initialized, skipping folders initialization");
            return;
        }

        LOGGER.debug("Loading user folders");
        const resp: APIResponse<Folder[]> = await fetchFolders();
        
        if (resp.status === 200 && resp.data) {
            LOGGER.info("Folders loaded successfully");
            this.folders.clear();
            this.folders = new Map(resp.data.map((folder) => [folder.id, folder]));
        } else {
            LOGGER.error("Failed to load folders", resp.message);
            this.folders.clear();
        }
        
        this.initialized = true;
    }
}

export const folders = new FolderState();