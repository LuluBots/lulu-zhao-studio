import Link from "next/link";
import { site } from "../site";

export function SiteHeader() {
  return (
    <header className="site-header shell">
      <Link className="wordmark" href="/" aria-label="Lulu Zhao, home">
        Lulu Zhao<span aria-hidden="true">.</span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/research">Research</Link>
        <Link href="/publications">Publications</Link>
        <Link href="/about">About</Link>
        <a className="nav-contact" href={`mailto:${site.email}`}>Send a note</a>
      </nav>
    </header>
  );
}
