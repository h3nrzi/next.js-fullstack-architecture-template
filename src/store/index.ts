import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "@/features/users/api/auth.api";
import { usersApi } from "@/features/users/api/users.api";

export const store = configureStore({
	reducer: {
		[authApi.reducerPath]: authApi.reducer,
		[usersApi.reducerPath]: usersApi.reducer,
	},
	middleware(getDefaultMiddleware) {
		return getDefaultMiddleware().concat(authApi.middleware, usersApi.middleware);
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
