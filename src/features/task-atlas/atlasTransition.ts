import { flushSync } from 'react-dom';
import type { NavigateFunction } from 'react-router-dom';
import type { TransitionPoint } from './MapCanvas';

type Seed = { x: number; y: number; radius: number };
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
let cancelTransition: (() => void) | undefined;
let pendingEntry: Map<number, Seed> | undefined;

function buttonSeeds(link: Element) {
  return new Map([...link.querySelectorAll<SVGCircleElement>('circle[data-cluster]')].map(dot => {
    const bounds = dot.getBoundingClientRect();
    return [Number(dot.dataset.cluster), { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2, radius: bounds.width / 2 }];
  }));
}

function play(animations: Animation[], cleanup: () => void) {
  let preparation = 0;
  const cancel = () => {
    cancelAnimationFrame(preparation);
    animations.forEach(animation => animation.cancel());
    cleanup();
    window.removeEventListener('popstate', cancel);
    window.removeEventListener('resize', cancel);
    document.removeEventListener('visibilitychange', cancel);
    if (cancelTransition === cancel) cancelTransition = undefined;
  };
  cancelTransition = cancel;
  window.addEventListener('popstate', cancel, { once: true });
  window.addEventListener('resize', cancel, { once: true });
  document.addEventListener('visibilitychange', cancel, { once: true });
  // Paint the start positions first; advance every dot on the same compositor timeline.
  animations.forEach(animation => { animation.pause(); animation.currentTime = 0; });
  preparation = requestAnimationFrame(() => {
    preparation = requestAnimationFrame(() => {
      const start = document.timeline.currentTime;
      animations.forEach(animation => { animation.play(); animation.startTime = start; });
    });
  });
  void Promise.all(animations.map(animation => animation.finished.catch(() => {}))).then(() => {
    if (cancelTransition === cancel) cancel();
  });
  return cancel;
}

function overlay(bounds: DOMRect) {
  const element = document.createElement('div');
  element.dataset.atlasFlight = '';
  element.setAttribute('aria-hidden', 'true');
  Object.assign(element.style, {
    position: 'fixed', left: `${bounds.left}px`, top: `${bounds.top}px`,
    width: `${bounds.width}px`, height: `${bounds.height}px`,
    overflow: 'hidden', pointerEvents: 'none', zIndex: '40',
  });
  return element;
}

function flyPoints(points: TransitionPoint[], seeds: Map<number, Seed>, bounds: DOMRect, ground: string, reverse = false) {
  const layer = overlay(bounds);
  const animations: Animation[] = [];
  const duration = 600;
  for (const point of points) {
    const seed = seeds.get(point.cluster);
    if (!seed) continue;
    // Endpoint geometry comes directly from MapCanvas, including the current pan/zoom.
    // Position each dot once; the browser moves it without a JavaScript drawing loop.
    const dot = document.createElement('span');
    dot.dataset.atlasPoint = String(point.id);
    const radius = point.radius + 0.35;
    Object.assign(dot.style, {
      position: 'absolute', left: '0', top: '0', width: `${radius * 2}px`, height: `${radius * 2}px`,
      borderRadius: '50%', background: point.color, border: `0.7px solid ${ground}`, boxSizing: 'border-box',
    });
    const compact = {
      transform: `translate3d(${seed.x - bounds.left - radius}px, ${seed.y - bounds.top - radius}px, 0) scale(${seed.radius / radius})`,
      opacity: 1,
    };
    const expanded = { transform: `translate3d(${point.x - radius}px, ${point.y - radius}px, 0) scale(1)`, opacity: point.opacity };
    layer.append(dot);
    animations.push(dot.animate(reverse ? [expanded, compact] : [compact, expanded], {
      duration, easing: 'cubic-bezier(.37,0,.63,1)', fill: 'both',
    }));
  }
  return { layer, animations, duration };
}

export async function openAtlas(link: HTMLAnchorElement, navigate: NavigateFunction, returnTo: string) {
  await import('./TaskAtlas');
  if (!link.isConnected) return;
  cancelTransition?.();
  pendingEntry = reducedMotion() ? undefined : buttonSeeds(link);
  flushSync(() => navigate('/tasks/atlas', { state: { returnTo } }));
}

// Called only after both actual map layers are drawn at their final dimensions.
export function animateAtlasEntry(canvas: HTMLCanvasElement, points: TransitionPoint[]) {
  const seeds = pendingEntry;
  pendingEntry = undefined;
  if (!seeds?.size || !points.length || reducedMotion()) return;
  const bounds = canvas.getBoundingClientRect();
  const ground = getComputedStyle(canvas.parentElement!).backgroundColor;
  const { layer, animations, duration } = flyPoints(points, seeds, bounds, ground);
  layer.style.zIndex = '0';
  canvas.parentElement!.append(layer);
  // Keep the live map hidden until each marker has arrived at exactly its canvas position.
  canvas.style.opacity = '0';
  const controls = [...document.querySelectorAll<HTMLElement>('.cluster-search-area, .cluster-zoom')];
  const locked = [canvas, ...controls];
  const inertStates = locked.map(element => element.inert);
  locked.forEach(element => { element.inert = true; });
  const labels = document.querySelector<HTMLCanvasElement>('.cluster-labels');
  if (labels) animations.push(labels.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: 100, delay: duration - 60, easing: 'ease-out', fill: 'both',
  }));
  document.querySelectorAll('.cluster-heading, .cluster-search-area, .cluster-zoom').forEach(element => {
    animations.push(element.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 100, delay: duration - 100, easing: 'ease-out', fill: 'both',
    }));
  });
  // Swap identical endpoint geometry in one frame, after the text fade. No zoom cut.
  play(animations, () => {
    canvas.style.removeProperty('opacity');
    locked.forEach((element, index) => { element.inert = inertStates[index]; });
    layer.remove();
  });
}

export function closeAtlas(navigate: NavigateFunction, returnTo: string, points: TransitionPoint[]) {
  pendingEntry = undefined;
  const canvas = document.querySelector<HTMLCanvasElement>('.cluster-stage canvas');
  if (!canvas || !points.length || reducedMotion()) { cancelTransition?.(); navigate(returnTo); return; }
  const bounds = canvas.getBoundingClientRect();
  const labels = document.querySelector<HTMLCanvasElement>('.cluster-labels');
  const labelOpacity = labels ? Number(getComputedStyle(labels).opacity) : 0;
  // Reversing mid-flight starts at the dots' visible positions, without snapping
  // them to the finished map first.
  const moving = new Map([...document.querySelectorAll<HTMLElement>('[data-atlas-point]')].map(dot => [Number(dot.dataset.atlasPoint), dot]));
  points = points.map(point => {
    const dot = moving.get(point.id);
    if (!dot) return point;
    const box = dot.getBoundingClientRect();
    return { ...point, x: box.left + box.width / 2 - bounds.left, y: box.top + box.height / 2 - bounds.top, radius: Math.max(0.5, box.width / 2 - 0.35), opacity: Number(getComputedStyle(dot).opacity) };
  });
  cancelTransition?.();
  const ground = getComputedStyle(canvas.parentElement!).backgroundColor;
  // Labels fade away while the actual visible dots return to their matching button dots.
  const textCopy = document.createElement('canvas');
  if (labels) {
    textCopy.width = labels.width;
    textCopy.height = labels.height;
    const context = textCopy.getContext('2d');
    if (context) { context.globalAlpha = labelOpacity; context.drawImage(labels, 0, 0); }
  }
  Object.assign(textCopy.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', zIndex: '1' });
  flushSync(() => navigate(returnTo));
  const link = document.querySelector('[data-atlas-entry]');
  const icon = link?.querySelector<SVGSVGElement>('svg');
  if (!link || !icon) return;
  const seeds = buttonSeeds(link);
  const { layer, animations, duration } = flyPoints(points, seeds, bounds, ground, true);
  const backdrop = overlay(bounds);
  backdrop.style.background = ground;
  layer.prepend(textCopy);
  document.body.append(backdrop, layer);
  animations.push(textCopy.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: 'both' }));
  animations.push(backdrop.animate([{ opacity: 1 }, { opacity: 0 }], { duration, easing: 'ease-in-out', fill: 'both' }));
  icon.style.opacity = '0';
  play(animations, () => { icon.style.removeProperty('opacity'); layer.remove(); backdrop.remove(); });
}
