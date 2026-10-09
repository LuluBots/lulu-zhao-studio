"use client";

import { useEffect } from "react";

const scripts = [
  "/severance/audio-controller.js?v=20260909-2",
  "/severance/severance-config.js?v=20260909-2",
  "/severance/severance.js?v=20260909-2",
];

export function SeveranceRuntime() {
  useEffect(() => {
    let cancelled = false;
    const mountedScripts: HTMLScriptElement[] = [];

    async function loadScripts() {
      for (const src of scripts) {
        if (cancelled) return;
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = src;
          script.async = false;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error(`Unable to load ${src}`));
          document.body.appendChild(script);
          mountedScripts.push(script);
        });
      }
    }

    loadScripts().catch(() => {
      const app = document.querySelector("#app");
      if (app) app.textContent = "The experience could not be loaded. Please refresh.";
    });

    return () => {
      cancelled = true;
      window.AIAudioController?.stopAll?.();
      mountedScripts.forEach((script) => script.remove());
    };
  }, []);

  return (
    <div className="severance-shell">
      <link rel="stylesheet" href="/severance/severance.css?v=20260909-2" />
      <a className="skip" href="#app">Skip to experiment</a>
      <header className="masthead">
        <a href="/severance">WHAT CROSSES?</a>
        <div className="masthead-actions">
          <button className="text-button" id="changeKeyButton" type="button" hidden>
            USE ANOTHER KEY
          </button>
          <button className="text-button" id="documentationButton" type="button">
            DOCUMENTATION
          </button>
        </div>
      </header>
      <main id="app" tabIndex={-1} aria-live="polite">
        <p className="loading-state">Preparing the machine…</p>
      </main>
    </div>
  );
}

declare global {
  interface Window {
    AIAudioController?: { stopAll?: () => void };
  }
}
