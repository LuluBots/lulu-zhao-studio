import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";

export const metadata: Metadata = {
  title: "A Place for Unfinished Questions — Lulu Zhao",
  description: "An opening note for Lulu Zhao's notebook on research, design, and the humanities.",
  alternates: { canonical: "/blog/a-place-for-unfinished-questions" },
};

export default function OpeningNotePage() {
  return (
    <main>
      <SiteHeader />
      <article className="essay shell">
        <Link className="essay-back" href="/blog">← All notes</Link>
        <header>
          <p className="eyebrow">Opening note · 2026</p>
          <h1>A place for<br /><em>unfinished questions.</em></h1>
          <p className="essay-deck">
            Research asks for precision. Design asks us to notice what precision leaves out.
          </p>
        </header>
        <div className="essay-body">
          <p>
            I arrived at artificial intelligence by a winding route: through
            poetry, the humanities, PPE, and eventually robotics. That path
            taught me to value questions that do not fit neatly inside one
            discipline.
          </p>
          <p>
            Today I am interested in human–AI interaction and in using AI as a
            material for design in embodied intelligence. I want to understand
            not only what intelligent systems can do, but what kinds of
            relationships, experiences, and ways of thinking they make possible.
          </p>
          <blockquote>
            This blog is a place to keep those questions in motion.
          </blockquote>
          <p>
            Some entries will be field notes from research. Others may begin
            with a paper, an object, an image, or a line of writing. They do not
            need to arrive as conclusions. For now, it is enough that they open
            a window.
          </p>
        </div>
        <footer className="essay-signoff">— Lulu</footer>
      </article>
      <SiteFooter />
    </main>
  );
}
