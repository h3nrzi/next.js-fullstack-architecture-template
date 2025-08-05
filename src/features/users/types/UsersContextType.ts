"use client";
import type { UserPayload } from "./UserPayload";

export interface UsersContextType {
	userPayload: UserPayload | null;
	loading: boolean;
	error: string | null;
	isAuthenticated: boolean;
	refetchCurrentUser: () => void;
}
