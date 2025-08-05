"use client";

import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { AuthContextType } from "../types/AuthContextType";

export function useAuth(): AuthContextType {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
