import type { Metadata } from "next";
import { cookies } from "next/headers";
import { LanguageProvider } from "@/components/language-provider";
import { LOCALE_COOKIE, normalizeLocale } from "@/lib/i18n";
import "./globals.css";
import "./enhancements.css";

export const metadata: Metadata = {
  title: {
    default: "KHLIM Player Development Lab",
    template: "%s · KHLIM Labs",
  },
  description:
    "An isolated KHLIM Labs experiment in long-term basketball development. Synthetic athletes only.",
  robots: { index: false, follow: false },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = normalizeLocale((await cookies()).get(LOCALE_COOKIE)?.value);
  return (
    <html lang={locale}>
      <body>
        <LanguageProvider initialLocale={locale}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
