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

export const usersApi = createApi({
	reducerPath: "usersApi",
	baseQuery: baseQueryWithAuth,
	tagTypes: ["User"],
	endpoints(builder) {
		return {
			getCurrentUser: builder.query<UserPayload, void>({
				query: () => "/users/currentuser",
				transformResponse,
				providesTags: ["User"],
			}),
		};
	},
});

export const { useGetCurrentUserQuery } = usersApi;
