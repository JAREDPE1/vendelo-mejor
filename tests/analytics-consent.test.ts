import assert from "node:assert/strict";
import test from "node:test";
import {
  ANALYTICS_DISABLE_KEY,
  ANALYTICS_ID,
  ANALYTICS_SCRIPT_ID,
  createAnalyticsController,
  type AnalyticsBrowser,
} from "../src/lib/analytics-consent.ts";

function commands(browser: AnalyticsBrowser): unknown[][] {
  return (browser.dataLayer ?? []).map((entry) => Array.from(entry as ArrayLike<unknown>));
}

function analyticsFixture(options: { blockedCookies?: boolean } = {}) {
  const browser: AnalyticsBrowser = { location: { hostname: "www.vendelomejor.test" } };
  const scripts: HTMLScriptElement[] = [];
  const attached = new Set<HTMLScriptElement>();
  const appendState: { queueReady: boolean; commandNames: unknown[] }[] = [];
  const cookieValues = new Map([
    ["_ga", "GA1.1.123.456"],
    ["_ga_BH9WL8Z1EN", "GS2.1.123"],
    ["session", "keep-session"],
    ["theme", "dark"],
    ["_ga_OTHERPROPERTY", "keep-other-property"],
  ]);
  const cookieWrites: string[] = [];
  const document = {
    get cookie() {
      if (options.blockedCookies) throw new Error("Cookies are blocked");
      return [...cookieValues].map(([name, value]) => `${name}=${value}`).join("; ");
    },
    set cookie(value: string) {
      if (options.blockedCookies) throw new Error("Cookies are blocked");
      cookieWrites.push(value);
      if (value.includes("Max-Age=0")) cookieValues.delete(value.split("=")[0]);
    },
    createElement(tag: string) {
      assert.equal(tag, "script");
      const script = {
        id: "",
        src: "",
        async: false,
        onload: null,
        onerror: null,
        remove() { attached.delete(script); },
      } as unknown as HTMLScriptElement;
      scripts.push(script);
      return script;
    },
    head: {
      appendChild(script: HTMLScriptElement) {
        appendState.push({
          queueReady: Array.isArray(browser.dataLayer) && typeof browser.gtag === "function",
          commandNames: commands(browser).map(([command]) => command),
        });
        attached.add(script);
        return script;
      },
    },
  } as unknown as Document;
  const controller = createAnalyticsController(browser, document);
  return { browser, controller, scripts, attached, appendState, cookieValues, cookieWrites };
}

function load(script: HTMLScriptElement) {
  script.onload?.call(script, new Event("load"));
}

test("unknown and rejected consent create neither Google script nor command queue", () => {
  const fixture = analyticsFixture();
  assert.equal(fixture.scripts.length, 0);
  assert.equal(fixture.browser.dataLayer, undefined);
  assert.equal(fixture.browser.gtag, undefined);
  fixture.controller.setEnabled(false);
  fixture.controller.setEnabled(false);
  assert.equal(fixture.scripts.length, 0);
  assert.equal(fixture.browser.dataLayer, undefined);
  assert.equal(fixture.browser.gtag, undefined);
  assert.equal(fixture.browser[ANALYTICS_DISABLE_KEY], true);
});

test("acceptance prepares the queue before appending the exact script and configures only after load", () => {
  const fixture = analyticsFixture();
  fixture.controller.setEnabled(true);
  assert.equal(ANALYTICS_ID, "G-BH9WL8Z1EN");
  assert.equal(ANALYTICS_SCRIPT_ID, "consented-google-analytics");
  assert.equal(fixture.scripts.length, 1);
  const script = fixture.scripts[0];
  assert.equal(script.id, "consented-google-analytics");
  assert.equal(script.src, "https://www.googletagmanager.com/gtag/js?id=G-BH9WL8Z1EN");
  assert.equal(script.async, true);
  assert.equal(fixture.attached.size, 1);
  assert.equal(fixture.browser[ANALYTICS_DISABLE_KEY], false);
  assert.equal(fixture.appendState[0].queueReady, true);
  assert.ok(!fixture.appendState[0].commandNames.includes("config"));
  assert.ok(!commands(fixture.browser).some(([command]) => command === "config"));

  load(script);
  const recorded = commands(fixture.browser);
  assert.deepEqual(recorded.filter(([command]) => command === "config"), [[
    "config", "G-BH9WL8Z1EN", { allow_google_signals: false, allow_ad_personalization_signals: false },
  ]]);
  assert.ok(recorded.some(([command, value]) => command === "js" && value instanceof Date));
  assert.deepEqual(recorded.find(([command, mode]) => command === "consent" && mode === "default"), [
    "consent", "default", {
      analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
    },
  ]);
});

test("repeated acceptance and load callbacks never duplicate a script or configuration", () => {
  const fixture = analyticsFixture();
  fixture.controller.setEnabled(true);
  fixture.controller.setEnabled(true);
  assert.equal(fixture.scripts.length, 1);
  load(fixture.scripts[0]);
  fixture.controller.setEnabled(true);
  load(fixture.scripts[0]);
  assert.equal(fixture.scripts.length, 1);
  assert.equal(commands(fixture.browser).filter(([command]) => command === "config").length, 1);
});

test("revocation synchronously opts out, removes the tag and deletes only this property's GA cookies", () => {
  const fixture = analyticsFixture();
  fixture.controller.setEnabled(true);
  load(fixture.scripts[0]);
  fixture.controller.setEnabled(false);
  assert.equal(fixture.browser[ANALYTICS_DISABLE_KEY], true);
  assert.equal(fixture.attached.size, 0);
  assert.equal(fixture.scripts[0].onload, null);
  assert.equal(fixture.scripts[0].onerror, null);
  assert.deepEqual(commands(fixture.browser).at(-1), [
    "consent", "update", {
      analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
    },
  ]);
  assert.deepEqual([...fixture.cookieValues], [
    ["session", "keep-session"], ["theme", "dark"], ["_ga_OTHERPROPERTY", "keep-other-property"],
  ]);
  assert.ok(fixture.cookieWrites.length > 0);
  for (const cookie of fixture.cookieWrites) {
    assert.match(cookie, /^_ga(?:_BH9WL8Z1EN)?=; Max-Age=0; Path=\//u);
  }
  assert.ok(fixture.cookieWrites.some((cookie) => cookie.includes("Domain=www.vendelomejor.test")));
  assert.ok(fixture.cookieWrites.some((cookie) => cookie.includes("Domain=vendelomejor.test")));
  assert.ok(fixture.cookieWrites.some((cookie) => !cookie.includes("Domain=")));
});

test("a late script load after revocation cannot configure analytics", () => {
  const fixture = analyticsFixture();
  fixture.controller.setEnabled(true);
  const pending = fixture.scripts[0];
  const delayedLoad = pending.onload;
  fixture.controller.setEnabled(false);
  delayedLoad?.call(pending, new Event("load"));
  assert.equal(fixture.browser[ANALYTICS_DISABLE_KEY], true);
  assert.equal(fixture.attached.size, 0);
  assert.ok(!commands(fixture.browser).some(([command]) => command === "config"));
});

test("acceptance after rejecting a pending script creates a fresh load and ignores stale callbacks", () => {
  const fixture = analyticsFixture();
  fixture.controller.setEnabled(true);
  const stale = fixture.scripts[0];
  const delayedLoad = stale.onload;
  fixture.controller.setEnabled(false);
  fixture.controller.setEnabled(true);
  assert.equal(fixture.scripts.length, 2);
  assert.equal(fixture.attached.size, 1);
  delayedLoad?.call(stale, new Event("load"));
  assert.ok(!commands(fixture.browser).some(([command]) => command === "config"));
  load(fixture.scripts[1]);
  assert.equal(fixture.browser[ANALYTICS_DISABLE_KEY], false);
  assert.equal(commands(fixture.browser).filter(([command]) => command === "config").length, 1);
});

test("reaccepting an already loaded tag restores consent without reconfiguring it", () => {
  const fixture = analyticsFixture();
  fixture.controller.setEnabled(true);
  load(fixture.scripts[0]);
  fixture.controller.setEnabled(false);
  fixture.controller.setEnabled(true);
  assert.equal(fixture.browser[ANALYTICS_DISABLE_KEY], false);
  assert.equal(fixture.scripts.length, 1);
  assert.equal(commands(fixture.browser).filter(([command]) => command === "config").length, 1);
  assert.deepEqual(commands(fixture.browser).at(-1), ["consent", "update", { analytics_storage: "granted" }]);
});

test("a failed loader can retry without stale callbacks initializing the previous script", () => {
  const fixture = analyticsFixture();
  fixture.controller.setEnabled(true);
  const failed = fixture.scripts[0];
  const staleLoad = failed.onload;
  const staleError = failed.onerror;
  failed.onerror?.call(failed, new Event("error"));
  assert.equal(fixture.attached.size, 0);
  fixture.controller.setEnabled(true);
  assert.equal(fixture.scripts.length, 2);
  staleLoad?.call(failed, new Event("load"));
  staleError?.call(failed, new Event("error"));
  assert.equal(fixture.attached.size, 1);
  assert.ok(!commands(fixture.browser).some(([command]) => command === "config"));
  load(fixture.scripts[1]);
  assert.equal(commands(fixture.browser).filter(([command]) => command === "config").length, 1);
});

test("blocked cookie access never prevents synchronous revocation", () => {
  const fixture = analyticsFixture({ blockedCookies: true });
  fixture.controller.setEnabled(true);
  load(fixture.scripts[0]);
  assert.doesNotThrow(() => fixture.controller.setEnabled(false));
  assert.equal(fixture.browser[ANALYTICS_DISABLE_KEY], true);
  assert.equal(fixture.attached.size, 0);
});
