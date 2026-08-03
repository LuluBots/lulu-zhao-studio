import type { Metadata } from "next";
import { Caveat, Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-sans",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Lulu Zhao — Human–AI Interaction Researcher",
  description:
    "Lulu Zhao is a Robotics PhD student at Cornell University exploring embodied intelligence and AI as a material for design.",
  openGraph: {
    title: "Lulu Zhao — Human–AI Interaction Researcher",
    description: "Designing with AI as a material.",
    type: "website",
    images: [{ url: "/og-magic.png", width: 1536, height: 1024, alt: "Lulu Zhao — Designing with AI as a material." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lulu Zhao — Human–AI Interaction Researcher",
    description: "Designing with AI as a material.",
    images: ["/og-magic.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} ${caveat.variable}`}>{children}</body>
    </html>
  );
}
