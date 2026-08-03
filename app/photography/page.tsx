import Image from "next/image";
import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Photography — Lulu Zhao",
  description: "A visual notebook of seasons, movement, and passing moments by Lulu Zhao.",
};

const photographs = [
  {
    src: "/photos/lulu-winter.jpg",
    alt: "Lulu Zhao beneath snow-covered trees in winter",
    season: "Winter",
    caption: "Snow keeps the quiet.",
    shape: "portrait",
    width: 900,
    height: 1600,
  },
  {
    src: "/photos/lulu-summer.jpg",
    alt: "Lulu Zhao by the sea on a bright summer day",
    season: "Summer",
    caption: "Sunlight answers back.",
    shape: "landscape",
    width: 1600,
    height: 1066,
  },
  {
    src: "/photos/lulu-portrait.jpg",
    alt: "Portrait of Lulu Zhao",
    season: "In between",
    caption: "A small pause between places.",
    shape: "portrait",
    width: 1200,
    height: 1800,
  },
];

export default function PhotographyPage() {
  return (
    <main className="photography-page">
      <SiteHeader />
      <header className="photo-intro shell">
        <div>
          <p className="eyebrow">A visual notebook</p>
          <h1>Light, weather,<br />and passing things.</h1>
        </div>
        <p>
          Photographs from the spaces between research and everyday life—an
          archive of seasons, movement, and the moments that ask to be kept.
        </p>
      </header>

      <section className="photo-rail" aria-label="Photography collection">
        <div className="photo-track">
          {photographs.map((photo, index) => (
            <figure className={`gallery-photo gallery-photo-${photo.shape}`} key={photo.src}>
              <div className="photo-frame">
                <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes={photo.shape === "landscape" ? "(max-width: 720px) 82vw, 680px" : "(max-width: 720px) 70vw, 430px"} />
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <figcaption><b>{photo.season}</b><em>{photo.caption}</em></figcaption>
            </figure>
          ))}
          <div className="photo-end" aria-label="End of collection">
            <span aria-hidden="true">✦</span>
            <p>More light<br />to come.</p>
          </div>
        </div>
      </section>
      <p className="photo-hint shell">Scroll sideways to wander →</p>
      <SiteFooter />
    </main>
  );
}
