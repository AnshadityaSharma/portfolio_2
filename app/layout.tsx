import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";

const instrument = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://ansh-portfolio.vercel.app",
  ),
  title: "Anshaditya Sharma — systems + real-time software",
  description:
    "Six projects, every one of them running live on the page. A matching engine, an evolving-creatures sim, a collaborative canvas, an NLP search tool, a webcam gesture game, and a vision-model rover.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={instrument.variable}>
      <body>{children}</body>
    </html>
  );
}
