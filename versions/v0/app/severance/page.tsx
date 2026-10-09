import type { Metadata } from "next";
import { SeveranceRuntime } from "./severance-runtime";

export const metadata: Metadata = {
  title: "What Crosses? — Lulu Zhao",
  description:
    "Interactive speculative machines about memory, feeling, identity, and divided lives.",
  alternates: { canonical: "/severance" },
  openGraph: {
    title: "What Crosses?",
    description: "Provisions for a Divided Life.",
    url: "https://luluzhao.me/severance",
  },
};

export default function SeverancePage() {
  return <SeveranceRuntime />;
}
