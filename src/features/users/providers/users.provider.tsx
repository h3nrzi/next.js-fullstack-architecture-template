import { useGetCurrentUserQuery } from "../api/users.api";
import { UsersContext } from "../context/users.context";
import { RTKQueryErrorResponse } from "../types/RTKQueryErrorResponse";
import { UsersContextType } from "../types/UsersContextType";

export function UsersProvider({ children }: { children: React.ReactNode }) {
	const {
		data: userPayload,
		isLoading,
		error: currentUserError,
		refetch: refetchCurrentUser,
	} = useGetCurrentUserQuery();

	const value: UsersContextType = {
		userPayload: userPayload || null,
		loading: isLoading,
		error:
			(currentUserError as RTKQueryErrorResponse)?.data?.errors?.[0]?.message || null,
		isAuthenticated: !!userPayload,
		refetchCurrentUser,
	};

	return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
}
