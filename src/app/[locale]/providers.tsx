"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { PropsWithChildren } from "react";
import { AuthProvider } from "@/features/auth/context/AuthContext";

export function AppProviders({ children }: PropsWithChildren) {
	return (
		<Provider store={store}>
			<AuthProvider>{children}</AuthProvider>
		</Provider>
	);
}
