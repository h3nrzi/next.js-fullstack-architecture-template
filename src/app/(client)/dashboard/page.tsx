"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";

const DashboardPage = () => {
	const { currentUser, loading, error, logoutRequest, refetchCurrentUser } = useAuth();

	if (!currentUser) return;

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-lg">Loading...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-red-500">Error: {error}</div>
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
							<h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
							{/* *********** END OF TITLE *********** */}

							{/* *********** CONTENT *********** */}
							<div className="space-y-6">
								{/* *********** FIRST ROW *********** */}
								<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
									<h2 className="text-xl font-semibold text-blue-900 mb-2">
										Welcome back, {currentUser.name}!
									</h2>
									<p className="text-blue-700">
										You&apos;re successfully logged in to your account.
									</p>
								</div>
								{/* *********** END OF FIRST ROW *********** */}

								{/* *********** SECOND ROW *********** */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="bg-white border border-gray-200 rounded-lg p-4">
										<h3 className="text-lg font-medium text-gray-900 mb-3">
											Profile Information
										</h3>
										<div className="space-y-2">
											<div>
												<span className="text-sm font-medium text-gray-500">Name:</span>
												<p className="text-sm text-gray-900">{currentUser.name}</p>
											</div>
											<div>
												<span className="text-sm font-medium text-gray-500">Email:</span>
												<p className="text-sm text-gray-900">{currentUser.email}</p>
											</div>
											<div>
												<span className="text-sm font-medium text-gray-500">
													User ID:
												</span>
												<p className="text-sm text-gray-900">{currentUser.id}</p>
											</div>
										</div>
									</div>

									<div className="bg-white border border-gray-200 rounded-lg p-4">
										<h3 className="text-lg font-medium text-gray-900 mb-3">
											Quick Actions
										</h3>
										<div className="space-y-3">
											<button
												onClick={async () => {
													await logoutRequest();
													refetchCurrentUser();
												}}
												className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
											>
												Logout
											</button>
											<button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">
												View Profile
											</button>
											<button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200">
												Browse Jobs
											</button>
										</div>
									</div>
								</div>
								{/* *********** END OF SECOND ROW *********** */}

								{/* *********** THIRD ROW *********** */}
								<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
									<h3 className="text-lg font-medium text-yellow-900 mb-2">
										Getting Started
									</h3>
									<p className="text-yellow-700 text-sm">
										This is your personal dashboard. From here, you can manage your
										profile, browse job listings, and track your applications.
									</p>
								</div>
								{/* *********** END OF THIRD ROW *********** */}
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
