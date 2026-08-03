import { site } from "../site";

export function SiteFooter() {
  return (
    <footer className="site-footer shell">
      <div className="footer-star" aria-hidden="true">✦</div>
      <p className="eyebrow">Have an idea, a question, or a little magic?</p>
      <h2>Send a letter my way.</h2>
      <a href={`mailto:${site.email}`}>{site.email} ↗</a>
      <div className="social-links" aria-label="Social profiles">
        <a href={site.github} target="_blank" rel="noreferrer">GitHub ↗</a>
        <a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
        <a href={site.scholar} target="_blank" rel="noreferrer">Google Scholar ↗</a>
      </div>
      <div className="footer-meta">
        <span>© {new Date().getFullYear()} Lulu Zhao</span>
        <span>Ithaca, New York</span>
      </div>
    </footer>
  );
}
