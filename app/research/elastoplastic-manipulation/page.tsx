import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { StructuredData } from "../../components/StructuredData";
import { publication, site } from "../../site";

export const metadata: Metadata = {
  title: `${publication.shortTitle} — ${site.name}`,
  description:
    "A learning-based predictive control framework for manipulating elasto-plastic objects with a 3D occupancy state representation.",
  alternates: { canonical: `/research/${publication.slug}` },
};

const articleStructuredData = {
  "@context": "https://schema.org",
  "@type": "ScholarlyArticle",
  headline: publication.title,
  name: publication.title,
  url: `https://luluzhao.me/research/${publication.slug}`,
  datePublished: "2025",
  identifier: `https://doi.org/${publication.doi}`,
  sameAs: `https://doi.org/${publication.doi}`,
  author: publication.authors.split(", ").map((name) => ({
    "@type": "Person",
    name: name.replace(/^and /, ""),
  })),
  contributor: { "@id": "https://luluzhao.me/#person" },
  publisher: {
    "@type": "Organization",
    name: "IEEE",
  },
  about: [
    "Robot learning",
    "Deformable object manipulation",
    "Predictive control",
    "3D occupancy",
  ],
};

export default function ElastoPlasticProjectPage() {
  return (
    <div className="site-canvas">
      <SiteHeader />
      <StructuredData data={articleStructuredData} />

      <main className="shell inner-page-main">
        {/* Project Breadcrumb / Back Link */}
        <div className="detail-nav-bar">
          <Link href="/research" className="back-link">
            ← All research
          </Link>
        </div>

        <article className="project-detail-article">
          <header className="detail-header">
            <div className="detail-meta-pill-row">
              <span className="meta-tag">Robot learning · Deformable manipulation</span>
              <span className="meta-badge">{publication.conference}</span>
            </div>

            <h1 className="detail-title">{publication.title}</h1>

            <div className="detail-meta-grid">
              <div className="meta-col">
                <span className="meta-col-label">Institution</span>
                <p className="meta-col-val">The Chinese University of Hong Kong</p>
              </div>
              <div className="meta-col">
                <span className="meta-col-label">Timeline</span>
                <p className="meta-col-val">{publication.date}</p>
              </div>
              <div className="meta-col">
                <span className="meta-col-label">Publication</span>
                <p className="meta-col-val">{publication.venue}</p>
              </div>
              <div className="meta-col">
                <span className="meta-col-label">Advisors</span>
                <p className="meta-col-val">
                  Prof. K. W. Samuel Au &amp; Prof. Xiangyu Chu
                </p>
              </div>
            </div>

            {/* Quick resource links */}
            <div className="detail-actions-row">
              <a
                href={publication.paperUrl}
                target="_blank"
                rel="noreferrer"
                className="action-btn action-email-primary"
              >
                IEEE Paper (PDF) ↗
              </a>
              <a
                href={`https://doi.org/${publication.doi}`}
                target="_blank"
                rel="noreferrer"
                className="action-btn action-copy-btn"
              >
                DOI: {publication.doi} ↗
              </a>
            </div>
          </header>

          {/* Demonstration Video (User clicks to play, no autoplay, poster provided) */}
          <section className="detail-media-section" aria-label="Experiment demonstration video">
            <div className="video-player-container">
              <video
                controls
                playsInline
                preload="metadata"
                poster={publication.videoPoster}
                className="detail-video-element"
              >
                <source src={publication.videoUrl} type="video/mp4" />
                Your browser does not support embedded video.
              </video>
            </div>
            <p className="media-caption">
              Robot manipulating elasto-plastic materials using 3D occupancy prediction and model predictive control.
            </p>
          </section>

          {/* Narrative sections following spec */}
          <section className="detail-narrative">
            <div className="narrative-block">
              <h2>Research Question</h2>
              <p>
                How can robots perceive, model, and manipulate elasto-plastic objects (like clay) that
                undergo complex, history-dependent plastic deformation and heavy self-occlusion?
                Traditional point-cloud or mesh tracking methods struggle when objects change shape
                irreversibly and conceal internal or rear contours.
              </p>
            </div>

            <div className="narrative-block">
              <h2>What We Built</h2>
              <p>
                We introduced a learning-based predictive control framework leveraging a volumetric
                3D occupancy state representation. By inferring a complete 3D occupancy grid from
                multi-view RGB cameras, our model represents both visible surfaces and occluded volume.
                Coupled with a deformation prediction model and shape-aware action initialization,
                the robot plans manipulation actions efficiently toward target shapes.
              </p>
            </div>

            <div className="narrative-block">
              <h2>My Contribution</h2>
              <p>
                Contributed to the formulation of the learning-based model predictive control framework,
                experimental validation on the physical robot platform, and analysis of multi-view
                representation accuracy during deformation tasks.
              </p>
            </div>

            <div className="narrative-block">
              <h2>Collaborators &amp; Credits</h2>
              <p className="credits-text">
                <strong>Authors:</strong> {publication.authors}
                <br />
                <strong>Published in:</strong> {publication.venue} ({publication.citation}).
              </p>
            </div>
          </section>

          <footer className="detail-footer">
            <Link href="/research" className="back-link">
              ← Return to all research
            </Link>
            <a href={`mailto:${site.email}`} className="action-link-secondary">
              Discuss this work with Lulu ↗
            </a>
          </footer>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
