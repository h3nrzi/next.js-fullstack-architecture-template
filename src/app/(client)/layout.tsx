import "@/styles/globals.css";
import { PropsWithChildren } from "react";
import { AppProviders } from "./providers";
import ReactHotToast from "./react-hot-toast";

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<body>
				<main>
					<AppProviders>
						{children}
						<ReactHotToast />
					</AppProviders>
				</main>
			</body>
		</html>
	);
}
