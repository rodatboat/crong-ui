

export async function loginUser(values: LoginFormState): Promise<StaffDetailsResponse> {
    const response = await fetchWithSession(`${BACKEND_URL}/api/users/login`, Cookies, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
    .then((res) => res.json())
    .catch((err) => ({
        success: false,
        message: err.message
    }));
    
    return {
        success: response?.status === 200,
        message: response?.message,
        data: response?.data as User,
        error: response?.error
    };
}

export async function registerUser(values: RegisterFormState): Promise<StaffDetailsResponse> {
    const response = await fetchWithSession(`${BACKEND_URL}/auth/register`, Cookies, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
    .then((res) => res.json())
    .catch((err) => ({
        success: false,
        message: err.message
    }));
    
    return {
        success: response?.status === 200,
        message: response?.message,
        data: response?.data as User,
        error: response?.error
    };
}