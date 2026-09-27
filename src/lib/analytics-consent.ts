export const ANALYTICS_ID = "G-BH9WL8Z1EN";
export const ANALYTICS_SCRIPT_ID = "consented-google-analytics";
export const ANALYTICS_DISABLE_KEY = `ga-disable-${ANALYTICS_ID}` as const;

export interface AnalyticsBrowser {
  location: { hostname: string };
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  [ANALYTICS_DISABLE_KEY]?: boolean;
}

const deniedConsent = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};

function clearAnalyticsCookies(browser: AnalyticsBrowser, document: Document) {
  // Include parent domains used by the previous automatic GA installation.
  const parts = browser.location.hostname.split(".");
  const domains = ["", ...parts.map((_, index) => parts.slice(index).join("."))];
  try {
    const names = document.cookie.split(";").map((cookie) => cookie.trim().split("=")[0]);
    for (const name of ["_ga", `_ga_${ANALYTICS_ID.slice(2)}`]) {
      if (!names.includes(name)) continue;
      for (const domain of domains) {
        document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${domain ? `; Domain=${domain}` : ""}`;
      }
    }
  } catch {
    // A blocked cookie API must not prevent the opt-out flag from taking effect.
  }
}

/** Basic opt-in: no Google script, queue or request exists before acceptance. */
export function createAnalyticsController(browser: AnalyticsBrowser, document: Document) {
  let enabled = false;
  let initialized = false;
  let script: HTMLScriptElement | null = null;

  function initialize() {
    if (!enabled || initialized) return;
    browser.gtag?.("consent", "default", deniedConsent);
    browser.gtag?.("consent", "update", { analytics_storage: "granted" });
    browser.gtag?.("js", new Date());
    browser.gtag?.("config", ANALYTICS_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    initialized = true;
  }

  return {
    setEnabled(next: boolean) {
      // Removing a script cannot undo executed code. Google's opt-out flag also
      // blocks future cookies and transmissions from a previously loaded tag:
      // https://developers.google.com/tag-platform/security/guides/privacy
      browser[ANALYTICS_DISABLE_KEY] = !next;
      if (!next) {
        if (enabled && initialized) browser.gtag?.("consent", "update", deniedConsent);
        enabled = false;
        if (script) {
          script.onload = null;
          script.onerror = null;
          script.remove();
          script = null;
        }
        clearAnalyticsCookies(browser, document);
        return;
      }
      if (enabled && (initialized || script)) return;
      enabled = true;
      if (initialized) {
        browser.gtag?.("consent", "update", { analytics_storage: "granted" });
        return;
      }
      browser.dataLayer ??= [];
      browser.gtag ??= function () {
        // gtag's command queue uses the Arguments object, as in Google's snippet.
        // eslint-disable-next-line prefer-rest-params -- Preserve gtag's command protocol.
        browser.dataLayer?.push(arguments);
      };
      const pendingScript = document.createElement("script");
      pendingScript.id = ANALYTICS_SCRIPT_ID;
      pendingScript.async = true;
      pendingScript.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`;
      // A late load after revocation must never initialize measurement.
      pendingScript.onload = () => {
        if (script === pendingScript) initialize();
      };
      pendingScript.onerror = () => {
        if (script !== pendingScript) return;
        pendingScript.remove();
        script = null;
      };
      script = pendingScript;
      document.head.appendChild(pendingScript);
    },
  };
}
