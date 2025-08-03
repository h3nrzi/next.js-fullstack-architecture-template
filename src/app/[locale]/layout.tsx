import "@/styles/globals.css";
import { AppProviders } from "./providers";
import ReactHotToast from "./react-hot-toast";
import NavBar from "@/components/nav-bar";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

type Props = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
	// Ensure that the incoming `locale` is valid
	const { locale } = await params;
	if (!routing.locales.includes(locale as any)) {
		notFound();
	}

	// Providing all messages to the client side
	const messages = await getMessages();

	return (
		<html 
			lang={locale}
			dir={locale === 'fa' ? 'rtl' : 'ltr'}
		>
			<body>
				<NextIntlClientProvider messages={messages}>
					<AppProviders>
						<nav>
							<NavBar />
						</nav>
						<main>
							{children}
							<ReactHotToast />
						</main>
					</AppProviders>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
