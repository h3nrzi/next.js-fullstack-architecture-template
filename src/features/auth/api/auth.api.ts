import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { LoginInput, RegisterInput } from "../schema/auth.schema";
import type { ServerDataResponse } from "../types/ServerDataResponse";
import type { User } from "../types/User";
import type { UserPayload } from "../types/UserPayload";

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
const transformResponse = (response: ServerDataResponse<UserPayload<User>>) => {
	if (response.status === "success" && response.data) return response.data;
	throw new Error("Unexpected response from server");
};

export const authApi = createApi({
	reducerPath: "authApi",
	baseQuery: baseQueryWithAuth,
	tagTypes: ["User"],
	endpoints(builder) {
		return {
			register: builder.mutation<UserPayload<User>, RegisterInput>({
				query: (args) => ({
					url: "/auth/register",
					method: "POST",
					body: args,
				}),
				transformResponse,
				invalidatesTags: ["User"],
			}),

			login: builder.mutation<UserPayload<User>, LoginInput>({
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

			getCurrentUser: builder.query<UserPayload<User>, void>({
				query: () => "/users/currentuser",
				transformResponse,
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
