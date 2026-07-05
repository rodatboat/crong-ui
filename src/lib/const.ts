export const BACKEND_URL="http://localhost:3000";
export const API_URL = `${BACKEND_URL}/api`;

export const AUTH_TOKEN_KEY = "auth_token";


export const JOB_METHOD_MAP = new Map<number, string>([
    [0, "GET"],
    [1, "POST"],
    [2, "PUT"],
    [3, "PATCH"],
    [4, "DELETE"],
    [5, "OPTIONS"],
    [6, "HEAD"],
    [7, "TRACE"],
    [8, "CONNECT"],
])