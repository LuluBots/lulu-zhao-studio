import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Photography — Lulu Zhao",
  description: "A visual notebook of seasons, movement, and passing moments by Lulu Zhao.",
};

const photographs = [
  {
    src: "/photos/puerto-rico-01.jpg",
    alt: "A stone sentry box above the sea in Puerto Rico",
    shape: "portrait",
    width: 1600,
    height: 2400,
  },
  {
    src: "/photos/puerto-rico-04.jpg",
    alt: "Old San Juan and its fortifications beside the Atlantic Ocean",
    shape: "landscape",
    width: 2400,
    height: 1600,
  },
  {
    src: "/photos/puerto-rico-06.jpg",
    alt: "Flowering branches above colorful buildings under a blue sky",
    shape: "landscape",
    width: 2400,
    height: 1600,
  },
  {
    src: "/photos/puerto-rico-02.jpg",
    alt: "Waves breaking beside a Puerto Rican flag on a rocky coast",
    shape: "landscape",
    width: 2400,
    height: 1600,
  },
  {
    src: "/photos/puerto-rico-05.jpg",
    alt: "A solitary cargo ship crossing a blue horizon",
    shape: "landscape",
    width: 2400,
    height: 1600,
  },
  {
    src: "/photos/puerto-rico-03.jpg",
    alt: "Ocean waves beneath warm evening clouds in Puerto Rico",
    shape: "landscape",
    width: 2400,
    height: 1600,
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
          A first collection from Puerto Rico—stone, wind, salt, and tropical
          light, held together as a small record of looking.
        </p>
      </header>

      <section className="photo-rail" aria-label="Photography collection">
        <div className="photo-track">
          {photographs.map((photo, index) => (
            <figure className={`gallery-photo gallery-photo-${photo.shape}`} key={photo.src}>
              <div className="photo-frame">
                <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading={index === 0 ? "eager" : "lazy"} />
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
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
