import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

function HomePage() {
	const t = useTranslations("HomePage");

	return (
		<div className="p-8 flex flex-col gap-2">
			<h1 className="text-3xl font-bold">{t("welcome")}</h1>
			<p className="text-lg text-gray-600">{t("description")}</p>
			<Link href="/dashboard">
				<button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer">
					{t("dashboard")}
				</button>
			</Link>
		</div>
	);
}

export default HomePage;
