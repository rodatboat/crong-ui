import { auth } from "$lib/auth/auth.svelte";
import { API_URL } from "$lib/const";
import { LOGGER } from "$lib/logger";
import { type Folder, type APIResponse, type ValidationErrors, type Job } from "$lib/types";
import { fetchAPI } from "$lib/utils";

export async function loadFolders(): Promise<APIResponse<Folder[]>> {
    LOGGER.debug("Loading user's folders");
    return fetchAPI<APIResponse<Folder[]>>(`${API_URL}/folders`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.auth_token}`,
        }
    });
}

export async function loadFolderById(folderId: number): Promise<APIResponse<Folder>> {
    LOGGER.debug("Loading folder details by id", folderId);
    return fetchAPI<APIResponse<Folder>>(`${API_URL}/folders/${folderId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.auth_token}`,
        }
    });
}

export async function DeleteFolderById(folderId: number): Promise<APIResponse<undefined>> {
    LOGGER.debug("Deleting folder by id", folderId);
    return fetchAPI<APIResponse<undefined>>(`${API_URL}/folders/${folderId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.auth_token}`,
        }
    });
}

export type FolderJobsResponse = APIResponse<Folder & { jobs: Job[] }> | APIResponse<ValidationErrors>;

export async function loadJobsByFolder(folderId: number): Promise<APIResponse<FolderJobsResponse>> {
    LOGGER.debug("Loading folder jobs by id", folderId);
    return fetchAPI<APIResponse<FolderJobsResponse>>(`${API_URL}/folders/${folderId}/jobs`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.auth_token}`,
        }
    });
}

export type CreateFolderRequest = APIResponse & Omit<Folder, 'id'>;
export type CreateFolderResponse = APIResponse<Folder | ValidationErrors>
export async function createFolder(data: CreateFolderRequest): Promise<CreateFolderResponse> {
    LOGGER.info(`Creating new folder`);
    return fetchAPI<CreateFolderResponse>(`${API_URL}/folders/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export type UpdateFolderRequest = APIResponse & Omit<Folder, 'id'>;
export type UpdateFolderResponse = APIResponse<Folder | ValidationErrors>
export async function updateFolder(folderId: number, data: UpdateFolderRequest): Promise<UpdateFolderResponse> {
    LOGGER.info(`Updating existing folder`);
    return fetchAPI<UpdateFolderResponse>(`${API_URL}/folders/${folderId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}