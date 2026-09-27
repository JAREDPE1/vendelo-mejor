import assert from "node:assert/strict";
import test from "node:test";
import { ANALYTICS_DISABLE_KEY, type AnalyticsBrowser } from "../src/lib/analytics-consent.ts";
import { CONSENT_STORAGE_KEY, parseConsent, readConsent } from "../src/lib/cookie-consent.ts";

type ConsentModule = typeof import("../src/lib/cookie-consent.ts");
interface FixtureOptions {
  values?: Map<string, string>;
  readError?: boolean;
  writeError?: boolean;
  accessError?: boolean;
}

function cookieFixture(options: FixtureOptions) {
  const values = options.values ?? new Map<string, string>();
  const scripts: HTMLScriptElement[] = [];
  const attached = new Set<HTMLScriptElement>();
  const listeners = new Set<(event: StorageEvent) => void>();
  const writes: [string, string][] = [];
  const storage = {
    getItem(key: string) {
      if (options.readError) throw new Error("Reading storage is blocked");
      return values.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      if (options.writeError) throw new Error("Writing storage is blocked");
      writes.push([key, value]);
      values.set(key, value);
    },
  };
  const browser: AnalyticsBrowser & {
    readonly localStorage: typeof storage;
    addEventListener(type: string, listener: (event: StorageEvent) => void): void;
    removeEventListener(type: string, listener: (event: StorageEvent) => void): void;
  } = {
    location: { hostname: "vendelomejor.test" },
    get localStorage() {
      if (options.accessError) throw new Error("Storage access is blocked");
      return storage;
    },
    addEventListener(type, listener) {
      assert.equal(type, "storage");
      listeners.add(listener);
    },
    removeEventListener(type, listener) {
      assert.equal(type, "storage");
      listeners.delete(listener);
    },
  };
  const document = {
    cookie: "",
    createElement(tag: string) {
      assert.equal(tag, "script");
      const script = {
        id: "", src: "", async: false, onload: null, onerror: null,
        remove() { attached.delete(script); },
      } as unknown as HTMLScriptElement;
      scripts.push(script);
      return script;
    },
    head: { appendChild(script: HTMLScriptElement) { attached.add(script); return script; } },
  } as unknown as Document;
  function dispatchStorage(key: string | null) {
    for (const listener of listeners) listener({ key } as StorageEvent);
  }
  return { browser, document, values, writes, scripts, attached, listeners, dispatchStorage };
}

// Each module instance represents a fresh page. Browser globals are restored
// even on failure; node:test runs this file's top-level tests sequentially.
let pageNumber = 0;
async function withStore(
  options: FixtureOptions,
  run: (store: ConsentModule, fixture: ReturnType<typeof cookieFixture>) => void | Promise<void>,
) {
  const fixture = cookieFixture(options);
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const previousDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  Object.defineProperty(globalThis, "window", { configurable: true, value: fixture.browser });
  Object.defineProperty(globalThis, "document", { configurable: true, value: fixture.document });
  try {
    const url = new URL("../src/lib/cookie-consent.ts", import.meta.url);
    url.searchParams.set("test-page", String(++pageNumber));
    const store: ConsentModule = await import(url.href);
    await run(store, fixture);
  } finally {
    if (previousWindow) Object.defineProperty(globalThis, "window", previousWindow);
    else Reflect.deleteProperty(globalThis, "window");
    if (previousDocument) Object.defineProperty(globalThis, "document", previousDocument);
    else Reflect.deleteProperty(globalThis, "document");
  }
}

test("stored consent parsing recognizes only the exact explicit choices", () => {
  assert.equal(parseConsent("accepted"), "accepted");
  assert.equal(parseConsent("rejected"), "rejected");
  for (const value of [null, "", "true", "false", "unknown", "ACCEPTED", " accepted ", '{"choice":"accepted"}']) {
    assert.equal(parseConsent(value), null, String(value));
  }
});

test("reading consent uses its own storage key and safely rejects invalid or inaccessible data", () => {
  assert.equal(readConsent({ getItem(key) { assert.equal(key, CONSENT_STORAGE_KEY); return "accepted"; } }), "accepted");
  assert.equal(readConsent({ getItem() { return "rejected"; } }), "rejected");
  assert.equal(readConsent({ getItem() { return "unexpected"; } }), null);
  assert.equal(readConsent({ getItem() { throw new Error("Storage blocked"); } }), null);
});

test("a new visit remains untracked while unknown consent becomes ready", async () => {
  await withStore({}, (store, fixture) => {
    assert.deepEqual(store.getConsentSnapshot(), { choice: null, ready: false, settingsOpen: false });
    const cleanup = store.initializeConsent();
    assert.deepEqual(store.getConsentSnapshot(), { choice: null, ready: true, settingsOpen: false });
    assert.equal(fixture.scripts.length, 0);
    assert.equal(fixture.browser.dataLayer, undefined);
    assert.equal(fixture.browser.gtag, undefined);
    assert.equal(fixture.browser[ANALYTICS_DISABLE_KEY], true);
    assert.equal(fixture.writes.length, 0);
    cleanup();
    assert.equal(fixture.listeners.size, 0);
  });
});

test("both explicit choices persist and are restored on a fresh page", async () => {
  for (const choice of ["accepted", "rejected"] as const) {
    const values = new Map<string, string>();
    await withStore({ values }, (store, fixture) => {
      const cleanup = store.initializeConsent();
      store.chooseConsent(choice);
      assert.equal(values.get(CONSENT_STORAGE_KEY), choice);
      assert.deepEqual(fixture.writes, [[CONSENT_STORAGE_KEY, choice]]);
      assert.deepEqual(store.getConsentSnapshot(), { choice, ready: true, settingsOpen: false });
      assert.equal(fixture.scripts.length, choice === "accepted" ? 1 : 0);
      cleanup();
    });
    await withStore({ values }, (store, fixture) => {
      const cleanup = store.initializeConsent();
      assert.deepEqual(store.getConsentSnapshot(), { choice, ready: true, settingsOpen: false });
      assert.equal(fixture.scripts.length, choice === "accepted" ? 1 : 0);
      assert.equal(fixture.browser[ANALYTICS_DISABLE_KEY], choice !== "accepted");
      assert.equal(fixture.writes.length, 0);
      if (choice === "rejected") assert.equal(fixture.browser.dataLayer, undefined);
      cleanup();
    });
  }
});

test("reopening settings neither changes a saved choice nor starts or stops analytics", async () => {
  for (const choice of ["accepted", "rejected"] as const) {
    await withStore({ values: new Map([[CONSENT_STORAGE_KEY, choice]]) }, (store, fixture) => {
      const cleanup = store.initializeConsent();
      const scriptsBefore = fixture.scripts.length;
      const disabledBefore = fixture.browser[ANALYTICS_DISABLE_KEY];
      store.openCookieSettings();
      assert.deepEqual(store.getConsentSnapshot(), { choice, ready: true, settingsOpen: true });
      assert.equal(fixture.values.get(CONSENT_STORAGE_KEY), choice);
      assert.equal(fixture.writes.length, 0);
      assert.equal(fixture.scripts.length, scriptsBefore);
      assert.equal(fixture.browser[ANALYTICS_DISABLE_KEY], disabledBefore);
      store.chooseConsent(choice);
      assert.equal(store.getConsentSnapshot().settingsOpen, false);
      cleanup();
    });
  }
});

test("invalid stored values and blocked storage APIs leave analytics disabled", async () => {
  for (const options of [
    { values: new Map([[CONSENT_STORAGE_KEY, "invalid"]]) },
    { readError: true },
    { accessError: true },
  ]) {
    await withStore(options, (store, fixture) => {
      const cleanup = store.initializeConsent();
      assert.equal(store.getConsentSnapshot().choice, null);
      assert.equal(store.getConsentSnapshot().ready, true);
      assert.equal(fixture.scripts.length, 0);
      assert.equal(fixture.browser.dataLayer, undefined);
      assert.equal(fixture.browser[ANALYTICS_DISABLE_KEY], true);
      cleanup();
    });
  }
});

test("a storage write failure keeps the in-memory choice and cannot delay revocation", async () => {
  await withStore({ writeError: true }, (store, fixture) => {
    const cleanup = store.initializeConsent();
    assert.doesNotThrow(() => store.chooseConsent("accepted"));
    assert.equal(store.getConsentSnapshot().choice, "accepted");
    const script = fixture.scripts[0];
    script.onload?.call(script, new Event("load"));
    assert.doesNotThrow(() => store.chooseConsent("rejected"));
    assert.equal(store.getConsentSnapshot().choice, "rejected");
    assert.equal(fixture.browser[ANALYTICS_DISABLE_KEY], true);
    assert.equal(fixture.attached.size, 0);
    assert.equal(fixture.values.has(CONSENT_STORAGE_KEY), false);
    cleanup();
  });
});

test("storage events synchronize choices, ignore unrelated keys and detach on cleanup", async () => {
  await withStore({ values: new Map([[CONSENT_STORAGE_KEY, "accepted"]]) }, (store, fixture) => {
    const cleanup = store.initializeConsent();
    const accepted = store.getConsentSnapshot();
    fixture.values.set(CONSENT_STORAGE_KEY, "rejected");
    fixture.dispatchStorage("unrelated-key");
    assert.equal(store.getConsentSnapshot(), accepted);
    fixture.dispatchStorage(CONSENT_STORAGE_KEY);
    assert.equal(store.getConsentSnapshot().choice, "rejected");
    assert.equal(fixture.browser[ANALYTICS_DISABLE_KEY], true);
    assert.equal(fixture.attached.size, 0);
    fixture.values.delete(CONSENT_STORAGE_KEY);
    fixture.dispatchStorage(null);
    assert.equal(store.getConsentSnapshot().choice, null);
    cleanup();
    assert.equal(fixture.listeners.size, 0);
    fixture.values.set(CONSENT_STORAGE_KEY, "accepted");
    fixture.dispatchStorage(CONSENT_STORAGE_KEY);
    assert.equal(store.getConsentSnapshot().choice, null);
  });
});

test("subscriptions stop after unsubscribe and the server snapshot never contains a browser choice", async () => {
  await withStore({}, (store) => {
    let updates = 0;
    const unsubscribe = store.subscribeConsent(() => { updates += 1; });
    const cleanup = store.initializeConsent();
    store.chooseConsent("accepted");
    store.openCookieSettings();
    assert.equal(updates, 3);
    assert.deepEqual(store.getServerConsentSnapshot(), { choice: null, ready: false, settingsOpen: false });
    unsubscribe();
    store.chooseConsent("rejected");
    assert.equal(updates, 3);
    cleanup();
  });
});
