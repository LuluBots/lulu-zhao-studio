import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { publication, researchProjects } from "../site";

export const metadata: Metadata = {
  title: "Research — Lulu Zhao",
  description: "Selected robotics, human–AI interaction, robot learning, and embodied intelligence research by Lulu Zhao.",
  alternates: { canonical: "/research" },
};

export default function ResearchPage() {
  return (
    <main>
      <SiteHeader />
      <header className="subpage-hero shell">
        <p className="eyebrow">Research</p>
        <h1>Questions explored<br />through making.</h1>
        <p>My current focus is human–AI interaction and design for embodied intelligence. These projects trace the technical work that shaped that direction.</p>
      </header>
      <section className="work-section research-archive">
        <div className="shell">
          <article className="featured-research">
            <Link className="project-visual coral" href={`/research/${publication.slug}`}>
              <span className="visual-label">soft things,<br />smart robots</span>
              <div className="occupancy-grid" aria-hidden="true">{Array.from({ length: 24 }).map((_, i) => <i key={i} />)}</div>
              <div className="shape-two" />
            </Link>
            <div className="featured-research-copy">
              <div className="research-card-top"><span>01</span><p>{publication.date}</p></div>
              <p className="project-type">Robot learning · Deformable objects</p>
              <h2>{publication.shortTitle}</h2>
              <p>A learning-based predictive control framework using a novel 3D occupancy representation.</p>
              <div className="research-card-footer"><small>IEEE RA-L 2025 · ICRA 2026 Transfer</small><Link href={`/research/${publication.slug}`}>Open note →</Link></div>
            </div>
          </article>

          <div className="archive-heading">
            <p className="eyebrow">Research archive</p>
            <p>Other technical paths, experiments, and prototypes.</p>
          </div>
          <div className="research-grid">
            {researchProjects.map((project, index) => {
              const number = index < 3 ? index + 2 : index + 3;
              return (
              <article className={`research-card card-${number}`} key={project.slug}>
                <div className="research-card-top"><span>0{number}</span><p>{project.dates}</p></div>
                <p className="project-type">{project.tags.slice(0, 2).join(" · ")}</p>
                <h3>{project.shortTitle}</h3><p>{project.summary}</p>
                <div className="research-card-footer"><small>{project.institution}</small><Link href={`/research/${project.slug}`}>Open note →</Link></div>
              </article>
            )})}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
