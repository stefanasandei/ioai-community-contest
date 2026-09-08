import { flushSync } from 'react-dom';
import type { NavigateFunction } from 'react-router-dom';
import './task-atlas.css';

export type AtlasLaunch = { x: number; y: number; at: number };

export async function openAtlas(link: HTMLAnchorElement, navigate: NavigateFunction, returnTo: string) {
  // Preload before capturing the outgoing page so loading cannot interrupt the reveal.
  await import('./TaskAtlas');
  if (!link.isConnected) return;
  const bounds = (link.querySelector('svg') ?? link).getBoundingClientRect();
  const launch: AtlasLaunch = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2, at: Date.now() };
  const changePage = () => flushSync(() => navigate('/tasks/atlas', { state: { returnTo, atlasLaunch: launch } }));
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !document.startViewTransition) {
    changePage();
    return;
  }
  document.documentElement.dataset.atlasTransition = 'true';
  try {
    await document.startViewTransition(changePage).finished;
  } finally {
    delete document.documentElement.dataset.atlasTransition;
  }
}
