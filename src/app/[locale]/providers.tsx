"use client";

import { AuthProvider } from "@/features/users/providers/auth.provider";
import { UsersProvider } from "@/features/users/providers/users.provider";
import { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";

export function AppProviders({ children }: PropsWithChildren) {
	return (
		<Provider store={store}>
			<AuthProvider>
				<UsersProvider>{children}</UsersProvider>
			</AuthProvider>
		</Provider>
	);
}
