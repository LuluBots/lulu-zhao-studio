import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

const notes = [
  {
    year: "2026",
    kind: "Opening note",
    title: "A place for unfinished questions",
    summary:
      "Why this notebook sits between research, design, and the small observations that make both feel alive.",
    href: "/blog/a-place-for-unfinished-questions",
  },
];

export const metadata: Metadata = {
  title: "Blog — Lulu Zhao",
  description: "Field notes and essays on human–AI interaction, design, embodied intelligence, and the humanities.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <main>
      <SiteHeader />
      <header className="subpage-hero blog-hero shell">
        <p className="eyebrow">Field notes · essays · fragments</p>
        <h1>Notes carried<br />by the wind.</h1>
        <p>
          A notebook for ideas at the meeting point of people, intelligent
          machines, design, and the humanities—written when a question asks to
          stay a little longer.
        </p>
      </header>

      <section className="blog-archive">
        <div className="shell blog-layout">
          <aside className="blog-index-note">
            <span aria-hidden="true">✦</span>
            <p>Loose observations become field notes; field notes may grow into essays.</p>
            <div className="blog-topics" aria-label="Blog topics">
              <span>Human–AI interaction</span>
              <span>Design</span>
              <span>Embodied intelligence</span>
              <span>Tech &amp; humanities</span>
            </div>
          </aside>
          <div className="blog-years">
            <h2>2026</h2>
            {notes.map((note) => (
              <Link className="blog-entry" href={note.href} key={note.href}>
                <div>
                  <p>{note.kind}</p>
                  <h3>{note.title}</h3>
                  <span>{note.summary}</span>
                </div>
                <b aria-hidden="true">↗</b>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
