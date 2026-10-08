import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

const notes = [
  {
    year: "2026",
    date: "Jan 2026",
    tag: "Field note",
    title: "A place for unfinished questions",
    summary:
      "Why this notebook sits between research, design, and the small observations that make both feel alive.",
    href: "/blog/a-place-for-unfinished-questions",
  },
];

export const metadata: Metadata = {
  title: "Notes — Lulu Zhao",
  description:
    "Field notes, thoughts, and essays on human–AI interaction, design, embodied intelligence, and the humanities by Lulu Zhao.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <div className="site-canvas">
      <SiteHeader />

      <main className="shell inner-page-main">
        <header className="page-header-row">
          <div className="page-header-copy">
            <span className="page-category">Notes</span>
            <h1 className="page-heading">Notes, questions &amp; observations.</h1>
            <p className="page-lead">
              A notebook for ideas at the intersection of people, intelligent machines, design, and
              the humanities—written when a thought asks to stay a little longer.
            </p>
          </div>
        </header>

        <section className="notes-container" aria-label="Notes archive">
          <div className="notes-list">
            {notes.map((note) => (
              <article key={note.href} className="note-item-card">
                <div className="note-item-meta">
                  <span className="note-item-date">{note.date}</span>
                  <span className="note-item-tag">{note.tag}</span>
                </div>

                <h2 className="note-item-title">
                  <Link href={note.href}>{note.title}</Link>
                </h2>

                <p className="note-item-summary">{note.summary}</p>

                <div className="note-item-action">
                  <Link href={note.href} className="action-link-primary">
                    Read entry →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
