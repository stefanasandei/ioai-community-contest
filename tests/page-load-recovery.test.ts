import assert from 'node:assert/strict';
import { test } from 'node:test';
import { recoverPageLoad } from '../src/lib/recoverPageLoad.ts';

function makeBrowser() {
  const values = new Map<string, string>();
  return {
    sessionStorage: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value); },
    },
    navigator: { onLine: true },
    location: { reload() { this.reloads++; }, reloads: 0 },
  };
}

const missingChunk = new TypeError('Failed to fetch dynamically imported module: https://example.com/assets/Team-old.js');

test('a stale page reloads once; a persistent failure cannot loop across routes or reloads', () => {
  const browser = makeBrowser();
  assert.equal(recoverPageLoad(missingChunk, browser, 100_000), true);
  const afterReload = { ...browser, location: { reload() { this.reloads++; }, reloads: 0 } };
  assert.equal(recoverPageLoad(missingChunk, afterReload, 100_100), false);
  assert.equal(recoverPageLoad(new Error('Unable to preload CSS for /assets/Tasks-old.css'), afterReload, 100_200), false);
  assert.equal(browser.location.reloads, 1);
  assert.equal(afterReload.location.reloads, 0);
  // A later deployment can recover again in the same tab.
  assert.equal(recoverPageLoad(missingChunk, afterReload, 161_000), true);
  assert.equal(afterReload.location.reloads, 1);
});

test('offline pages and ordinary render errors do not trigger automatic reloads', () => {
  const browser = makeBrowser();
  browser.navigator.onLine = false;
  assert.equal(recoverPageLoad(missingChunk, browser), false);
  browser.navigator.onLine = true;
  for (const error of [new TypeError('Cannot read properties of undefined'), new Error('Failed to fetch'), null]) {
    assert.equal(recoverPageLoad(error, browser), false);
  }
  assert.equal(browser.location.reloads, 0);
});

test('blocked storage leaves manual recovery available instead of risking a reload loop', () => {
  for (const method of ['getItem', 'setItem'] as const) {
    const browser = makeBrowser();
    browser.sessionStorage[method] = () => { throw new Error('Storage blocked'); };
    assert.equal(recoverPageLoad(missingChunk, browser), false);
    assert.equal(browser.location.reloads, 0);
  }
});

test('recognizes browser module and stylesheet download failures', () => {
  for (const message of [
    'Importing a module script failed.',
    'error loading dynamically imported module: https://example.com/assets/Team-old.js',
    'Loading chunk 42 failed.',
    'Loading CSS chunk 42 failed.',
    'Unable to preload CSS for /assets/Team-old.css',
  ]) {
    const browser = makeBrowser();
    assert.equal(recoverPageLoad(new Error(message), browser), true, message);
    assert.equal(browser.location.reloads, 1);
  }
});
