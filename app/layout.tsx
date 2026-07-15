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
    "Anshaditya Sharma — CS @ VIT Chennai '27. I build backend systems, applied-AI pipelines, and embedded software: a matching engine benchmarked at 2.1M ops/sec, an evolutionary locomotion sim, a collaborative canvas, an NLP lecture search, a webcam gesture game, and a VLM-controlled rover.",
  openGraph: {
    title: "Anshaditya Sharma — systems + real-time software",
    description:
      "Backend systems, applied AI, and embedded. Six projects, each measured against a real benchmark.",
    type: "website",
  },
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
