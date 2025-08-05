"use client";

import { useAuth } from "@/features/auth/hooks/use-auth.hook";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

function HomePage() {
	const t = useTranslations("HomePage");
	const { userPayload } = useAuth();

	return (
		<div className="p-8 flex flex-col gap-2">
			<h1 className="text-3xl font-bold">{t("welcome")}</h1>
			<p className="text-lg text-gray-600">{t("description")}</p>
			{userPayload && (
				<div className="flex flex-row gap-2 items-center h-screen justify-start">
					<p>{t("adminDashboardDescription")}</p>
					<Link href="/admin/dashboard">
						<button className="bg-red-500 text-white px-2 py-1 rounded-md cursor-pointer hover:bg-red-600 transition-all duration-300">
							{t("adminDashboard")}
						</button>
					</Link>
				</div>
			)}
		</div>
	);
}

export default HomePage;
