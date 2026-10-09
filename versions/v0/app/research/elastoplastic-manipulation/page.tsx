import type { Metadata } from "next";
import Link from "next/link";
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
  url: `https://v0.luluzhao.me/research/${publication.slug}`,
  datePublished: "2025",
  identifier: `https://doi.org/${publication.doi}`,
  sameAs: `https://doi.org/${publication.doi}`,
  author: publication.authors.split(", ").map((name) => ({
    "@type": "Person",
    name: name.replace(/^and /, ""),
  })),
  contributor: { "@id": "https://v0.luluzhao.me/#person" },
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

export default function ResearchProject() {
  return (
    <main className="case-study">
      <StructuredData data={articleStructuredData} />
      <header className="site-header shell">
        <Link className="wordmark" href="/">Lulu Zhao<span>.</span></Link>
        <nav aria-label="Project navigation">
          <Link href="/#research">All research</Link>
          <a className="nav-contact" href={publication.paperUrl} target="_blank" rel="noreferrer">Read paper</a>
        </nav>
      </header>

      <article>
        <header className="case-hero shell">
          <div className="case-labels">
            <p className="eyebrow">Robot learning · Deformable object manipulation</p>
            <p className="transfer-badge">✦ {publication.conference}</p>
          </div>
          <h1>{publication.title}</h1>
          <div className="case-meta">
            <div><span>Role</span><p>Researcher</p></div>
            <div><span>Institution</span><p>The Chinese University of Hong Kong</p></div>
            <div><span>Period</span><p>{publication.date}</p></div>
            <div><span>Advisors</span><p>Prof. K. W. Samuel Au<br />Prof. Xiangyu Chu</p></div>
          </div>
        </header>

        <section className="research-video shell" aria-label="Research demonstration">
          <video
            controls
            playsInline
            preload="metadata"
            poster={publication.videoPoster}
          >
            <source src={publication.videoUrl} type="video/mp4" />
            Your browser does not support embedded video. You can view it on the paper page.
          </video>
        </section>

        <section className="case-body shell">
          <aside><p className="eyebrow">The challenge</p></aside>
          <div>
            <h2>Teaching robots to shape objects that are hard to see and predict.</h2>
            <p>
              Elasto-plastic objects such as clay can bend, stretch, and retain
              new forms. Severe self-occlusion and complex deformation dynamics
              make their state difficult to represent—and their motion difficult
              for a robot to plan.
            </p>
          </div>
        </section>

        <section className="method-section">
          <div className="shell">
            <p className="eyebrow">The framework</p>
            <div className="method-grid">
              <article><span>01</span><h3>3D occupancy</h3><p>A volumetric state representation inferred from multiple RGB views captures the object beyond partial surface observations.</p></article>
              <article><span>02</span><h3>Learned dynamics</h3><p>A model combining 3D convolutional and graph neural networks predicts complex object deformation.</p></article>
              <article><span>03</span><h3>Predictive control</h3><p>A shape-aware action initialization module improves planning efficiency toward a desired goal shape.</p></article>
            </div>
          </div>
        </section>

        <section className="case-body shell contribution-section">
          <aside><p className="eyebrow">My contribution</p></aside>
          <div>
            <h2>Architecting a learning-based predictive control framework.</h2>
            <p>
              I contributed to the architecture of the predictive control
              framework and its 3D occupancy-based state representation during
              my research at CUHK.
            </p>
            <a className="paper-link" href={publication.paperUrl} target="_blank" rel="noreferrer">Read the publication ↗</a>
          </div>
        </section>

        <section className="publication shell">
          <p className="eyebrow">Publication</p>
          <h2>{publication.title}</h2>
          <p>{publication.authors}</p>
          <p>{publication.venue} · {publication.citation}</p>
          <p><strong>{publication.conference}</strong></p>
          <p>DOI: {publication.doi}</p>
        </section>
      </article>

      <footer className="case-footer shell">
        <Link href="/">← Back to Lulu’s home</Link>
        <a href={`mailto:${site.email}`}>Discuss this work ↗</a>
      </footer>
    </main>
  );
}
