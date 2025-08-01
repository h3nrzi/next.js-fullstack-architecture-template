"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { LoginInput, loginSchema } from "../schema/auth.schema";
import { useLoginMutation } from "../services/auth.api";

export default function LoginForm() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [login, { isLoading }] = useLoginMutation();

	const { register, handleSubmit, formState } = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginInput) => {
		try {
			await login(data).unwrap();
			router.push(searchParams.get("redirect") || "/");
		} catch (err) {
			toast.error((err as any).data.error);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto mt-10">
			<h2 className="text-2xl font-bold text-center">Login</h2>

			<input
				{...register("email")}
				placeholder="Email"
				className="w-full p-2 border rounded"
			/>
			{formState.errors.email && (
				<p className="text-red-500 text-sm">{formState.errors.email.message}</p>
			)}

			<input
				{...register("password")}
				type="password"
				placeholder="Password"
				className="w-full p-2 border rounded"
			/>
			{formState.errors.password && (
				<p className="text-red-500 text-sm">{formState.errors.password.message}</p>
			)}

			<button
				type="submit"
				disabled={isLoading}
				className="bg-blue-600 text-white px-4 py-2 rounded w-full cursor-pointer"
			>
				{isLoading ? "Logging in..." : "Login"}
			</button>
		</form>
	);
}
