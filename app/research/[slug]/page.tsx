import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { researchProjects, site } from "../../site";

export function generateStaticParams() {
  return researchProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = researchProjects.find((item) => item.slug === slug);
  return project
    ? {
        title: `${project.shortTitle} — ${site.name}`,
        description: project.summary,
        alternates: { canonical: `/research/${project.slug}` },
      }
    : { title: `Research — ${site.name}` };
}

export default async function ResearchNote({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = researchProjects.find((item) => item.slug === slug);
  if (!project) notFound();

  return (
    <div className="site-canvas">
      <SiteHeader />

      <main className="shell inner-page-main">
        <div className="detail-nav-bar">
          <Link href="/research" className="back-link">
            ← All research
          </Link>
        </div>

        <article className="project-detail-article">
          <header className="detail-header">
            <div className="detail-meta-pill-row">
              {project.tags.map((tag) => (
                <span key={tag} className="meta-tag">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="detail-title">{project.title}</h1>

            <div className="detail-meta-grid">
              <div className="meta-col">
                <span className="meta-col-label">Institution</span>
                <p className="meta-col-val">{project.institution}</p>
              </div>
              <div className="meta-col">
                <span className="meta-col-label">Timeline</span>
                <p className="meta-col-val">{project.dates}</p>
              </div>
              <div className="meta-col">
                <span className="meta-col-label">Mentorship</span>
                <p className="meta-col-val">{project.advisors}</p>
              </div>
            </div>

            {project.links && project.links.length > 0 && (
              <div className="detail-actions-row">
                {project.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="action-btn action-copy-btn"
                  >
                    {link.label} ↗
                  </a>
                ))}
              </div>
            )}
          </header>

          <section className="detail-narrative">
            <div className="narrative-block">
              <h2>Research Question &amp; Approach</h2>
              <p>{project.summary}</p>
            </div>

            <div className="narrative-block">
              <h2>My Contribution</h2>
              <p>{project.contribution}</p>
            </div>
          </section>

          <footer className="detail-footer">
            <Link href="/research" className="back-link">
              ← Return to all research
            </Link>
            <a href={`mailto:${site.email}`} className="action-link-secondary">
              Discuss this project with Lulu ↗
            </a>
          </footer>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
