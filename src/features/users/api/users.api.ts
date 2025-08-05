import { TAG_TYPES } from "@/constants/tag-type";
import { ServerDataResponse } from "@/features/users/types/ServerDataResponse";
import { UserPayload } from "@/features/users/types/UserPayload";
import { LoginInput } from "../types/LoginInput";
import { RegisterInput } from "../types/RegisterInput";
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

export const usersApi = createApi({
	reducerPath: "usersApi",
	baseQuery: baseQueryWithAuth,
	tagTypes: [TAG_TYPES.USER],
	endpoints(builder) {
		return {
			getCurrentUser: builder.query<UserPayload, void>({
				query: () => "/users/currentuser",
				transformResponse,
				providesTags: [TAG_TYPES.USER],
			}),

			register: builder.mutation<UserPayload, RegisterInput>({
				query: (args) => ({
					url: "/auth/register",
					method: "POST",
					body: args,
				}),
				transformResponse,
				invalidatesTags: [TAG_TYPES.USER],
			}),

			login: builder.mutation<UserPayload, LoginInput>({
				query: (args) => ({
					url: "/auth/login",
					method: "POST",
					body: args,
				}),
				transformResponse,
				invalidatesTags: [TAG_TYPES.USER],
			}),

			logout: builder.mutation<void, void>({
				query: () => ({
					url: "/auth/logout",
					method: "POST",
				}),
				invalidatesTags: [TAG_TYPES.USER],
			}),
		};
	},
});

export const { useGetCurrentUserQuery, useRegisterMutation, useLoginMutation, useLogoutMutation } = usersApi;
