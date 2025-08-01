import "@/styles/globals.css";
import { PropsWithChildren } from "react";
import { AppProviders } from "./providers";
import ReactHotToast from "./react-hot-toast";
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<body>
				<AppProviders>
					<nav>
						<Navbar />
					</nav>
					<main>
						{children}
						<ReactHotToast />
					</main>
				</AppProviders>
			</body>
		</html>
	);
}
