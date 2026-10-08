"use client";

import Link from "next/link";
import React from "react";
import { LuluBot } from "./components/LuluBot";
import { useMotion } from "./components/MotionContext";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { publication, researchProjects, site } from "./site";

export default function Home() {
  const { triggerAction } = useMotion();

  // Selected works as specified: AnchorIT, Elasto-plastic manipulation, Foam Hand
  const featuredWorks = [
    {
      id: "elastoplastic",
      title: publication.title,
      shortTitle: publication.shortTitle,
      year: "2024–2025",
      badge: "IEEE RA-L 2025 · ICRA 2026",
      summary:
        "A 3D occupancy-based predictive control framework enabling robots to shape complex deformable objects.",
      link: `/research/${publication.slug}`,
      externalPaper: publication.paperUrl,
      institution: "CUHK",
    },
    {
      id: "anchorit",
      title: researchProjects[0].title,
      shortTitle: researchProjects[0].shortTitle,
      year: "2025",
      badge: "Beijing Normal Univ.",
      summary:
        "A training-free framework for composed image retrieval combining diffusion priors with LLM reasoning.",
      link: `/research/${researchProjects[0].slug}`,
      institution: "BNU",
    },
    {
      id: "foam-hand",
      title: researchProjects[1].title,
      shortTitle: researchProjects[1].shortTitle,
      year: "2024",
      badge: "Carnegie Mellon Univ.",
      summary:
        "Generalized dexterous manipulation for a 23-DoF anthropomorphic soft hand using diffusion policies.",
      link: `/research/${researchProjects[1].slug}`,
      institution: "CMU",
    },
  ];

  return (
    <div className="site-canvas">
      <SiteHeader />

      <main id="main-content" className="shell home-main">
        {/* Hero Section */}
        <section className="hero-section" aria-labelledby="hero-greeting">
          <div className="hero-content">
            <div className="hero-text">
              <h1 id="hero-greeting" className="hero-title">
                Hi, I’m Lulu.
              </h1>
              <p className="hero-role">{site.role}</p>
              <p className="hero-statement">{site.researchSummary}</p>

              <div className="hero-primary-actions">
                <Link href="/research" className="btn btn-primary">
                  Research →
                </Link>
                <Link href="/publications" className="btn btn-secondary">
                  Publications
                </Link>
              </div>

              <div className="hero-secondary-links" aria-label="Quick contacts">
                <a href={`mailto:${site.email}`}>Email</a>
                <span className="dot-divider" aria-hidden="true">
                  ·
                </span>
                <a href={site.scholar} target="_blank" rel="noreferrer">
                  Scholar
                </a>
                <span className="dot-divider" aria-hidden="true">
                  ·
                </span>
                <a href={site.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </div>
            </div>

            {/* LuluBot Companion Hero Scene */}
            <div
              className="hero-character-scene"
              aria-label="Hand-drawn research robot companion LuluBot"
            >
              <div className="bot-stage">
                <LuluBot size="hero" />
                <p className="bot-caption" aria-hidden="true">
                  <span>research partner</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Selected Work */}
        <section className="home-section" id="selected-work" aria-labelledby="section-selected-title">
          <div className="section-header">
            <h2 id="section-selected-title" className="section-title">
              Selected Work
            </h2>
            <Link href="/research" className="section-more-link">
              All research →
            </Link>
          </div>

          <div className="work-cards-list">
            {featuredWorks.map((work) => (
              <article
                key={work.id}
                className="work-card"
                onMouseEnter={() => triggerAction("present")}
                onMouseLeave={() => triggerAction("rest")}
                onFocus={() => triggerAction("present")}
                onBlur={() => triggerAction("rest")}
              >
                <div className="work-card-header">
                  <div className="work-meta">
                    <span className="work-year">{work.year}</span>
                    <span className="work-badge">{work.badge}</span>
                  </div>
                </div>

                <h3 className="work-title">
                  <Link href={work.link}>{work.title}</Link>
                </h3>

                <p className="work-summary">{work.summary}</p>

                <div className="work-links">
                  <Link href={work.link} className="work-link-primary">
                    Project details →
                  </Link>
                  {work.externalPaper && (
                    <a
                      href={work.externalPaper}
                      target="_blank"
                      rel="noreferrer"
                      className="work-link-secondary"
                    >
                      Paper (PDF) ↗
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Latest Writing / Notes */}
        <section className="home-section" aria-labelledby="section-notes-title">
          <div className="section-header">
            <h2 id="section-notes-title" className="section-title">
              Notes
            </h2>
            <Link href="/blog" className="section-more-link">
              All notes →
            </Link>
          </div>

          <article className="note-card">
            <div className="note-meta">
              <span className="note-year">2026</span>
              <span className="note-badge">Field note</span>
            </div>
            <h3 className="note-title">
              <Link href="/blog/a-place-for-unfinished-questions">
                A place for unfinished questions
              </Link>
            </h3>
            <p className="note-summary">
              Why this notebook sits between research, design, and the small observations that make
              both feel alive.
            </p>
            <Link href="/blog/a-place-for-unfinished-questions" className="note-read-link">
              Read note →
            </Link>
          </article>
        </section>

        {/* Things I Notice / Photography preview */}
        <section className="home-section" aria-labelledby="section-photos-title">
          <div className="section-header">
            <h2 id="section-photos-title" className="section-title">
              Things I notice
            </h2>
            <Link href="/photography" className="section-more-link">
              All photos →
            </Link>
          </div>

          <div className="home-photos-grid">
            <figure className="home-photo-item">
              <div className="home-photo-frame">
                <img
                  src="/photos/puerto-rico-04.jpg"
                  alt="Old San Juan and fortifications beside the Atlantic Ocean"
                  loading="lazy"
                />
              </div>
              <figcaption>Old San Juan / Atlantic</figcaption>
            </figure>
            <figure className="home-photo-item">
              <div className="home-photo-frame">
                <img
                  src="/photos/puerto-rico-01.jpg"
                  alt="Stone sentry box above the sea"
                  loading="lazy"
                />
              </div>
              <figcaption>El Morro sentry box</figcaption>
            </figure>
            <figure className="home-photo-item">
              <div className="home-photo-frame">
                <img
                  src="/photos/puerto-rico-06.jpg"
                  alt="Flowering branches above colorful buildings"
                  loading="lazy"
                />
              </div>
              <figcaption>Color and light</figcaption>
            </figure>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
