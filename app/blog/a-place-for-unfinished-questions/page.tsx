import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";

export const metadata: Metadata = {
  title: "A Place for Unfinished Questions — Lulu Zhao",
  description:
    "An opening note for Lulu Zhao's notebook on research, design, and the humanities.",
  alternates: { canonical: "/blog/a-place-for-unfinished-questions" },
};

export default function OpeningNotePage() {
  return (
    <div className="site-canvas">
      <SiteHeader />

      <main className="shell inner-page-main">
        <div className="detail-nav-bar">
          <Link href="/blog" className="back-link">
            ← All notes
          </Link>
        </div>

        <article className="essay-container">
          <header className="essay-header">
            <span className="meta-tag">Opening note · 2026</span>
            <h1 className="essay-title">A place for unfinished questions</h1>
            <p className="essay-subtitle">
              Research asks for precision. Design asks us to notice what precision leaves out.
            </p>
          </header>

          <div className="essay-body-content">
            <p>
              I arrived at artificial intelligence by a winding route: through poetry, the
              humanities, PPE, and eventually robotics. That path taught me to value questions
              that do not fit neatly inside one discipline.
            </p>
            <p>
              Today I am interested in human–AI interaction and in using AI as a material for design
              in embodied intelligence. I want to understand not only what intelligent systems can
              do, but what kinds of relationships, experiences, and ways of thinking they make
              possible.
            </p>
            <blockquote className="essay-quote">
              This notebook is a place to keep those questions in motion.
            </blockquote>
            <p>
              Some entries will be field notes from research. Others may begin with a paper, an
              object, an image, or a line of writing. They do not need to arrive as final conclusions.
              For now, it is enough that they open a window.
            </p>
          </div>

          <footer className="essay-footer">
            <p className="essay-signoff">— Lulu Zhao</p>
            <div className="essay-nav-back">
              <Link href="/blog" className="back-link">
                ← Return to notes index
              </Link>
            </div>
          </footer>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
