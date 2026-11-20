const reloadKey = 'aicc:page-load-recovery';
const reloadCooldown = 60_000;

interface Browser {
  readonly sessionStorage: Pick<Storage, 'getItem' | 'setItem'>;
  readonly navigator: Pick<Navigator, 'onLine'>;
  readonly location: Pick<Location, 'reload'>;
}

// Old tabs can request chunks removed by a new deployment. A full navigation
// fetches the current entry point and clears the browser's failed import cache.
// Call only after a visible page fails, never for speculative hover prefetches.
export function recoverPageLoad(error: unknown, browser: Browser = window, now = Date.now()): boolean {
  if (!(error instanceof Error) || !/Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Loading (?:CSS )?chunk \S+ failed|Unable to preload CSS/i.test(error.message)) {
    return false;
  }
  if (!browser.navigator.onLine) return false;

  try {
    const previous = browser.sessionStorage.getItem(reloadKey);
    // Persist across reloads and routes so a missing file cannot cause a loop.
    if (previous !== null && now - Number(previous) < reloadCooldown) return false;
    browser.sessionStorage.setItem(reloadKey, String(now));
  } catch {
    // Without persistent storage we cannot safely guard an automatic reload.
    return false;
  }

  browser.location.reload();
  return true;
}
