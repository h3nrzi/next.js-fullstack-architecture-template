"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { RegisterInput, registerSchema } from "../schema/auth.schema";
import { useRegisterMutation } from "../services/auth.api";

export function RegisterForm() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [registerUser, { isLoading }] = useRegisterMutation();
	const t = useTranslations("RegisterPage");

	const { register, handleSubmit, formState } = useForm<RegisterInput>({
		resolver: zodResolver(registerSchema),
	});

	const onSubmit = async (data: RegisterInput) => {
		try {
			await registerUser(data).unwrap();
			router.push(searchParams.get("redirect") || "/");
		} catch (err) {
			toast.error((err as any).data.errors[0].message);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto mt-10">
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
				disabled={isLoading}
				className="bg-green-600 text-white px-4 py-2 rounded w-full cursor-pointer"
			>
				{isLoading ? t("buttonLoading") : t("buttonTXT")}
			</button>
		</form>
	);
}
