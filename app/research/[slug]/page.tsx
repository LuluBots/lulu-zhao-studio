import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { researchProjects, site } from "../../site";

export function generateStaticParams() {
  return researchProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = researchProjects.find((item) => item.slug === slug);
  return project
    ? { title: `${project.shortTitle} — ${site.name}`, description: project.summary }
    : { title: `Research — ${site.name}` };
}

export default async function ResearchNote({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = researchProjects.find((item) => item.slug === slug);
  if (!project) notFound();

  return (
    <main className="case-study simple-note">
      <header className="site-header shell">
        <Link className="wordmark" href="/">Lulu Zhao<span>.</span></Link>
        <nav aria-label="Project navigation">
          <Link href="/#research">All field notes</Link>
          <a className="nav-contact" href={`mailto:${site.email}`}>Send a note</a>
        </nav>
      </header>

      <article>
        <header className="case-hero shell">
          <p className="eyebrow">{project.tags.join(" · ")}</p>
          <h1>{project.title}</h1>
          <div className="case-meta three-up">
            <div><span>Institution</span><p>{project.institution}</p></div>
            <div><span>Period</span><p>{project.dates}</p></div>
            <div><span>Mentorship</span><p>{project.advisors}</p></div>
          </div>
        </header>

        <section className="note-visual shell" aria-hidden="true">
          <div className="note-orbit" />
          <div className="note-spark">✦</div>
          <p>{project.shortTitle}</p>
        </section>

        <section className="case-body shell">
          <aside><p className="eyebrow">Research note</p></aside>
          <div>
            <h2>{project.summary}</h2>
            <p>{project.contribution}</p>
            {project.links && (
              <div className="project-links">
                {project.links.map((link) => <a href={link.url} target="_blank" rel="noreferrer" key={link.label}>{link.label} ↗</a>)}
              </div>
            )}
          </div>
        </section>

        <section className="tags-section shell">
          <p className="eyebrow">Keywords</p>
          <div>{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </section>
      </article>

      <footer className="case-footer shell">
        <Link href="/#research">← Back to all research</Link>
        <a href={`mailto:${site.email}`}>Discuss this work ↗</a>
      </footer>
    </main>
  );
}
