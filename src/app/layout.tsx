import "@/styles/globals.css";
import { PropsWithChildren } from "react";
import { AppProviders } from "./providers";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <main>
          <AppProviders>{children}</AppProviders>
        </main>
      </body>
    </html>
  );
}
