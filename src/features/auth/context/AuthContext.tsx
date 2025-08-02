"use client";

import React, { createContext } from "react";
import {
	useGetCurrentUserQuery,
	useLoginMutation,
	useRegisterMutation,
	useLogoutMutation,
} from "../services/auth.api";
import type { ApiResponse, User } from "../types";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export interface AuthContextType {
	loginRequest: (email: string, password: string) => Promise<void>;
	logoutRequest: () => Promise<void>;
	registerRequest: (name: string, email: string, password: string) => Promise<void>;
	currentUser: User | null;
	loading: boolean;
	error: string | null;
	isAuthenticated: boolean;
	refetchCurrentUser: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const router = useRouter();

	const {
		data: currentUser,
		isLoading,
		error: currentUserError,
		refetch: refetchCurrentUser,
	} = useGetCurrentUserQuery();

	const [loginMutation] = useLoginMutation();
	const [registerMutation] = useRegisterMutation();
	const [logoutMutation] = useLogoutMutation();

	const loginRequest = async (email: string, password: string): Promise<void> => {
		try {
			await loginMutation({ email, password }).unwrap();
			// NOTE: RTK Query will automatically refetch getCurrentUser due to invalidatesTags

			toast.success("ورود با موفقیت انجام شد");
		} catch (error: any) {
			toast.error((error as ApiResponse)?.errors?.[0]?.message || "ورود با خطا مواجه شد");
		}
	};

	const registerRequest = async (
		name: string,
		email: string,
		password: string,
	): Promise<void> => {
		try {
			await registerMutation({ name, email, password }).unwrap();
			// NOTE: RTK Query will automatically refetch getCurrentUser due to invalidatesTags

			toast.success("ثبت نام با موفقیت انجام شد");
		} catch (error) {
			toast.error(
				(error as ApiResponse)?.errors?.[0]?.message || "ثبت نام با خطا مواجه شد",
			);
		}
	};

	const logoutRequest = async (): Promise<void> => {
		try {
			await logoutMutation().unwrap();
			// NOTE: RTK Query will automatically refetch getCurrentUser due to invalidatesTags

			router.refresh();
			toast.success("خروج با موفقیت انجام شد");
		} catch (error: any) {
			toast.error((error as ApiResponse)?.errors?.[0]?.message || "خروج با خطا مواجه شد");
		}
	};

	const value: AuthContextType = {
		loginRequest,
		logoutRequest,
		registerRequest,
		currentUser: currentUser || null,
		loading: isLoading,
		error: (currentUserError as ApiResponse)?.errors?.[0]?.message || null,
		isAuthenticated: !!currentUser,
		refetchCurrentUser,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
