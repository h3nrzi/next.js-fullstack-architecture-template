import { useGetCurrentUserQuery } from "../services/auth.api";
import type { User } from "../types";

interface UseCurrentUserReturn {
	user: User | null;
	loading: boolean;
	error: string | null;
	refetch: () => void;
}

export function useCurrentUser(): UseCurrentUserReturn {
	const { data: user, isLoading, error, refetch } = useGetCurrentUserQuery();

	return {
		user: user || null,
		loading: isLoading,
		error: error ? "Failed to fetch user data" : null,
		refetch,
	};
}
