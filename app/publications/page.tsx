import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { LuluBot } from "../components/LuluBot";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { publications } from "../site";

export const metadata: Metadata = {
  title: "Publications — Lulu Zhao",
  description:
    "Peer-reviewed publications and academic outputs in robot learning, manipulation, and multimodal models by Lulu Zhao.",
  alternates: { canonical: "/publications" },
};

export default function PublicationsPage() {
  return (
    <div className="site-canvas">
      <SiteHeader />

      <main className="shell inner-page-main">
        <header className="page-header-row">
          <div className="page-header-copy">
            <span className="page-category">Publications</span>
            <h1 className="page-heading">Published Papers &amp; Academic Records.</h1>
            <p className="page-lead">
              A record of peer-reviewed articles and research papers. Author lists, venues, and
              links to official publisher versions or PDFs.
            </p>
          </div>
          <div className="page-header-companion" aria-hidden="true">
            <LuluBot size="compact" interactive={false} />
          </div>
        </header>

        <section className="publications-container" aria-label="Publications list">
          <div className="publications-list">
            {publications.map((paper) => (
              <article key={paper.title} className="publication-entry">
                <div className="pub-year-badge">
                  <span>{paper.year}</span>
                </div>

                <div className="pub-content">
                  <h2 className="pub-title">{paper.title}</h2>
                  <p className="pub-authors">
                    {paper.authors.split("Lulu Zhao").map((part, i, arr) => (
                      <React.Fragment key={i}>
                        {part}
                        {i < arr.length - 1 && <strong className="self-author">Lulu Zhao</strong>}
                      </React.Fragment>
                    ))}
                  </p>
                  <p className="pub-venue">
                    <em>{paper.venue}</em>
                    {paper.doi && <span className="pub-doi"> · DOI: {paper.doi}</span>}
                  </p>

                  <div className="pub-links">
                    {paper.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.url}
                        target={link.url.startsWith("http") ? "_blank" : undefined}
                        rel={link.url.startsWith("http") ? "noreferrer" : undefined}
                        className="pub-link-item"
                      >
                        {link.label} {link.url.startsWith("http") ? "↗" : "→"}
                      </a>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="pub-footnote-note">
            <p>
              Looking for earlier research projects and undergraduate work? Explore the{" "}
              <Link href="/research">Research Archive</Link>.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
