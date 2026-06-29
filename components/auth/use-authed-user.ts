"use client";

import React, { useEffect, useState } from "react";
// import Cookies from "js-cookie";
import { toast } from "sonner";
import { AuthContextType } from "./auth-provider";
import { User } from "../types/types";

export type JWTPayload = {
    user_id: number;
    email: string;
    user: User;
};

export function useAuthedUser(): AuthContextType {
    const [authedUser, setAuthedUser] = useState<User | null>(null);
    const [isUserLoading, setUserLoading] = useState<boolean>(true);

    const loadAuthedUser = async (): Promise<void> => {
        setUserLoading(true);
        // await Promise.all([fetchUserDetails(), fetchUserOrgs()])
        setUserLoading(false);
    }

    useEffect(() => {
        if (authedUser == null || authedUser == undefined) {
            loadAuthedUser();
        }
    }, []);

    return { authedUser, setAuthedUser, isUserLoading };
}