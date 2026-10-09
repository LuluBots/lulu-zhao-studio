"use client";

import React from "react";
import { site } from "../site";
import { useMotion } from "./MotionContext";

export function SiteFooter() {
  const { motionEnabled, toggleMotion, copyEmail, statusMessage } = useMotion();

  return (
    <footer className="site-footer">
      <div style={{textAlign:"center",padding:"18px",fontSize:"13px"}}>Version 2 · LuluBot Studio · <a href="https://luluzhao.me/versions/">Version history ↗</a></div>
      <div className="shell site-footer-inner">
        {/* Contact Invitation Section */}
        <section className="footer-contact-box" aria-labelledby="footer-contact-title">
          <div className="contact-invite">
            <h2 id="footer-contact-title" className="contact-title">
              Have a question, an idea, or a curious little project?
            </h2>
            <p className="contact-subtitle">
              Feel free to say hello. Always happy to discuss research, ideas, or collaborations.
            </p>
          </div>

          <div className="contact-actions">
            <a
              href={`mailto:${site.email}`}
              className="action-btn action-email-primary"
              aria-label="Send email to Lulu Zhao"
            >
              Email me
            </a>
            <button
              type="button"
              onClick={copyEmail}
              className="action-btn action-copy-btn"
              aria-label="Copy email address to clipboard"
            >
              Copy email
            </button>
            {/* Live polite status announcement for screen readers & visual feedback */}
            <div
              className={`copy-status-bubble ${statusMessage ? "visible" : ""}`}
              role="status"
              aria-live="polite"
            >
              {statusMessage || ""}
            </div>
          </div>
        </section>

        {/* Divider */}
        <hr className="footer-line" />

        {/* Meta & Colophon */}
        <div className="footer-bottom-row">
          <div className="footer-info">
            <p className="footer-copyright">
              © {new Date().getFullYear()} {site.name} · Ithaca, New York
            </p>
            <div className="footer-social-links" aria-label="Social and academic links">
              <a href={site.scholar} target="_blank" rel="noreferrer">
                Scholar ↗
              </a>
              <a href={site.github} target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
              <a href={site.linkedin} target="_blank" rel="noreferrer">
                LinkedIn ↗
              </a>
            </div>
          </div>

          {/* Legacy ASCII Robot Easter Egg & Motion Toggle */}
          <div className="footer-extras">
            <div className="footer-robot-wrapper" title="The original research bot">
              <pre className="footer-ascii-robot" aria-label="A little robot, drawn in text">
{`   .─.
  [o o]
 /| = |\\
  d   b`}
              </pre>
            </div>

            <button
              type="button"
              onClick={toggleMotion}
              className="motion-toggle-btn"
              aria-label={`Toggle animation motion. Currently ${motionEnabled ? "on" : "off"}`}
            >
              <span className={`motion-indicator ${motionEnabled ? "on" : "off"}`} />
              Motion: {motionEnabled ? "on" : "off"}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
