"use client";

import { useAuth } from "@/features/auth/hooks/use-auth.hook";
import { useTranslations } from "next-intl";

const DashboardPage = () => {
	const { userPayload, loading, error } = useAuth();
	const t = useTranslations("DashboardPage");

	if (!userPayload) return;

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-lg">{t("loading")}</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-red-500">
					{t("error")} {error}
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<div className="bg-white overflow-hidden shadow rounded-lg">
						<div className="px-4 py-5 sm:p-6">
							{/* *********** TITLE *********** */}
							<h1 className="text-3xl font-bold text-gray-900 mb-6">{t("title")}</h1>
							{/* *********** END OF TITLE *********** */}

							{/* *********** CONTENT *********** */}
							<div className="space-y-6">
								{/* *********** FIRST ROW *********** */}
								<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
									<h2 className="text-xl font-semibold text-blue-900 mb-2">
										{t("welcomeBack", { name: userPayload.user.name })}
									</h2>
									<p className="text-blue-700">{t("successMessage")}</p>
								</div>
								{/* *********** END OF FIRST ROW *********** */}

								{/* *********** SECOND ROW *********** */}
								<div className="bg-white border border-gray-200 rounded-lg p-4">
									<h3 className="text-lg font-medium text-gray-900 mb-3">
										{t("profileInfo")}
									</h3>
									<div className="space-y-2">
										<div>
											<span className="text-sm font-medium text-gray-500">
												{t("name")}
											</span>
											<p className="text-sm text-gray-900">{userPayload.user.name}</p>
										</div>
										<div>
											<span className="text-sm font-medium text-gray-500">
												{t("email")}
											</span>
											<p className="text-sm text-gray-900">{userPayload.user.email}</p>
										</div>
										<div>
											<span className="text-sm font-medium text-gray-500">
												{t("userId")}
											</span>
											<p className="text-sm text-gray-900">{userPayload.user.id}</p>
										</div>
									</div>
								</div>
								{/* *********** END OF SECOND ROW *********** */}
							</div>
							{/* *********** END OF CONTENT *********** */}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DashboardPage;
