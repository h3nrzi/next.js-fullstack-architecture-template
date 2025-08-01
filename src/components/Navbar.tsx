import Link from "next/link";

export default function Navbar() {
	return (
		<nav className="bg-white shadow-sm border-b">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex items-center">
						<Link href="/" className="text-xl font-bold text-gray-900">
							JobBoard
						</Link>
					</div>

					<div className="flex items-center space-x-4">
						<Link href="/auth/login" className="text-gray-700 hover:text-gray-900">
							Login
						</Link>
						<Link
							href="/auth/register"
							className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
						>
							Sign Up
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
}
