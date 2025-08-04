"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "next-intl";

export default function NavBar() {
	const { currentUser, isAuthenticated, loading, logoutRequest } = useAuth();
	const t = useTranslations("NavBar");
	const pathname = usePathname();

	return (
		<nav className="bg-white shadow-sm border-b">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					{/* *********** LOGO *********** */}
					<div className="flex items-center">
						<Link href="/" className="text-xl font-bold text-gray-900">
							{t("title")}
						</Link>
					</div>
					{/* *********** END OF LOGO *********** */}

					{/* *********** NAVIGATION *********** */}
					<div className="flex items-center space-x-4">
						<LanguageSwitcher />
						{loading ? (
							<div className="text-gray-500">{t("loading")}</div>
						) : isAuthenticated && currentUser ? (
							<>
								<Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
									{t("dashboard")}
								</Link>
								<button
									onClick={async () => await logoutRequest()}
									className="text-gray-700 hover:text-gray-900 cursor-pointer"
								>
									{t("logout")}
								</button>
							</>
						) : (
							<>
								<Link href="/auth/login" className="text-gray-700 hover:text-gray-900">
									{t("login")}
								</Link>
								<Link
									href="/auth/register"
									className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
								>
									{t("register")}
								</Link>
							</>
						)}
					</div>
					{/* *********** END OF NAVIGATION *********** */}
				</div>
			</div>
		</nav>
	);
}
