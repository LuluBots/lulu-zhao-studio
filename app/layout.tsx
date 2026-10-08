import type { Metadata, Viewport } from "next";
import { MotionProvider } from "./components/MotionContext";
import { StructuredData } from "./components/StructuredData";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#FFFEFB",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://luluzhao.me"),
  title: "Lulu Zhao — Human–AI Interaction & Design",
  description:
    "Lulu Zhao is a PhD student in Computer Science at Cornell University, interested in human–AI interaction and design.",
  openGraph: {
    title: "Lulu Zhao — Human–AI Interaction & Design",
    description: "CS PhD student at Cornell University. Human–AI interaction and design.",
    type: "website",
    url: "https://luluzhao.me",
    images: [{ url: "/og-magic.png", width: 1536, height: 1024, alt: "Lulu Zhao" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lulu Zhao — Human–AI Interaction & Design",
    description: "CS PhD student at Cornell University. Human–AI interaction and design.",
    images: ["/og-magic.png"],
  },
  alternates: { canonical: "/" },
};

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://luluzhao.me/#person",
    name: "Lulu Zhao",
    alternateName: "赵璐璐",
    url: "https://luluzhao.me",
    image: "https://luluzhao.me/photos/lulu-portrait.jpg",
    jobTitle: "PhD Student in Computer Science",
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
      "Design",
      "Embodied intelligence",
      "Robot learning",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://luluzhao.me/#website",
    url: "https://luluzhao.me",
    name: "Lulu Zhao",
    description:
      "Research, publications, and writing on human–AI interaction, design, and embodied intelligence.",
    author: { "@id": "https://luluzhao.me/#person" },
    inLanguage: "en",
  },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <StructuredData data={structuredData} />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
