"use client";

export interface AuthContextType {
	loginRequest: (email: string, password: string) => Promise<void>;
	logoutRequest: () => Promise<void>;
	registerRequest: (name: string, email: string, password: string) => Promise<void>;
}
