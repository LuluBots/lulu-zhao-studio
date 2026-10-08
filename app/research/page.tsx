import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { LuluBot } from "../components/LuluBot";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { publication, researchProjects } from "../site";

export const metadata: Metadata = {
  title: "Research — Lulu Zhao",
  description:
    "Research in human–AI interaction, design, and embodied intelligence by Lulu Zhao at Cornell University.",
  alternates: { canonical: "/research" },
};

export default function ResearchPage() {
  const selectedWorks = [
    {
      id: "elastoplastic",
      title: publication.title,
      dates: publication.date,
      venue: "IEEE RA-L 2025 · ICRA 2026 Transfer",
      institution: "CUHK",
      summary:
        "A 3D occupancy-based predictive control framework enabling robots to shape and manipulate elasto-plastic materials such as clay.",
      link: `/research/${publication.slug}`,
      paperUrl: publication.paperUrl,
      tags: ["Robot learning", "Deformable objects", "Predictive control"],
    },
    {
      id: "anchorit",
      title: researchProjects[0].title,
      dates: researchProjects[0].dates,
      venue: "Beijing Normal University",
      institution: "BNU",
      summary: researchProjects[0].summary,
      link: `/research/${researchProjects[0].slug}`,
      tags: researchProjects[0].tags,
    },
    {
      id: "foam-hand",
      title: researchProjects[1].title,
      dates: researchProjects[1].dates,
      venue: "Carnegie Mellon University",
      institution: "CMU",
      summary: researchProjects[1].summary,
      link: `/research/${researchProjects[1].slug}`,
      tags: researchProjects[1].tags,
    },
  ];

  const earlierWork = researchProjects[2]; // anxiety-detection-robot

  return (
    <div className="site-canvas">
      <SiteHeader />

      <main className="shell inner-page-main">
        {/* Research Page Header with compact companion */}
        <header className="page-header-row">
          <div className="page-header-copy">
            <span className="page-category">Research</span>
            <h1 className="page-heading">Questions explored through making.</h1>
            <p className="page-lead">
              My current research centers on human–AI interaction and design. My background in
              robotics and embodied intelligence serves as a foundation for asking how intelligent
              systems can feel legible, tangible, and expressive in everyday life.
            </p>
          </div>
          <div className="page-header-companion" aria-hidden="true">
            <LuluBot size="compact" />
          </div>
        </header>

        {/* Selected Work */}
        <section className="research-section" aria-labelledby="selected-research-title">
          <div className="section-label-bar">
            <h2 id="selected-research-title" className="section-subheading">
              Selected Work
            </h2>
          </div>

          <div className="research-cards-grid">
            {selectedWorks.map((item, idx) => (
              <article key={item.id} className="research-item-card">
                <div className="research-item-meta">
                  <span className="research-index">0{idx + 1}</span>
                  <span className="research-dates">{item.dates}</span>
                  <span className="research-institution">{item.institution}</span>
                </div>

                <h3 className="research-item-title">
                  <Link href={item.link}>{item.title}</Link>
                </h3>

                <p className="research-item-summary">{item.summary}</p>

                <div className="research-item-tags">
                  {item.tags.map((tag) => (
                    <span key={tag} className="tag-pill">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="research-item-actions">
                  <Link href={item.link} className="action-link-primary">
                    View project note →
                  </Link>
                  {item.paperUrl && (
                    <a
                      href={item.paperUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="action-link-secondary"
                    >
                      IEEE Paper ↗
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Earlier Work / Foundations */}
        {earlierWork && (
          <section className="research-section" aria-labelledby="earlier-research-title">
            <div className="section-label-bar">
              <h2 id="earlier-research-title" className="section-subheading">
                Earlier Foundations
              </h2>
            </div>

            <div className="research-cards-grid">
              <article className="research-item-card">
                <div className="research-item-meta">
                  <span className="research-index">04</span>
                  <span className="research-dates">{earlierWork.dates}</span>
                  <span className="research-institution">{earlierWork.institution}</span>
                </div>

                <h3 className="research-item-title">
                  <Link href={`/research/${earlierWork.slug}`}>{earlierWork.title}</Link>
                </h3>

                <p className="research-item-summary">{earlierWork.summary}</p>

                <div className="research-item-tags">
                  {earlierWork.tags.map((tag) => (
                    <span key={tag} className="tag-pill">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="research-item-actions">
                  <Link
                    href={`/research/${earlierWork.slug}`}
                    className="action-link-primary"
                  >
                    View project note →
                  </Link>
                </div>
              </article>
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
