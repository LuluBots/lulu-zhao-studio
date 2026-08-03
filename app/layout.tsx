import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://luluzhao.me"),
  title: "Lulu Zhao — Human–AI Interaction Researcher",
  description:
    "Lulu Zhao is a Robotics PhD student at Cornell University exploring embodied intelligence and AI as a material for design.",
  openGraph: {
    title: "Lulu Zhao — Human–AI Interaction Researcher",
    description: "Making intelligence tangible.",
    type: "website",
    url: "https://luluzhao.me",
    images: [{ url: "/og-magic.png", width: 1536, height: 1024, alt: "Lulu Zhao — Human–AI Interaction Researcher" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lulu Zhao — Human–AI Interaction Researcher",
    description: "Making intelligence tangible.",
    images: ["/og-magic.png"],
  },
  alternates: { canonical: "https://luluzhao.me" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={nunito.variable}>{children}</body>
    </html>
  );
}
