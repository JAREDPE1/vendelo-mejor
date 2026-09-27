"use client";

import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  chooseConsent,
  getConsentSnapshot,
  getServerConsentSnapshot,
  initializeConsent,
  openCookieSettings,
  subscribeConsent,
  type AnalyticsConsent,
} from "@/lib/cookie-consent";

function useConsent() {
  return useSyncExternalStore(subscribeConsent, getConsentSnapshot, getServerConsentSnapshot);
}

export function CookieSettingsButton() {
  const { choice, ready, settingsOpen } = useConsent();
  return (
    <button
      id="cookie-settings-button"
      type="button"
      className="cookie-settings-link"
      aria-controls="cookie-consent-panel"
      aria-expanded={ready && (choice === null || settingsOpen)}
      onClick={openCookieSettings}
    >
      Configurar cookies
    </button>
  );
}

export function CookieConsent() {
  const { choice, ready, settingsOpen } = useConsent();
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(initializeConsent, []);
  useEffect(() => {
    if (settingsOpen) headingRef.current?.focus();
  }, [ready, settingsOpen]);

  function choose(value: AnalyticsConsent) {
    chooseConsent(value);
    if (settingsOpen) document.getElementById("cookie-settings-button")?.focus();
  }

  if (!ready || (choice !== null && !settingsOpen)) return null;

  return (
    <section
      id="cookie-consent-panel"
      className="cookie-consent"
      aria-labelledby="cookie-consent-heading"
      aria-describedby="cookie-consent-description"
    >
      <div className="cookie-consent-copy">
        <h2 id="cookie-consent-heading" ref={headingRef} tabIndex={-1}>
          Tú decides sobre la analítica
        </h2>
        <p id="cookie-consent-description">
          Si aceptas, usaremos Google Analytics para conocer cómo se utiliza la web y mejorarla.
          Puedes rechazarlo y seguir usando todas las herramientas.{" "}
          <Link href="/cookies">Información sobre cookies</Link>.
        </p>
        {settingsOpen && choice && (
          <p className="cookie-consent-current">
            Tu elección actual:{" "}
            {choice === "accepted" ? "analítica aceptada" : "analítica rechazada"}.
          </p>
        )}
      </div>
      <div className="cookie-consent-actions">
        <button className="button button-primary" type="button" onClick={() => choose("accepted")}>
          Aceptar analítica
        </button>
        <button className="button button-outline" type="button" onClick={() => choose("rejected")}>
          Rechazar
        </button>
      </div>
    </section>
  );
}
