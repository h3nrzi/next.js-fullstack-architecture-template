"use client";

import { useContext } from "react";
import { UsersContext } from "../context/users.context";
import { UsersContextType } from "../types/UsersContextType";

export function useUsers(): UsersContextType {
	const context = useContext(UsersContext);
	if (context === undefined) {
		throw new Error("useUsers must be used within an UsersProvider");
	}
	return context;
}
