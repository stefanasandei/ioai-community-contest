import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Crosshair, Minus, Plus, Search, X } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { tasks, colors, fineClusters, type MapTask } from './data';
import { MapCanvas } from './MapCanvas';
import type { AtlasLaunch } from './atlasTransition';
import './task-atlas.css';

export default function TaskAtlas() {
  const location = useLocation();
  const launch = useRef<AtlasLaunch | undefined>(location.state?.atlasLaunch);
  const returnTo = typeof location.state?.returnTo === 'string' && /^\/tasks(?:\?|$)/.test(location.state.returnTo) ? location.state.returnTo : '/tasks';
  const canvas = useRef<HTMLCanvasElement>(null);
  const map = useRef<MapCanvas | null>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<number | null>(null);
  const [selected, setSelected] = useState<MapTask | null>(null);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [resultIndex, setResultIndex] = useState(0);
  const resultList = useRef<HTMLDivElement>(null);
  const searchBox = useRef<HTMLDivElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const normalized = query.trim().toLowerCase();
  const results = useMemo(() => tasks.filter(task =>
    `${task.name} ${task.contest} ${fineClusters[task.fine].n}`.toLowerCase().includes(normalized)
  ), [normalized]);

  useEffect(() => {
    const oldTitle = document.title;
    document.title = 'Task atlas | AICC';
    try {
      map.current = new MapCanvas(canvas.current!, task => {
        setActive(null); setSelected(task); setQuery(''); setSearchOpen(false);

      }, setZoom, id => {
        setActive(id); setSelected(null); setQuery(''); setSearchOpen(false);
      }, launch.current);
    } catch { setError(true); }
    return () => { map.current?.destroy(); map.current = null; document.title = oldTitle; };
  }, []);
  useEffect(() => { map.current?.setCluster(active); }, [active]);
  useEffect(() => { map.current?.setMatches(normalized ? results.map(t => t.id) : null); }, [normalized, results]);
  useEffect(() => { if (selected) map.current?.select(selected); }, [selected]);
  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (!searchBox.current?.contains(event.target as Node)) setSearchOpen(false);
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, []);

  const reset = () => {
    setActive(null); setSelected(null); setQuery(''); setSearchOpen(false); setResultIndex(0);
    map.current?.setMatches(null); map.current?.reset();
  };
  const chooseTask = (task: MapTask) => {
    setActive(null); setSelected(task); setQuery(''); setSearchOpen(false);

    if (selected?.id === task.id) map.current?.select(task);
    searchInput.current?.focus();
  };

  return <div className="task-atlas-page">
    <Navigation />
    <main className="cluster-explorer" aria-label="Interactive task map">
      <div className={`cluster-stage ${launch.current ? 'cluster-stage-unfold' : ''}`}>
        <canvas ref={canvas} tabIndex={0} role="img" aria-label={`Map of ${tasks.length} AI olympiad problems grouped by similarity. Use search to explore with a keyboard.`} aria-describedby="cluster-controls-help" />
      </div>
      <header className="cluster-heading">
        <Link to={returnTo} className="cluster-back"><ArrowLeft size={15} aria-hidden="true" />Problem bank</Link>
        <div className="cluster-title-row"><h1>Task <span className="text-gradient">atlas</span></h1></div>
        <p>Explore ~ 200 AI Olympiad problems in dozens of clusters</p>
      </header>
      <div className="cluster-search-area" ref={searchBox}>
        <div className="cluster-search">
          <Search size={17} aria-hidden="true" />
          <input ref={searchInput} type="search" placeholder="Find a task or contest" aria-label="Find a task or contest" aria-expanded={searchOpen} aria-controls="cluster-search-results" value={query}
            onChange={event => { setQuery(event.target.value); setSearchOpen(true); setResultIndex(0); }}
            onKeyDown={event => {
              if (event.key === 'Escape') { setSearchOpen(false); searchInput.current?.blur(); }
              if (event.key === 'Enter' && results[resultIndex]) { event.preventDefault(); chooseTask(results[resultIndex]); }
              if (event.key === 'ArrowDown') {
                event.preventDefault(); setSearchOpen(true); setResultIndex(0);
                requestAnimationFrame(() => resultList.current?.querySelector('button')?.focus());
              }
            }} />
          {query && <button type="button" aria-label="Clear task search" onClick={() => { setQuery(''); setSearchOpen(false); searchInput.current?.focus(); }}><X size={15} /></button>}
        </div>
        {searchOpen && <div id="cluster-search-results" className="cluster-search-results">
          <div className="cluster-results-heading"><span role="status">{results.length} {results.length === 1 ? 'problem' : 'problems'}</span><button type="button" aria-label="Close search results" onClick={() => setSearchOpen(false)}><X size={14} /></button></div>
          <div className="cluster-results" ref={resultList} onKeyDown={event => {
            if (event.key === 'Escape') { setSearchOpen(false); searchInput.current?.focus(); return; }
            if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
            event.preventDefault();
            const next = Math.max(0, Math.min(results.length - 1, resultIndex + (event.key === 'ArrowDown' ? 1 : -1)));
            resultList.current?.querySelectorAll<HTMLButtonElement>('button.cluster-result')[next]?.focus();
          }}>
            {!results.length && <div className="cluster-empty"><p>No matching tasks. Try another name or contest.</p>{active !== null && <button type="button" onClick={() => { setActive(null); setSelected(null); }}>Search all clusters</button>}</div>}
            {results.map((task, index) => <button key={task.id} type="button" className="cluster-result" onFocus={() => setResultIndex(index)} onClick={() => chooseTask(task)}><span className="cluster-dot" style={{ backgroundColor: colors[task.cluster] }} /><span><strong>{task.name}</strong><small>{task.contest}</small></span><ArrowUpRight size={14} aria-hidden="true" /></button>)}
          </div>
        </div>}
      </div>
      {selected && <section className="cluster-selected" aria-live="polite" aria-label="Selected problem">
        <div className="cluster-selected-top"><span className="cluster-dot" style={{ backgroundColor: colors[selected.cluster] }} /><p>{selected.contest}</p><button type="button" aria-label="Close task details" onClick={() => { setSelected(null); map.current?.setCluster(active); }}><X size={16} /></button></div>
        <h2>{selected.name}</h2>
        <p className="cluster-selected-topic">{fineClusters[selected.fine].n}</p>
        <a href={selected.url} target="_blank" rel="noopener noreferrer" className="cluster-problem-link">View problem<ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
      </section>}
      {active !== null && <button type="button" className="cluster-clear-filter" onClick={reset} aria-label="Show all clusters">
        <X size={15} aria-hidden="true" />
        <span>Show all clusters</span>
      </button>}
      {error && <p className="cluster-error" role="alert">The map could not be displayed. Use search to browse the problems.</p>}
      <div className="cluster-zoom" aria-label="Map controls"><button type="button" onClick={reset} aria-label="Reset view" title="Reset view"><Crosshair size={18} /></button><span className="cluster-control-divider" /><button type="button" onClick={() => map.current?.zoom(1 / 1.3)} aria-label="Zoom out"><Minus size={17} /></button><output aria-label="Zoom level">{zoom.toFixed(1)}×</output><button type="button" onClick={() => map.current?.zoom(1.3)} aria-label="Zoom in"><Plus size={17} /></button></div>
      <p id="cluster-controls-help" className="sr-only">Drag to explore <span>·</span> Scroll to zoom <span>·</span> Click a problem<span className="sr-only">. Use arrow keys to pan and plus or minus to zoom when the map has keyboard focus.</span></p>
    </main>
  </div>;
}
