"use client";

import { createContext } from "react";
import { User } from "../types/types";
import { useAuthedUser } from "./use-authed-user";

/*
    Provider for the authentication context (user details).
    Prior to this, middleware ensures that user is authenticated.
    This is mainly for initializing the context for authorization.
*/
export function AuthProvider({ children }: { children: React.ReactNode; }) {
    const authedUser = useAuthedUser();

    return (
        <AuthContext.Provider value={authedUser}>
            {children}
        </AuthContext.Provider>
    );
}

export type AuthContextType = {
    authedUser: User | null;
    setAuthedUser: (user: User | null) => void;
    
    isUserLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
    authedUser: null,
    setAuthedUser: () => {},
    isUserLoading: true
});