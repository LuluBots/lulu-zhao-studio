import Link from "next/link";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { publication, researchProjects, site } from "./site";

export default function Home() {
  const recentProjects = researchProjects.slice(0, 2);

  return (
    <main>
      <SiteHeader />

      <section className="hero shell" id="top">
        <div className="cloud cloud-one" aria-hidden="true" />
        <div className="cloud cloud-two" aria-hidden="true" />
        <div className="magic-sparkles" aria-hidden="true">✦ · ✧</div>
        <p className="eyebrow">Human–AI Interaction · Design · Embodied Intelligence</p>
        <div className="seasonal-photos" aria-label="Lulu through winter and summer">
          <figure className="season-photo season-photo-winter">
            <img src="/photos/lulu-winter.jpg" alt="Lulu Zhao beneath snow-covered trees in winter" />
            <figcaption>snow keeps the quiet</figcaption>
          </figure>
          <figure className="season-photo season-photo-summer">
            <img src="/photos/lulu-summer.jpg" alt="Lulu Zhao by the sea on a bright summer day" />
            <figcaption>sunlight answers back</figcaption>
          </figure>
        </div>
        <h1>
          Making intelligence
          <br />
          <span>tangible.</span>
        </h1>
        <div className="hero-footer">
          <p>
            I’m {site.name} ({site.chineseName}), a Robotics PhD student in
            Cornell Computer Science, exploring human–AI interaction and AI as
            a material for design in embodied intelligence.
          </p>
          <div className="hero-action">
            <p className="hand-note action-note">curiosity,<br />made physical</p>
            <Link className="round-link" href="/research" aria-label="View research">
              <span>Research</span><b aria-hidden="true">→</b>
            </Link>
          </div>
        </div>
      </section>

      <section className="journey-section home-journey">
        <div className="journey-grid shell">
          <div><p className="eyebrow">Journey</p></div>
          <div className="journey-stack">
            <ol className="timeline">
              <li className="cornell-stop"><span>2025–Present</span><div><h3>Cornell University</h3><p>PhD student in Robotics · Computer Science</p><strong className="fellowship-note"><i aria-hidden="true">✦</i> Cornell Fellowship · 2025</strong></div></li>
              <li><span>2021-25</span><div><h3>Beijing Normal University</h3><p>Bachelor of Engineering · Artificial Intelligence</p></div></li>
              <li><span>2024–25</span><div><h3>The Chinese University of Hong Kong</h3><p>Exchange at New Asia College</p></div></li>
              <li><span>2024</span><div><h3>Carnegie Mellon University</h3><p>Summer research at the Robotics Institute</p></div></li>
            </ol>
          </div>
        </div>
      </section>

      <section className="home-research" id="research">
        <div className="shell">
          <div className="section-heading">
            <p className="eyebrow">Selected research</p>
            <Link className="section-link" href="/research">View all research →</Link>
          </div>

          <div className="home-projects">
            <article className="home-featured-card">
              <div className="home-featured-art" aria-hidden="true">
                <span>RA-L 2025 · ICRA 2026 Transfer</span>
                <div className="occupancy-grid">{Array.from({ length: 24 }).map((_, i) => <i key={i} />)}</div>
              </div>
              <div>
                <p className="project-type">Robot learning · Deformable objects</p>
                <h3>{publication.shortTitle}</h3>
                <p>A 3D occupancy-based predictive control framework for complex deformable objects.</p>
                <Link href={`/research/${publication.slug}`}>Open project →</Link>
              </div>
            </article>

            <div className="home-small-projects">
              {recentProjects.map((project) => (
                <article className="home-small-card" key={project.slug}>
                  <p className="project-type">{project.tags.slice(0, 2).join(" · ")}</p>
                  <h3>{project.shortTitle}</h3>
                  <p>{project.summary}</p>
                  <Link href={`/research/${project.slug}`}>Open project →</Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-closing">
        <div className="home-portals shell">
          <Link href="/publications"><span>01</span><h2>Publications</h2><p>Peer-reviewed papers and research outputs.</p><b>Explore →</b></Link>
          <Link className="about-portal" href="/about"><span>02</span><h2>About</h2><p>The path from poetry and PPE to HAI and embodied intelligence.</p><b>Read my story →</b></Link>
        </div>
        <SiteFooter />
      </section>
    </main>
  );
}
