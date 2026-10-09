import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { StructuredData } from "./components/StructuredData";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://v0.luluzhao.me"),
  title: "Lulu Zhao — Human–AI Interaction Researcher",
  description:
    "Lulu Zhao is a Robotics PhD student at Cornell University exploring embodied intelligence and AI as a material for design.",
  openGraph: {
    title: "Lulu Zhao — Human–AI Interaction Researcher",
    description: "Making intelligence tangible.",
    type: "website",
    url: "https://v0.luluzhao.me",
    images: [{ url: "/og-magic.png", width: 1536, height: 1024, alt: "Lulu Zhao — Human–AI Interaction Researcher" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lulu Zhao — Human–AI Interaction Researcher",
    description: "Making intelligence tangible.",
    images: ["/og-magic.png"],
  },
  alternates: { canonical: "/" },
};

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://v0.luluzhao.me/#person",
    name: "Lulu Zhao",
    alternateName: "赵璐璐",
    url: "https://v0.luluzhao.me",
    image: "https://v0.luluzhao.me/photos/lulu-portrait.jpg",
    jobTitle: "Human–AI Interaction Researcher",
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: "Cornell University",
      url: "https://www.cornell.edu/",
    },
    sameAs: [
      "https://github.com/LuluBots",
      "https://www.linkedin.com/in/lulubotszhao/",
      "https://scholar.google.com/citations?user=9eMU41cAAAAJ&hl=en",
    ],
    knowsAbout: [
      "Human–AI interaction",
      "Embodied intelligence",
      "Robot learning",
      "Interaction design",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://v0.luluzhao.me/#website",
    url: "https://v0.luluzhao.me",
    name: "Lulu Zhao",
    description:
      "Research and writing on human–AI interaction, embodied intelligence, and robot learning.",
    author: { "@id": "https://v0.luluzhao.me/#person" },
    inLanguage: "en",
  },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={nunito.variable}>
        <StructuredData data={structuredData} />
        {children}
      </body>
    </html>
  );
}
