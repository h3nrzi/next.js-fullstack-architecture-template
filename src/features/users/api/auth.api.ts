import { LoginInput } from "../types/LoginInput";
import { RegisterInput } from "../types/RegisterInput";
import { ServerDataResponse } from "@/features/users/types/ServerDataResponse";
import { UserPayload } from "@/features/users/types/UserPayload";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQueryWithAuth = fetchBaseQuery({
	baseUrl: "/api",
	credentials: "include",
	prepareHeaders: (headers) => {
		headers.set("Content-Type", "application/json");
		return headers;
	},
});

const transformResponse = (response: ServerDataResponse<UserPayload>) => {
	if (response.status === "success" && response.data) return response.data;
	throw new Error("Unexpected response from server");
};

export const authApi = createApi({
	reducerPath: "authApi",
	baseQuery: baseQueryWithAuth,
	tagTypes: ["User"],
	endpoints(builder) {
		return {
			register: builder.mutation<UserPayload, RegisterInput>({
				query: (args) => ({
					url: "/auth/register",
					method: "POST",
					body: args,
				}),
				transformResponse,
				invalidatesTags: ["User"],
			}),

			login: builder.mutation<UserPayload, LoginInput>({
				query: (args) => ({
					url: "/auth/login",
					method: "POST",
					body: args,
				}),
				transformResponse,
				invalidatesTags: ["User"],
			}),

			logout: builder.mutation<void, void>({
				query: () => ({
					url: "/auth/logout",
					method: "POST",
				}),
				invalidatesTags: ["User"],
			}),
		};
	},
});

export const { useRegisterMutation, useLoginMutation, useLogoutMutation } = authApi;
