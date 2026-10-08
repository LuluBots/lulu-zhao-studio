"use client";

import React, { useEffect, useState } from "react";
import { LuluBot } from "../components/LuluBot";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

interface PhotoItem {
  id: number;
  src: string;
  alt: string;
  location: string;
  caption: string;
  width: number;
  height: number;
}

const photos: PhotoItem[] = [
  {
    id: 1,
    src: "/photos/puerto-rico-01.jpg",
    alt: "Stone sentry box (garita) overlooking the Atlantic Ocean in Old San Juan",
    location: "Old San Juan, Puerto Rico",
    caption: "A sentry box stands between stone walls and the open sea.",
    width: 1600,
    height: 2400,
  },
  {
    id: 2,
    src: "/photos/puerto-rico-04.jpg",
    alt: "Old San Juan coastal fortifications and stone walls beside the blue ocean",
    location: "Old San Juan, Puerto Rico",
    caption: "Fortifications meeting the Atlantic.",
    width: 2400,
    height: 1600,
  },
  {
    id: 3,
    src: "/photos/puerto-rico-06.jpg",
    alt: "Bright pink flowering bougainvillea branches against historic architecture",
    location: "San Juan, Puerto Rico",
    caption: "Color, sunlight, and quiet streets.",
    width: 2400,
    height: 1600,
  },
  {
    id: 4,
    src: "/photos/puerto-rico-02.jpg",
    alt: "Waves breaking along the rocky Caribbean coastline near a Puerto Rican flag",
    location: "Puerto Rico",
    caption: "Ocean spray and coastal rocks.",
    width: 2400,
    height: 1600,
  },
  {
    id: 5,
    src: "/photos/puerto-rico-05.jpg",
    alt: "A distant cargo vessel crossing a wide blue horizon",
    location: "Atlantic Horizon",
    caption: "A vessel in transit.",
    width: 2400,
    height: 1600,
  },
  {
    id: 6,
    src: "/photos/puerto-rico-03.jpg",
    alt: "Soft evening light reflected on rolling ocean swells",
    location: "Puerto Rico",
    caption: "Evening tide and golden sky.",
    width: 2400,
    height: 1600,
  },
];

export default function PhotographyPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveIndex(null);
      } else if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev !== null ? (prev + 1) % photos.length : 0));
      } else if (e.key === "ArrowLeft") {
        setActiveIndex((prev) =>
          prev !== null ? (prev - 1 + photos.length) % photos.length : 0
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex]);

  const activePhoto = activeIndex !== null ? photos[activeIndex] : null;

  return (
    <div className="site-canvas">
      <SiteHeader />

      <main className="shell inner-page-main">
        <header className="page-header-row">
          <div className="page-header-copy">
            <span className="page-category">Photos</span>
            <h1 className="page-heading">Light, weather &amp; passing things.</h1>
            <p className="page-lead">
              A visual notebook of seasons and moments. Photography is a way of paying attention
              to light, texture, and silence.
            </p>
          </div>
          <div className="page-header-companion" aria-hidden="true">
            <LuluBot size="compact" />
          </div>
        </header>

        {/* Gallery Grid */}
        <section className="photos-grid-section" aria-label="Photo gallery">
          <div className="photos-masonry-grid">
            {photos.map((photo, index) => (
              <figure
                key={photo.id}
                className="gallery-card"
                onClick={() => setActiveIndex(index)}
              >
                <button
                  type="button"
                  className="gallery-card-btn"
                  aria-label={`View enlarged photo: ${photo.alt}`}
                >
                  <div className="gallery-img-wrap">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading={index < 2 ? "eager" : "lazy"}
                    />
                  </div>
                  <figcaption className="gallery-caption">
                    <span className="gallery-loc">{photo.location}</span>
                    <span className="gallery-zoom-hint" aria-hidden="true">
                      ↗
                    </span>
                  </figcaption>
                </button>
              </figure>
            ))}
          </div>
        </section>

        {/* Accessible Lightbox Modal Dialog */}
        {activePhoto && (
          <div
            className="lightbox-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Enlarged photo preview"
            onClick={() => setActiveIndex(null)}
          >
            <div className="lightbox-dialog" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="lightbox-close-btn"
                onClick={() => setActiveIndex(null)}
                aria-label="Close photo preview"
              >
                ✕
              </button>

              <button
                type="button"
                className="lightbox-nav-btn lightbox-prev-btn"
                onClick={() =>
                  setActiveIndex((prev) =>
                    prev !== null ? (prev - 1 + photos.length) % photos.length : 0
                  )
                }
                aria-label="Previous photo"
              >
                ‹
              </button>

              <div className="lightbox-image-container">
                <img src={activePhoto.src} alt={activePhoto.alt} />
              </div>

              <button
                type="button"
                className="lightbox-nav-btn lightbox-next-btn"
                onClick={() =>
                  setActiveIndex((prev) => (prev !== null ? (prev + 1) % photos.length : 0))
                }
                aria-label="Next photo"
              >
                ›
              </button>

              <div className="lightbox-info-bar">
                <p className="lightbox-caption">{activePhoto.caption}</p>
                <span className="lightbox-loc">{activePhoto.location}</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
