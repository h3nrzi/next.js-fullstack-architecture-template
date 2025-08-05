"use client";

import { useRouter } from "next/navigation";
import React, { createContext } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
	authApi,
	useGetCurrentUserQuery,
	useLoginMutation,
	useLogoutMutation,
	useRegisterMutation,
} from "../api/auth.api";
import { RTKQueryErrorResponse } from "../types/RTKQueryErrorResponse";
import type { UserPayload } from "../types/UserPayload";
import { User } from "../types/User";
export interface AuthContextType {
	loginRequest: (email: string, password: string) => Promise<void>;
	logoutRequest: () => Promise<void>;
	registerRequest: (name: string, email: string, password: string) => Promise<void>;
	userPayload: UserPayload<User> | null;
	loading: boolean;
	error: string | null;
	isAuthenticated: boolean;
	refetchCurrentUser: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const dispatch = useDispatch();
	const router = useRouter();

	const {
		data: userPayload,
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
			router.push("/");
		} catch (error) {
			console.log(error);
			toast.error(
				(error as RTKQueryErrorResponse)?.data?.errors?.[0]?.message ||
					"ورود با خطا مواجه شد",
			);
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
			router.push("/");
		} catch (error) {
			toast.error(
				(error as RTKQueryErrorResponse)?.data?.errors?.[0]?.message ||
					"ثبت نام با خطا مواجه شد",
			);
		}
	};

	const logoutRequest = async (): Promise<void> => {
		try {
			await logoutMutation().unwrap();
			// Clear RTK Query cache and reset auth state
			dispatch(authApi.util.resetApiState());
			toast.success("خروج با موفقیت انجام شد");
			router.refresh();
		} catch (error: any) {
			toast.error(
				(error as RTKQueryErrorResponse)?.data?.errors?.[0]?.message ||
					"خروج با خطا مواجه شد",
			);
		}
	};

	const value: AuthContextType = {
		loginRequest,
		logoutRequest,
		registerRequest,
		userPayload: userPayload || null,
		loading: isLoading,
		error:
			(currentUserError as RTKQueryErrorResponse)?.data?.errors?.[0]?.message || null,
		isAuthenticated: !!userPayload,
		refetchCurrentUser,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
