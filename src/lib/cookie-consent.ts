import { createAnalyticsController } from "./analytics-consent.ts";

export const CONSENT_STORAGE_KEY = "vendelo-mejor:analytics-consent";
export type AnalyticsConsent = "accepted" | "rejected";

export interface ConsentSnapshot {
  choice: AnalyticsConsent | null;
  ready: boolean;
  settingsOpen: boolean;
}

const initialSnapshot: ConsentSnapshot = { choice: null, ready: false, settingsOpen: false };
let snapshot = initialSnapshot;
const listeners = new Set<() => void>();
let analytics: ReturnType<typeof createAnalyticsController> | undefined;

export function parseConsent(value: string | null): AnalyticsConsent | null {
  return value === "accepted" || value === "rejected" ? value : null;
}

export function readConsent(storage: Pick<Storage, "getItem">): AnalyticsConsent | null {
  try {
    return parseConsent(storage.getItem(CONSENT_STORAGE_KEY));
  } catch {
    return null;
  }
}

function updateSnapshot(next: ConsentSnapshot) {
  snapshot = next;
  for (const listener of listeners) listener();
}

export function subscribeConsent(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const getConsentSnapshot = () => snapshot;
export const getServerConsentSnapshot = () => initialSnapshot;

export function initializeConsent() {
  analytics ??= createAnalyticsController(window, document);
  const restore = () => {
    let choice: AnalyticsConsent | null = null;
    try {
      choice = readConsent(window.localStorage);
    } catch {
      // Access to localStorage itself can be denied by the browser.
    }
    analytics?.setEnabled(choice === "accepted");
    updateSnapshot({ ...snapshot, choice, ready: true });
  };
  restore();
  const synchronize = (event: StorageEvent) => {
    if (event.key === CONSENT_STORAGE_KEY || event.key === null) restore();
  };
  window.addEventListener("storage", synchronize);
  return () => window.removeEventListener("storage", synchronize);
}

export function chooseConsent(choice: AnalyticsConsent) {
  // Apply revocation synchronously, even if persistence is unavailable.
  analytics ??= createAnalyticsController(window, document);
  analytics.setEnabled(choice === "accepted");
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Keep this explicit choice in memory; a fresh visit will ask again.
  }
  updateSnapshot({ choice, ready: true, settingsOpen: false });
}

export function openCookieSettings() {
  updateSnapshot({ ...snapshot, settingsOpen: true });
}
