import { publication, site } from "./site";

export default function Home() {
  return (
    <main>
      <header className="site-header shell">
        <a className="wordmark" href="#top" aria-label="Lulu Zhao, home">
          Lulu Zhao<span aria-hidden="true">.</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#research">Research</a>
          <a href="#about">About</a>
          <a href="#journey">Journey</a>
          <a className="nav-contact" href={`mailto:${site.email}`}>
            Say hello
          </a>
        </nav>
      </header>

      <section className="hero shell" id="top">
        <p className="eyebrow">Human–AI Interaction · Embodied Intelligence</p>
        <h1>
          Designing with AI
          <br />
          <span>as a material.</span>
        </h1>
        <div className="hero-footer">
          <p>
            I’m {site.name} ({site.chineseName}), a first-year Robotics PhD
            student in Computer Science at Cornell University, exploring how
            embodied intelligence can become a material for design.
          </p>
          <a className="round-link" href="#research" aria-label="View research">
            <span>Research</span>
            <b aria-hidden="true">↓</b>
          </a>
        </div>
        <div className="hero-mark" aria-hidden="true">
          <span>L</span>
          <i />
        </div>
      </section>

      <section className="work-section" id="research">
        <div className="shell">
          <div className="section-heading">
            <p className="eyebrow">Selected research</p>
            <p className="section-note">Robots that understand, predict, and shape.</p>
          </div>

          <article className="project featured-project">
            <a
              className="project-visual coral"
              href={`/research/${publication.slug}`}
              aria-label={`Read about ${publication.title}`}
            >
              <span className="project-number">01 / RA-L 2025</span>
              <div className="occupancy-grid" aria-hidden="true">
                {Array.from({ length: 24 }).map((_, index) => <i key={index} />)}
              </div>
              <div className="shape shape-two" />
            </a>
            <div className="project-copy">
              <p className="project-type">Robot learning · Deformable objects</p>
              <h2>{publication.shortTitle}</h2>
              <p>
                A learning-based predictive control framework using a novel 3D
                occupancy representation to model and manipulate complex
                elasto-plastic objects.
              </p>
              <p className="project-role">
                Researcher · The Chinese University of Hong Kong
              </p>
              <a className="text-link" href={`/research/${publication.slug}`}>
                Explore research ↗
              </a>
            </div>
          </article>
        </div>
      </section>

      <section className="about-section shell" id="about">
        <p className="eyebrow">Research perspective</p>
        <div className="about-grid">
          <h2>Between technology and the humanities.</h2>
          <div className="about-copy">
            <p>
              My research sits at the intersection of embodied intelligence,
              human–AI interaction, and design. I’m interested not only in what
              intelligent systems can do, but in how people can think and create
              with AI as a material.
            </p>
            <p>
              My path here has never been linear. I grew up publishing poetry
              and essays, studied the humanities in high school, began college
              in Politics, Philosophy and Economics, and later moved into
              Artificial Intelligence and robotics research.
            </p>
          </div>
        </div>
        <div className="principles" aria-label="Research interests">
          <div><span>01</span><strong>Embodied intelligence</strong></div>
          <div><span>02</span><strong>Human–AI interaction</strong></div>
          <div><span>03</span><strong>AI as a design material</strong></div>
        </div>
      </section>

      <section className="journey-section" id="journey">
        <div className="shell journey-grid">
          <div className="journey-intro">
            <p className="eyebrow">A multidisciplinary journey</p>
            <h2>One question,<br />many ways of seeing.</h2>
          </div>
          <ol className="timeline">
            <li>
              <span>Now</span>
              <div><h3>Cornell University</h3><p>PhD student in Robotics · Computer Science</p></div>
            </li>
            <li>
              <span>Research</span>
              <div><h3>Carnegie Mellon University</h3><p>Summer research intern · Robotics Institute</p></div>
            </li>
            <li>
              <span>Exchange</span>
              <div><h3>The Chinese University of Hong Kong</h3><p>New Asia College · One-semester exchange</p></div>
            </li>
            <li>
              <span>B.Eng.</span>
              <div><h3>Beijing Normal University</h3><p>Artificial Intelligence · Engineering</p></div>
            </li>
            <li>
              <span>Earlier</span>
              <div><h3>Words before robots</h3><p>Poetry, essays, humanities, and PPE</p></div>
            </li>
          </ol>
        </div>
      </section>

      <footer className="site-footer shell">
        <p className="eyebrow">Ideas, research, or collaboration?</p>
        <h2>Let’s start a conversation.</h2>
        <a href={`mailto:${site.email}`}>{site.email} ↗</a>
        <div className="social-links" aria-label="Social profiles">
          <a href={site.github} target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
        </div>
        <div className="footer-meta">
          <span>© {new Date().getFullYear()} Lulu Zhao</span>
          <span>Ithaca, New York</span>
        </div>
      </footer>
    </main>
  );
}
