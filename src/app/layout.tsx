import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "KHLIM Player Development Lab",
    template: "%s · KHLIM Labs",
  },
  description:
    "An isolated KHLIM Labs experiment in long-term basketball development. Synthetic athletes only.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
