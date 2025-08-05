"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "../schema/auth.schema";
import { LoginInput } from "../types/LoginInput";
import { useTranslations } from "next-intl";
import { useAuth } from "../hooks/use-auth.hook";

export default function LoginForm() {
	const t = useTranslations("LoginPage");
	const { loginRequest } = useAuth();

	const { register, handleSubmit, formState } = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
	});

	return (
		<form
			onSubmit={handleSubmit(async (data) => {
				await loginRequest(data.email, data.password);
			})}
			className="space-y-4 max-w-md mx-auto mt-10"
		>
			<h2 className="text-2xl font-bold text-center">{t("title")}</h2>

			<input
				{...register("email")}
				placeholder={t("emailPlaceholder")}
				className="w-full p-2 border rounded"
			/>
			{formState.errors.email && (
				<p className="text-red-500 text-sm">{formState.errors.email.message}</p>
			)}

			<input
				{...register("password")}
				type="password"
				placeholder={t("passwordPlaceholder")}
				className="w-full p-2 border rounded"
			/>
			{formState.errors.password && (
				<p className="text-red-500 text-sm">{formState.errors.password.message}</p>
			)}

			<button
				type="submit"
				disabled={formState.isSubmitting}
				className="bg-blue-600 text-white px-4 py-2 rounded w-full cursor-pointer"
			>
				{formState.isSubmitting ? t("buttonLoading") : t("buttonTXT")}
			</button>
		</form>
	);
}
