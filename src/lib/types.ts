

export type User = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

export type Job = {
    id: number;
    title: string;
    url: string;
    folder_id?: number;
    
    method: number;
    headers: JobHeaders[];
    auth: JobAuth;
    body: string;
    cron: string;

    timezone: string;
    timeout: number;
    enabled: boolean;

    last_execution?: Date;
    created_at: string;
    updated_at: string;
}

export type JobHeaders = {
    key: string;
    value: string;
}

export type JobAuth = {
    enabled: boolean;
    username: string;
    password: string;
}

export type JobExecution = {
    id: number;
    job_id: number;

    execution_status: number;
    status_code: number;
    status_text: string;
    duration_ms: number;
    url: string;

    response_headers: JobHeaders[];
    response_body: string;
    error: string;


    executed_at?: string;
    planned_for?: string;
    created_at: string;
}

export type Folder = {
    id: number;
    name: string;
}

export type APIResponse<T = unknown> = {
    status?: number;
    message?: string;
    data?: T | null;
}

export type ValidationErrors = Record<string, string>;