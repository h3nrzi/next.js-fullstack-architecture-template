"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function LanguageSwitcher() {
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();

	const switchLanguage = (newLocale: string) => {
		router.push(pathname, { locale: newLocale });
	};

	return (
		<div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
			{routing.locales.map((loc) => (
				<button
					key={loc}
					onClick={() => switchLanguage(loc)}
					className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
						locale === loc
							? "bg-white text-gray-900 shadow-sm cursor-pointer"
							: "text-gray-600 hover:text-gray-900 hover:bg-gray-50 cursor-pointer"
					}`}
				>
					{loc === "en" ? "🇬🇧 EN" : "فا 🇮🇷"}
				</button>
			))}
		</div>
	);
}
