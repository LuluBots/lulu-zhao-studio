import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "About — Lulu Zhao",
  description: "Lulu Zhao's path from poetry and PPE to human–AI interaction, design, and embodied intelligence.",
};

export default function AboutPage() {
  return (
    <main>
      <SiteHeader />
      <header className="subpage-hero shell">
        <p className="eyebrow">About Lulu</p>
        <h1>A humanist’s path<br />into intelligent machines.</h1>
        <p>I’m interested in the places where technical systems meet human imagination, behavior, and everyday life.</p>
      </header>

      <section className="about-section shell">
        <div className="about-grid">
          <h2>Designing how intelligence enters the world.</h2>
          <div className="about-copy">
            <p>I am a first-year Robotics PhD student in Cornell Computer Science. My current research centers on human–AI interaction and design for embodied intelligence: treating AI not only as a tool, but as a material with behaviors, constraints, and expressive possibilities.</p>
            <p>My earlier work in robot learning, perception, and manipulation gives me a technical foundation for asking more human questions: How should intelligent systems feel to use? How can people understand and shape their behavior? What new forms of interaction become possible when intelligence has a body?</p>
          </div>
        </div>
        <div className="principles">
          <div><span>01</span><strong>Make intelligence legible.</strong></div>
          <div><span>02</span><strong>Design through material exploration.</strong></div>
          <div><span>03</span><strong>Keep people in the question.</strong></div>
        </div>
      </section>

      <section className="beyond-section shell">
        <div className="beyond-heading"><p className="eyebrow">A non-linear beginning</p><h2>Technology, with a human pulse.</h2></div>
        <div className="beyond-grid">
          <article><span>✎</span><h3>Words first</h3><p>I began publishing poetry and essays in newspapers and magazines in primary school. Writing taught me to notice small things—and to care about how ideas are felt.</p></article>
          <article><span>↝</span><h3>A winding route</h3><p>I studied humanities in high school and began university in Politics, Philosophy, and Economics before moving into artificial intelligence and embodied intelligence.</p></article>
          <article><span>✦</span><h3>Across disciplines</h3><p>I feel most at home where technology and the humanities overlap: between building systems and asking what kind of relationship we want with them.</p></article>
        </div>
      </section>

      <section className="toolkit-section">
        <div className="toolkit-grid shell">
          <div><p className="eyebrow">Working vocabulary</p><h2>Ideas I build with.</h2></div>
          <div className="tool-groups">
            <div><strong>Research</strong><p>Human–AI interaction · Embodied intelligence · Robot learning</p></div>
            <div><strong>Making</strong><p>Interaction design · Prototyping · Generative systems</p></div>
            <div><strong>Thinking</strong><p>Materiality · Human experience · Technology and society</p></div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
