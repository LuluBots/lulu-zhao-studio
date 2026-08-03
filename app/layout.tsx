import type { Metadata } from "next";
import { DM_Mono, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Lulu Zhao — Human–AI Interaction Researcher",
  description:
    "Lulu Zhao is a Robotics PhD student at Cornell University exploring embodied intelligence and AI as a material for design.",
  openGraph: {
    title: "Lulu Zhao — Human–AI Interaction Researcher",
    description: "Designing with AI as a material.",
    type: "website",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Lulu Zhao — Designing with AI as a material." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lulu Zhao — Human–AI Interaction Researcher",
    description: "Designing with AI as a material.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${mono.variable}`}>{children}</body>
    </html>
  );
}
