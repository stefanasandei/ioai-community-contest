import { tasks, clusters, fineClusters, colors, labelColors, type MapTask } from './data';

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
type View = { x: number; y: number; zoom: number };
export type TransitionPoint = { id: number; cluster: number; x: number; y: number; radius: number; color: string; opacity: number };
type LabelBox = { x: number; y: number; width: number; height: number; cluster?: number };
const labelGroup = (name: string, group: MapTask[], cluster: number) => {
  const xs = group.map(t => t.x).sort((a, b) => a - b), ys = group.map(t => t.y).sort((a, b) => a - b);
  return { name, group, cluster, x: xs[xs.length >> 1], y: ys[ys.length >> 1] };
};
const coarseLabels = clusters.map(c => labelGroup(c.name, c.tasks, c.id)).sort((a, b) => a.y - b.y);
const fineLabels = fineClusters.map((c, id) => labelGroup(c.n, tasks.filter(t => t.fine === id), c.c)).filter(c => c.group.length);

/** Canvas drawing and view maths adapted from the supplied dependency-free task-map. */
export class MapCanvas {
  private ctx: CanvasRenderingContext2D;
  private labelCtx: CanvasRenderingContext2D;
  private width = 1;
  private height = 1;
  private scale = 1;
  private dpr = 1;
  private view: View = { x: 0.5, y: 0.5, zoom: 1 };
  private active: number | null = null;
  private selected: number | null = null;
  private hover: number | null = null;
  private matches: Set<number> | null = null;
  private frame = 0;
  private animation = 0;
  private events = new AbortController();
  private resize: ResizeObserver;
  private theme: MutationObserver;
  private tip: HTMLDivElement;
  private dark = false;
  private labelHits: LabelBox[] = [];
  private taskLabelHits: (LabelBox & { id: number })[] = [];

  private get originX() { return this.width / 2; }
  private get originY() { return (this.height + (this.width <= 760 ? 110 : 0)) / 2; }

  constructor(private canvas: HTMLCanvasElement, private labelCanvas: HTMLCanvasElement, private onSelect: (task: MapTask) => void, private onZoom: (value: number) => void, private onCluster: (id: number) => void) {
    this.ctx = canvas.getContext('2d')!;
    this.labelCtx = labelCanvas.getContext('2d')!;
    if (!this.ctx || !this.labelCtx) throw new Error('Canvas is unavailable');
    this.tip = document.createElement('div');
    this.tip.className = 'cluster-tooltip';
    this.tip.setAttribute('aria-hidden', 'true');
    canvas.parentElement!.append(this.tip);
    this.resize = new ResizeObserver(() => {
      if (this.resizeCanvas()) this.requestDraw();
    });
    this.resize.observe(canvas);
    this.dark = document.documentElement.classList.contains('dark');
    this.theme = new MutationObserver(() => {
      this.dark = document.documentElement.classList.contains('dark');
      this.requestDraw();
    });
    this.theme.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    this.bind();
    // Produce both layers before the entrance starts, rather than waiting for
    // ResizeObserver and losing the opening frames on a busy device.
    if (this.resizeCanvas()) this.draw();
  }

  private resizeCanvas() {
    // Use layout dimensions: an entrance transform must not resize/clear the bitmap.
    const width = this.canvas.clientWidth, height = this.canvas.clientHeight;
    const dpr = clamp(devicePixelRatio || 1, 1, 2);
    if (!width || !height || (width === this.width && height === this.height && dpr === this.dpr)) return false;
    this.width = width;
    this.height = height;
    this.dpr = dpr;
    this.scale = Math.max(100, Math.min(width - (width > 760 ? 100 : 40), height - (width > 760 ? 100 : 240)));
    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
    this.labelCanvas.width = this.canvas.width;
    this.labelCanvas.height = this.canvas.height;
    return true;
  }

  private point(task: { x: number; y: number }): [number, number] {
    const size = this.scale * this.view.zoom;
    const x = this.originX + (task.x - this.view.x) * size, y = this.originY + (task.y - this.view.y) * size;
    return [x, y];
  }

  private visible(task: MapTask) {
    return (this.active === null || task.cluster === this.active) && (!this.matches || this.matches.has(task.id));
  }

  private dotRadius(task: MapTask) {
    const radius = clamp((this.width > 760 ? 5.6 : 3.8) + this.view.zoom * 0.7, 4.5, 9);
    return radius + (task.id === this.selected || task.id === this.hover ? 2 : 0);
  }

  getTransitionPoints(): TransitionPoint[] {
    return tasks.flatMap(task => {
      const [x, y] = this.point(task);
      if (x < -10 || y < -10 || x > this.width + 10 || y > this.height + 10) return [];
      return [{ id: task.id, cluster: task.cluster, x, y, radius: this.dotRadius(task), color: colors[task.cluster], opacity: this.visible(task) ? 0.82 : 0.09 }];
    });
  }

  private pick(x: number, y: number, touch = false): number | null {
    let best: number | null = null;
    let distance = (touch ? 22 : 12) ** 2;
    for (const task of tasks) {
      const [px, py] = this.point(task);
      const d = (px - x) ** 2 + (py - y) ** 2;
      if (d < distance) { best = task.id; distance = d; }
    }
    return best ?? this.taskLabelHits.find(b => Math.abs(b.x - x) < b.width / 2 && Math.abs(b.y - y) < b.height / 2)?.id ?? null;
  }

  private requestDraw() {
    if (!this.frame) this.frame = requestAnimationFrame(() => { this.frame = 0; this.draw(); });
  }

  private fly(next: View, duration = 420, smooth = false) {
    cancelAnimationFrame(this.animation);
    this.hideTip();
    if (next.x === this.view.x && next.y === this.view.y && next.zoom === this.view.zoom) {
      this.requestDraw();
      return;
    }
    if (reducedMotion() || document.hidden) { this.view = next; this.requestDraw(); return; }
    const start = { ...this.view }, began = performance.now();
    const step = (now: number) => {
      const progress = clamp((now - began) / duration, 0, 1);
      const eased = smooth
        ? progress * progress * progress * (progress * (progress * 6 - 15) + 10)
        : 1 - (1 - progress) ** 3;
      this.view = {
        x: start.x + (next.x - start.x) * eased,
        y: start.y + (next.y - start.y) * eased,
        zoom: start.zoom + (next.zoom - start.zoom) * eased,
      };
      this.requestDraw();
      if (progress < 1) this.animation = requestAnimationFrame(step);
    };
    this.animation = requestAnimationFrame(step);
  }

  setCluster(id: number | null) {
    this.active = id;
    this.selected = null;
    this.hover = null;
    if (id === null) { this.reset(); return; }
    const group = clusters[id].tasks;
    const xs = group.map(t => t.x), ys = group.map(t => t.y);
    const xmin = Math.min(...xs), xmax = Math.max(...xs), ymin = Math.min(...ys), ymax = Math.max(...ys);
    const zoom = clamp(Math.min((this.width - (this.width > 760 ? 140 : 50)) / ((xmax - xmin + 0.12) * this.scale), (this.height - (this.width > 760 ? 140 : 260)) / ((ymax - ymin + 0.12) * this.scale)), 1, 6);
    this.fly({ x: (xmin + xmax) / 2, y: (ymin + ymax) / 2, zoom });
  }

  setMatches(ids: number[] | null) {
    this.matches = ids ? new Set(ids) : null;
    this.hideTip();
    this.requestDraw();
  }

  select(task: MapTask) {
    this.active = null;
    this.matches = null;
    this.selected = task.id;
    this.hover = null;
    this.fly({ x: task.x, y: task.y, zoom: Math.max(2.6, this.view.zoom) }, 680, true);
  }

  reset() {
    this.active = null;
    this.selected = null;
    this.hover = null;
    this.fly({ x: 0.5, y: 0.5, zoom: 1 });
  }

  zoom(factor: number) { this.fly({ ...this.view, zoom: clamp(this.view.zoom * factor, 0.7, 12) }); }

  private zoomAt(x: number, y: number, factor: number) {
    cancelAnimationFrame(this.animation);
    const old = this.view.zoom, next = clamp(old * factor, 0.7, 12);
    this.view.x += (x - this.originX) / this.scale * (1 / old - 1 / next);
    this.view.y += (y - this.originY) / this.scale * (1 / old - 1 / next);
    this.view.zoom = next;
    this.hideTip();
    this.requestDraw();
  }

  private hideTip() { this.tip.hidden = true; this.hover = null; }

  private pickLabel(x: number, y: number) {
    return this.labelHits.find(b => Math.abs(b.x - x) < b.width / 2 && Math.abs(b.y - y) < b.height / 2);
  }

  private bind() {
    const canvas = this.canvas, signal = this.events.signal;
    const pointers = new Map<number, { x: number; y: number }>();
    let start = { x: 0, y: 0 }, moved = false;
    const local = (event: PointerEvent | WheelEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };
    canvas.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      cancelAnimationFrame(this.animation);
      start = local(event);
      if (!pointers.size) moved = false;
      else moved = true;
      pointers.set(event.pointerId, start);
      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = 'grabbing';
      this.hideTip();
    }, { signal });
    canvas.addEventListener('pointermove', event => {
      const p = local(event), previous = pointers.get(event.pointerId);
      if (previous) {
        if (pointers.size === 2) {
          const other = [...pointers.entries()].find(([id]) => id !== event.pointerId)![1];
          const before = Math.hypot(previous.x - other.x, previous.y - other.y);
          const after = Math.hypot(p.x - other.x, p.y - other.y);
          if (before > 0) this.zoomAt((p.x + other.x) / 2, (p.y + other.y) / 2, after / before);
          moved = true;
        } else {
          if (Math.hypot(p.x - start.x, p.y - start.y) > 4) moved = true;
          this.view.x -= (p.x - previous.x) / (this.scale * this.view.zoom);
          this.view.y -= (p.y - previous.y) / (this.scale * this.view.zoom);
          this.requestDraw();
        }
        pointers.set(event.pointerId, p);
        return;
      }
      this.hover = this.pick(p.x, p.y);
      canvas.style.cursor = this.hover !== null || this.pickLabel(p.x, p.y) ? 'pointer' : 'grab';
      if (this.hover !== null) {
        const task = tasks[this.hover];
        this.tip.replaceChildren();
        const name = document.createElement('strong'), contest = document.createElement('span');
        name.textContent = task.name; contest.textContent = task.contest;
        this.tip.append(name, contest);
        this.tip.hidden = false;
        const width = this.tip.offsetWidth, height = this.tip.offsetHeight;
        this.tip.style.left = `${clamp(p.x - width / 2, 8, this.width - width - 8)}px`;
        this.tip.style.top = `${clamp(p.y - height - 16, 8, this.height - height - 8)}px`;
      } else this.hideTip();
      this.requestDraw();
    }, { signal });
    const end = (event: PointerEvent) => {
      if (!pointers.has(event.pointerId)) return;
      pointers.delete(event.pointerId);
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
      canvas.style.cursor = 'grab';
      if (event.type === 'pointerup' && !moved && !pointers.size) {
        const p = local(event), id = this.pick(p.x, p.y, event.pointerType === 'touch');
        if (id !== null) this.onSelect(tasks[id]);
        else { const label = this.pickLabel(p.x, p.y); if (label) this.onCluster(label.cluster!); }
      }
    };
    canvas.addEventListener('pointerup', end, { signal });
    canvas.addEventListener('pointercancel', end, { signal });
    canvas.addEventListener('lostpointercapture', end, { signal });
    canvas.addEventListener('pointerleave', () => { this.hideTip(); this.requestDraw(); }, { signal });
    canvas.addEventListener('wheel', event => {
      event.preventDefault();
      const p = local(event);
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? this.height : 1);
      this.zoomAt(p.x, p.y, Math.exp(-delta * 0.0015));
    }, { signal, passive: false });
    canvas.addEventListener('keydown', event => {
      if (event.key === '+' || event.key === '=') this.zoom(1.3);
      else if (event.key === '-') this.zoom(1 / 1.3);
      else if (event.key.startsWith('Arrow')) {
        cancelAnimationFrame(this.animation);
        const step = 45 / (this.scale * this.view.zoom);
        this.view.x += event.key === 'ArrowRight' ? step : event.key === 'ArrowLeft' ? -step : 0;
        this.view.y += event.key === 'ArrowDown' ? step : event.key === 'ArrowUp' ? -step : 0;
        this.requestDraw();
      } else return;
      event.preventDefault();
    }, { signal });
  }

  private draw() {
    let ctx = this.ctx;
    const { width, height } = this;

    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    const ground = this.dark ? '#101017' : '#fdfdfd';
    const ink = this.dark ? '#e5e7eb' : '#374151';
    for (const task of tasks) {
      const radius = this.dotRadius(task);
      const [x, y] = this.point(task);
      if (x < -10 || y < -10 || x > width + 10 || y > height + 10) continue;
      const highlighted = task.id === this.selected || task.id === this.hover;
      ctx.globalAlpha = this.visible(task) ? 0.82 : 0.09;
      ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = colors[task.cluster]; ctx.fill();
      ctx.strokeStyle = ground; ctx.lineWidth = 0.7; ctx.stroke();
      if (highlighted) {
        ctx.globalAlpha = 1;
        ctx.beginPath(); ctx.arc(x, y, radius + 3, 0, Math.PI * 2);
        ctx.strokeStyle = colors[task.cluster]; ctx.lineWidth = 1.6; ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    // Keep text on its own layer so its entrance can fade without redrawing dots.
    ctx = this.labelCtx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    // Large regions cross-fade into the finer concepts as the visitor zooms in.
    this.labelHits = [];
    this.taskLabelHits = [];
    const boxes: LabelBox[] = [];
    const mobile = width <= 760;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    const paintLabels = (groups: typeof coarseLabels, size: number, alpha: number, coarse: boolean) => {
      if (alpha < 0.03 || this.matches) return;
      ctx.font = `${coarse ? 650 : 550} ${size}px Inter, system-ui, sans-serif`;
      for (const group of groups) {
        if (this.active !== null && group.cluster !== this.active) continue;
        const [anchorX, anchorY] = this.point(group);
        const lines: string[] = []; let line = '';
        for (const word of group.name.split(' ')) {
          if (line && ctx.measureText(`${line} ${word}`).width > (coarse ? (mobile ? 125 : 195) : 148)) {
            lines.push(line); line = word;
          } else line += `${line ? ' ' : ''}${word}`;
        }
        if (line) lines.push(line);
        const w = Math.max(...lines.map(text => ctx.measureText(text).width)) + 12;
        const lh = size * 1.1, h = lines.length * lh + 10;
        const offsets = [[0, -18], [0, 18], [-24, -36], [24, -36], [-36, 24], [36, 24], [0, -65], [0, 65], [-65, 0], [65, 0]];
        let placed: LabelBox | null = null;
        for (const [dx, dy] of offsets) {
          // Keep placement in map space; floating panels cover labels naturally.
          // Viewport exclusions would make labels jump or vanish while panning.
          const x = anchorX + dx, y = anchorY + dy;
          if (boxes.some(b => Math.abs(b.x - x) < (b.width + w) / 2 && Math.abs(b.y - y) < (b.height + h) / 2)) continue;
          placed = { x, y, width: w, height: h, cluster: group.cluster }; break;
        }
        if (!placed) continue;
        boxes.push(placed);
        if (coarse && alpha > 0.5) this.labelHits.push(placed);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.dark ? '#dfd9e8' : labelColors[group.cluster];
        ctx.strokeStyle = ground; ctx.lineWidth = coarse ? 5 : 4;
        lines.forEach((text, i) => {
          const yy = placed!.y + (i - (lines.length - 1) / 2) * lh;
          ctx.strokeText(text, placed!.x, yy); ctx.fillText(text, placed!.x, yy);
        });
      }
    };
    paintLabels(coarseLabels, mobile ? 15 : 23, clamp((2.7 - this.view.zoom) / 0.9, 0, 1), true);
    paintLabels(fineLabels, mobile ? 11 : 14, clamp((this.view.zoom - 1.2) / 0.7, 0, 0.88), false);
    ctx.globalAlpha = 1;
    // At close range, reveal task names where they fit without covering other labels.
    ctx.font = '550 12px Inter, system-ui, sans-serif';
    for (const task of tasks) {
      const selected = task.id === this.selected;
      if (!selected && (this.view.zoom < 3.4 || !this.visible(task))) continue;
      const [x, y] = this.point(task);
      if (x < 10 || x > width - 10 || y < 10 || y > height - 50) continue;
      const title = task.name.length > 42 ? `${task.name.slice(0, 39)}…` : task.name;
      const w = ctx.measureText(title).width + 12;
      const box = { x: clamp(x, w / 2 + 6, width - w / 2 - 6), y: y + 22, width: w, height: 22 };
      if (!selected && boxes.some(b => Math.abs(b.x - box.x) < (b.width + w) / 2 && Math.abs(b.y - box.y) < (b.height + 22) / 2)) continue;
      boxes.push(box);
      this.taskLabelHits.push({ ...box, id: task.id });
      ctx.globalAlpha = selected ? 1 : 0.8;
      ctx.strokeStyle = ground; ctx.lineWidth = 4; ctx.fillStyle = ink;
      ctx.strokeText(title, box.x, box.y); ctx.fillText(title, box.x, box.y);
    }
    ctx.globalAlpha = 1;
    this.onZoom(Math.round(this.view.zoom * 10) / 10);
  }

  destroy() {
    this.events.abort(); this.resize.disconnect(); this.theme.disconnect();
    cancelAnimationFrame(this.frame); cancelAnimationFrame(this.animation);
    this.tip.remove();
  }
}
