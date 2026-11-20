// Prepare only the page a visitor points to or focuses, keeping the initial
// download small. A failed optional prefetch must not interrupt navigation.
const pages: Record<string, () => Promise<unknown>> = {
  '/contests': () => import('@/pages/Contests'),
  '/tasks': () => import('@/pages/Tasks'),
  '/team': () => import('@/pages/Team'),
  '/blogs': () => import('@/pages/Blogs'),
  '/resources': () => import('@/pages/Resources'),
  '/roadmap': () => import('@/pages/Roadmap'),
  '/become-setter': () => import('@/pages/BecomeSetter'),
};
const requested = new Set<string>();

export function prefetchPage(path: string) {
  const load = pages[path];
  if (!load || requested.has(path)) return;
  requested.add(path);
  void load().catch(() => { requested.delete(path); });
}
