import type { MetadataRoute } from "next";
import { publication, researchProjects } from "./site";

const baseUrl = "https://luluzhao.me";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", priority: 1, changeFrequency: "monthly" as const },
    { path: "/research", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/publications", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.8, changeFrequency: "yearly" as const },
    { path: "/blog", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/photography", priority: 0.6, changeFrequency: "yearly" as const },
    {
      path: "/blog/a-place-for-unfinished-questions",
      priority: 0.7,
      changeFrequency: "yearly" as const,
    },
    {
      path: `/research/${publication.slug}`,
      priority: 0.8,
      changeFrequency: "yearly" as const,
    },
    ...researchProjects.map((project) => ({
      path: `/research/${project.slug}`,
      priority: 0.7,
      changeFrequency: "yearly" as const,
    })),
  ];

  return pages.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date("2026-08-03"),
    changeFrequency,
    priority,
  }));
}
