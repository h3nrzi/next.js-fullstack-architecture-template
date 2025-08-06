import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
	usersApi,
	useLoginMutation,
	useLogoutMutation,
	useRegisterMutation,
} from "../api/users.api";
import { AuthContext } from "../context/auth.context";
import { AuthContextType } from "../types/AuthContextType";
import { RTKQueryErrorResponse } from "../types/RTKQueryErrorResponse";

export const AuthProvider = ({ children }: PropsWithChildren) => {
	const dispatch = useDispatch();
	const router = useRouter();

	const [loginMutation] = useLoginMutation();
	const [registerMutation] = useRegisterMutation();
	const [logoutMutation] = useLogoutMutation();

	const loginRequest = async (email: string, password: string): Promise<void> => {
		try {
			await loginMutation({ email, password }).unwrap();
			// NOTE: RTK Query will automatically refetch getCurrentUser due to invalidatesTags
			toast.success("ورود با موفقیت انجام شد");
			router.push("/");
		} catch (error) {
			toast.error(
				(error as RTKQueryErrorResponse)?.data?.errors?.[0]?.message ||
					"ورود با خطا مواجه شد",
			);
		}
	};

	const registerRequest = async (
		name: string,
		email: string,
		password: string,
	): Promise<void> => {
		try {
			await registerMutation({ name, email, password }).unwrap();
			// NOTE: RTK Query will automatically refetch getCurrentUser due to invalidatesTags
			toast.success("ثبت نام با موفقیت انجام شد");
			router.push("/");
		} catch (error) {
			toast.error(
				(error as RTKQueryErrorResponse)?.data?.errors?.[0]?.message ||
					"ثبت نام با خطا مواجه شد",
			);
		}
	};

	const logoutRequest = async (): Promise<void> => {
		try {
			await logoutMutation().unwrap();
			// Clear RTK Query cache and reset auth state
			dispatch(usersApi.util.resetApiState());
			toast.success("خروج با موفقیت انجام شد");
			router.refresh();
		} catch (error: any) {
			toast.error(
				(error as RTKQueryErrorResponse)?.data?.errors?.[0]?.message ||
					"خروج با خطا مواجه شد",
			);
		}
	};

	const value: AuthContextType = {
		loginRequest,
		logoutRequest,
		registerRequest,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
