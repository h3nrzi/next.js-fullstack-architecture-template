import { LoginInput, RegisterInput } from "@/features/auth/schema/auth.schema";
import { ServerDataResponse } from "@/features/auth/types/ServerDataResponse";
import { UserPayload } from "@/features/auth/types/UserPayload";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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

			getCurrentUser: builder.query<UserPayload, void>({
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
