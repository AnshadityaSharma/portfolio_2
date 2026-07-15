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
    "CS @ VIT Chennai '27. Six projects, each measured against a real benchmark: a matching engine, an evolving-creatures sim, a collaborative canvas, an NLP lecture search, a webcam gesture game, and a VLM-controlled rover.",
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
