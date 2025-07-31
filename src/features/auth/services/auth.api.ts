import {
	createApi,
	fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import type { AuthPayload } from "../types";
import type {
	RegisterInput,
	LoginInput,
} from "../schema/auth.schema";

export const authApi = createApi({
	reducerPath: "authApi",
	baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
	endpoints(builder) {
		return {
			register: builder.mutation<AuthPayload, RegisterInput>({
				query: (args) => ({
					url: "/auth/login",
					method: "POST",
					body: args,
				}),
			}),

			login: builder.mutation<AuthPayload, LoginInput>({
				query: (args) => ({
					url: "/auth/login",
					method: "POST",
					body: args,
				}),
			}),
		};
	},
});

export const { useRegisterMutation, useLoginMutation } = authApi;
