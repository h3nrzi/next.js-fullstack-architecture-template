import { useGetCurrentUserQuery } from "../api/auth.api";
import { UserPayload } from "../types/UserPayload";

interface UseCurrentUserReturn {
	userPayload: UserPayload | null;
	loading: boolean;
	error: string | null;
	refetch: () => void;
}

export function useCurrentUser(): UseCurrentUserReturn {
	const { data: userPayload, isLoading, error, refetch } = useGetCurrentUserQuery();

	return {
		userPayload: userPayload || null,
		loading: isLoading,
		error: error ? "Failed to fetch user data" : null,
		refetch,
	};
}
