import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { CurrentUserResponse } from "../types/current-user-response";
import type { ApiResponse } from "../types/api-response";
import type { AuthPayload } from "../types/auth-payload";
import type { User } from "../types/user";
import type { RegisterInput, LoginInput } from "../schema/auth.schema";

// Custom base query that includes credentials and handles our API response format
const baseQueryWithAuth = fetchBaseQuery({
	baseUrl: "/api",
	credentials: "include",
	prepareHeaders: (headers) => {
		headers.set("Content-Type", "application/json");
		return headers;
	},
});

// Transform function to extract data from our API response format
const transformResponse = (response: ApiResponse<any>) => {
	if (response.status === "success" && response.data) return response.data;
	throw new Error("Unexpected response from server");
};

export const authApi = createApi({
	reducerPath: "authApi",
	baseQuery: baseQueryWithAuth,
	tagTypes: ["User"],
	endpoints(builder) {
		return {
			register: builder.mutation<AuthPayload, RegisterInput>({
				query: (args) => ({
					url: "/auth/register",
					method: "POST",
					body: args,
				}),
				transformResponse,
				invalidatesTags: ["User"],
			}),

			login: builder.mutation<AuthPayload, LoginInput>({
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

			getCurrentUser: builder.query<User, void>({
				query: () => "/users/currentuser",
				transformResponse: (response: ApiResponse<CurrentUserResponse>) => {
					if (response.status === "success" && response.data) return response.data.user;
					throw new Error("Unexpected response from server");
				},
				providesTags: ["User"],
			}),
		};
	},
});

export const {
	useRegisterMutation,
	useLoginMutation,
	useLogoutMutation,
	useGetCurrentUserQuery,
} = authApi;
