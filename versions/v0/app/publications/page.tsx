import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { publications } from "../site";

export const metadata: Metadata = {
  title: "Publications — Lulu Zhao",
  description: "Selected publications by Lulu Zhao in robot learning, manipulation, medical imaging, and embodied intelligence.",
  alternates: { canonical: "/publications" },
};

export default function PublicationsPage() {
  return (
    <main>
      <SiteHeader />
      <header className="subpage-hero shell compact"><p className="eyebrow">Research record</p><h1>Selected publications.</h1></header>
      <section className="publications-section shell standalone-publications">
        <div className="publication-list">
          {publications.map((item) => (
            <article key={item.title}>
              <span>{item.year}</span>
              <div><h3>{item.title}</h3><p>{item.authors}</p><strong>{item.venue}</strong>
                <div className="publication-links">{item.links.map((link) => <a href={link.url} key={link.label} target={link.url.startsWith("http") ? "_blank" : undefined} rel={link.url.startsWith("http") ? "noreferrer" : undefined}>{link.label} ↗</a>)}</div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
