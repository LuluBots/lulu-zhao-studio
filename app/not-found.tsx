import Link from "next/link";
import React from "react";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";

export default function NotFound() {
  return (
    <div className="site-canvas">
      <SiteHeader />

      <main className="shell not-found-main">
        <div className="not-found-card">
          {/* Custom 404 Illustration: LuluBot holding upside-down map */}
          <div className="not-found-illustration" aria-hidden="true">
            <svg
              width="160"
              height="180"
              viewBox="0 0 160 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Ground shadow */}
              <ellipse cx="80" cy="170" rx="42" ry="5" fill="#DDD3C4" opacity="0.6" />

              {/* Legs */}
              <rect x="62" y="144" width="10" height="20" rx="5" fill="#282522" />
              <rect x="88" y="144" width="10" height="20" rx="5" fill="#282522" />

              {/* Body */}
              <rect
                x="44"
                y="102"
                width="72"
                height="42"
                rx="10"
                fill="#F2C94C"
                stroke="#282522"
                strokeWidth="2.8"
              />

              {/* Head */}
              <g transform="rotate(-6 80 70)">
                {/* Neck */}
                <rect x="74" y="94" width="12" height="8" rx="3" fill="#DDD3C4" stroke="#282522" strokeWidth="2" />
                {/* Antenna */}
                <path d="M80 40V26" stroke="#282522" strokeWidth="2.8" strokeLinecap="round" />
                <circle cx="80" cy="24" r="4" fill="#E76F51" stroke="#282522" strokeWidth="2.2" />
                {/* Head Box */}
                <path
                  d="M42 46C42 40 47 36 54 36H106C113 36 118 40 118 46V88C118 94 113 98 106 98H54C47 98 42 94 42 88V46Z"
                  fill="#FFFEFB"
                  stroke="#282522"
                  strokeWidth="2.8"
                />
                {/* Cheeks */}
                <circle cx="56" cy="74" r="3.5" fill="#E76F51" opacity="0.6" />
                <circle cx="104" cy="74" r="3.5" fill="#E76F51" opacity="0.6" />
                {/* Surprised / wondering eyes */}
                <circle cx="66" cy="62" r="7" fill="#282522" />
                <circle cx="94" cy="62" r="7" fill="#282522" />
                <circle cx="64" cy="60" r="2.5" fill="#FFFEFB" />
                <circle cx="92" cy="60" r="2.5" fill="#FFFEFB" />
                {/* Small 'o' mouth */}
                <circle cx="80" cy="74" r="3" stroke="#282522" strokeWidth="2" fill="none" />
              </g>

              {/* Upside-down Folded Map */}
              <g transform="translate(48, 114) rotate(180 32 20)">
                {/* Map paper */}
                <rect
                  x="6"
                  y="2"
                  width="52"
                  height="36"
                  rx="3"
                  fill="#FFFDF5"
                  stroke="#282522"
                  strokeWidth="2.4"
                />
                {/* Fold creases */}
                <line x1="23" y1="2" x2="23" y2="38" stroke="#DDD3C4" strokeWidth="1.5" />
                <line x1="40" y1="2" x2="40" y2="38" stroke="#DDD3C4" strokeWidth="1.5" />
                {/* Map path squiggle */}
                <path
                  d="M14 26C18 16 28 28 34 18C38 12 44 20 48 14"
                  stroke="#345D9D"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="2 2"
                  fill="none"
                />
                {/* Destination 'X' on upside down map */}
                <path d="M44 24L48 28M48 24L44 28" stroke="#E76F51" strokeWidth="2" strokeLinecap="round" />
              </g>

              {/* Robot Arms holding the map */}
              <path
                d="M44 110C36 116 46 130 54 126"
                stroke="#282522"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <path
                d="M116 110C124 116 114 130 106 126"
                stroke="#282522"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h1 className="not-found-title">404</h1>
          <p className="not-found-lead">I think we took a curious little detour.</p>
          <p className="not-found-text">
            The page you are looking for does not exist or may have wandered off into another research direction.
          </p>

          <div className="not-found-actions">
            <Link href="/" className="btn btn-primary">
              Return Home →
            </Link>
            <Link href="/research" className="btn btn-secondary">
              Explore Research
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
