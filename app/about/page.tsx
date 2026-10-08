import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { LuluBot } from "../components/LuluBot";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "About — Lulu Zhao",
  description:
    "About Lulu Zhao, PhD student in Computer Science at Cornell University interested in human–AI interaction and design.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const educationTimeline = [
    {
      institution: "Cornell University",
      degree: "Ph.D. in Computer Science",
      period: "08/2025 – Present",
      note: "Advisor / Focus: Human–AI Interaction and Design · Cornell Fellowship",
    },
    {
      institution: "Beijing Normal University",
      degree: "B.Eng. in Artificial Intelligence",
      period: "09/2021 – 07/2025",
      note: "First Prize University Scholarship",
    },
    {
      institution: "The Chinese University of Hong Kong",
      degree: "International Asian Studies Program (IASP Exchange)",
      period: "09/2024 – 01/2025",
      note: "T Stone Robotics Institute · Deformable object manipulation",
    },
    {
      institution: "Carnegie Mellon University",
      degree: "Summer Undergraduate Research",
      period: "06/2024 – 08/2024",
      note: "Robotics Institute · Foam Robotics Lab",
    },
  ];

  return (
    <div className="site-canvas">
      <SiteHeader />

      <main className="shell inner-page-main">
        <header className="page-header-row">
          <div className="page-header-copy">
            <span className="page-category">About</span>
            <h1 className="page-heading">Hi, I’m Lulu Zhao (赵璐璐).</h1>
            <p className="page-lead">
              I’m a PhD student in Computer Science at Cornell University, interested in human–AI
              interaction and design.
            </p>
          </div>
          <div className="page-header-companion" aria-hidden="true">
            <LuluBot size="compact" />
          </div>
        </header>

        {/* Biography Section */}
        <section className="about-bio-section">
          <div className="bio-prose">
            <p>
              My research began in robotics and embodied intelligence, and that experience continues
              to inform how I think about and build interactive systems. Rather than viewing
              intelligent systems strictly as autonomous agents or black-box optimizers, I am
              curious about AI as a material for design—how physical and interactive affordances
              shape people’s understanding, trust, and creative relationship with technology.
            </p>
            <p>
              Before Cornell, I completed my Bachelor of Engineering in Artificial Intelligence at
              Beijing Normal University, spent a semester on exchange at CUHK exploring deformable
              object manipulation, and conducted summer research at Carnegie Mellon University on
              dexterous manipulation with soft anthropomorphic hands.
            </p>
          </div>
        </section>

        {/* Education & Experience Timeline */}
        <section className="about-experience-section" aria-labelledby="experience-heading">
          <h2 id="experience-heading" className="section-subheading">
            Education &amp; Experience
          </h2>

          <div className="experience-list">
            {educationTimeline.map((item) => (
              <div key={item.institution + item.degree} className="experience-item">
                <div className="experience-period">{item.period}</div>
                <div className="experience-details">
                  <h3 className="experience-inst">{item.institution}</h3>
                  <p className="experience-deg">{item.degree}</p>
                  <p className="experience-note">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Interests: Writing and Photography */}
        <section className="about-interests-section" aria-labelledby="interests-heading">
          <h2 id="interests-heading" className="section-subheading">
            Beyond the Terminal
          </h2>

          <div className="interests-grid">
            <div className="interest-card">
              <h3>Writing &amp; Stories</h3>
              <p>
                I have loved literature and prose since childhood, publishing essays and poetry in
                magazines from an early age. Writing helps me stay attuned to nuance, tone, and the
                human pulse behind technological questions.
              </p>
              <Link href="/blog" className="action-link-primary">
                Read notes &amp; essays →
              </Link>
            </div>

            <div className="interest-card">
              <h3>Photography</h3>
              <p>
                I collect light, architectural geometry, and weather with my camera. It is a quiet
                practice in observing the world as it unfolds.
              </p>
              <Link href="/photography" className="action-link-primary">
                View visual notebook →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
