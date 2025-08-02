"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function Navbar() {
	const { currentUser, isAuthenticated, loading, logoutRequest } = useAuth();

	return (
		<nav className="bg-white shadow-sm border-b">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					{/* *********** LEFT SIDE *********** */}
					<div className="flex items-center">
						<Link href="/" className="text-xl font-bold text-gray-900">
							JobBoard
						</Link>
					</div>
					{/* *********** END OF LEFT SIDE *********** */}

					{/* *********** RIGHT SIDE *********** */}
					<div className="flex items-center space-x-4">
						{loading ? (
							<div className="text-gray-500">Loading...</div>
						) : isAuthenticated && currentUser ? (
							<>
								<Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
									Dashboard
								</Link>
								<button
									onClick={async () => await logoutRequest()}
									className="text-gray-700 hover:text-gray-900 cursor-pointer"
								>
									Logout
								</button>
							</>
						) : (
							<>
								<Link href="/auth/login" className="text-gray-700 hover:text-gray-900">
									Login
								</Link>
								<Link
									href="/auth/register"
									className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
								>
									Sign Up
								</Link>
							</>
						)}
					</div>
					{/* *********** END OF RIGHT SIDE *********** */}
				</div>
			</div>
		</nav>
	);
}
