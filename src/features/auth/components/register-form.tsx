"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { RegisterInput, registerSchema } from "../schema/auth.schema";
import { useAuth } from "../hooks/useAuth";

export function RegisterForm() {
	const { registerRequest } = useAuth();
	const t = useTranslations("RegisterPage");

	const { register, handleSubmit, formState } = useForm<RegisterInput>({
		resolver: zodResolver(registerSchema),
	});

	return (
		<form
			onSubmit={handleSubmit(
				async (data) => await registerRequest(data.name, data.email, data.password),
			)}
			className="space-y-4 max-w-md mx-auto mt-10"
		>
			<h2 className="text-2xl font-bold text-center">{t("title")}</h2>

			<input
				{...register("name")}
				placeholder={t("namePlaceholder")}
				className="w-full p-2 border rounded"
			/>
			{formState.errors.name && (
				<p className="text-red-500 text-sm">{formState.errors.name.message}</p>
			)}

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
				className="bg-green-600 text-white px-4 py-2 rounded w-full cursor-pointer"
			>
				{formState.isSubmitting ? t("buttonLoading") : t("buttonTXT")}
			</button>
		</form>
	);
}
