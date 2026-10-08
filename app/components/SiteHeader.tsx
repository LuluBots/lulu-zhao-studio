"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { site } from "../site";

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: "/research", label: "Research" },
    { href: "/publications", label: "Publications" },
    { href: "/blog", label: "Notes" },
    { href: "/photography", label: "Photos" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="site-header-wrapper">
      <div className="shell site-header-inner">
        {/* Brand wordmark */}
        <Link href="/" className="site-wordmark" aria-label="Lulu Zhao (赵璐璐), Home">
          <span className="wordmark-text">
            Lulu Zhao
            <span className="wordmark-zh"> / 赵璐璐</span>
          </span>
          <svg
            className="wordmark-bot-spark"
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="8" cy="8" r="6" stroke="#282522" strokeWidth="2" fill="#F2C94C" />
            <circle cx="8" cy="8" r="2" fill="#E76F51" />
          </svg>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Main navigation">
          {navLinks.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive ? "active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
          <a
            className="nav-email-link"
            href={`mailto:${site.email}`}
            aria-label="Send email to Lulu Zhao"
          >
            Email
          </a>
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <span className="menu-icon-bar" />
          <span className="menu-text">{mobileMenuOpen ? "Close" : "Menu"}</span>
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-overlay" onClick={() => setMobileMenuOpen(false)}>
          <nav
            className="mobile-nav-panel shell"
            aria-label="Mobile navigation"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-nav-links">
              <Link href="/" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="mobile-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mobile-nav-divider" />
              <div className="mobile-contact-links">
                <a href={`mailto:${site.email}`} className="mobile-sublink">
                  ✉️ {site.email}
                </a>
                <a href={site.scholar} target="_blank" rel="noreferrer" className="mobile-sublink">
                  Google Scholar ↗
                </a>
                <a href={site.github} target="_blank" rel="noreferrer" className="mobile-sublink">
                  GitHub ↗
                </a>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
