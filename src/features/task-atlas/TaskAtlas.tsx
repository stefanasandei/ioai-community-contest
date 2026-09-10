import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ChevronDown, Crosshair, Minus, Plus, Search, X } from 'lucide-react';
import Navigation from '@/components/Navigation';
import SheetTaskCard from '@/components/SheetTaskCard';
import { tasks, colors, clusters, fineClusters, type MapTask } from './data';
import { MapCanvas } from './MapCanvas';
import { animateAtlasEntry, closeAtlas } from './atlasTransition';
import './task-atlas.css';

export default function TaskAtlas() {
  const location = useLocation();
  const navigate = useNavigate();
  const returnTo = typeof location.state?.returnTo === 'string' && /^\/tasks(?:\?|$)/.test(location.state.returnTo) ? location.state.returnTo : '/tasks';
  const canvas = useRef<HTMLCanvasElement>(null);
  const labelCanvas = useRef<HTMLCanvasElement>(null);
  const map = useRef<MapCanvas | null>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<number | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<number | null>(null);
  const [focusedFine, setFocusedFine] = useState<number | null>(null);
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

  useLayoutEffect(() => {
    const oldTitle = document.title;
    document.title = 'Task Atlas | AICC';
    try {
      map.current = new MapCanvas(canvas.current!, labelCanvas.current!, task => {
        setActive(null); setFocusedFine(null); setSelected(task); setQuery(''); setSearchOpen(false);

      }, setZoom, id => {
        setActive(id); setFocusedFine(null); setSelected(null); setQuery(''); setSearchOpen(false);
      });
      animateAtlasEntry(canvas.current!, map.current.getTransitionPoints());
    } catch { setError(true); }
    return () => { map.current?.destroy(); map.current = null; document.title = oldTitle; };
  }, []);
  useEffect(() => { map.current?.setCluster(active, focusedFine); }, [active, focusedFine]);
  useEffect(() => { map.current?.setMatches(normalized ? results.map(t => t.id) : focusedFine !== null ? tasks.filter(t => t.fine === focusedFine).map(t => t.id) : null); }, [normalized, results, focusedFine]);
  useEffect(() => { if (selected) map.current?.select(selected); }, [selected]);
  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (!searchBox.current?.contains(event.target as Node)) setSearchOpen(false);
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, []);

  const reset = () => {
    setActive(null); setFocusedFine(null); setSelected(null); setQuery(''); setSearchOpen(false); setResultIndex(0);
    map.current?.setMatches(null); map.current?.reset();
  };
  const chooseTask = (task: MapTask) => {
    setActive(null); setFocusedFine(null); setSelected(task); setQuery(''); setSearchOpen(false);

    if (selected?.id === task.id) map.current?.select(task);
    searchInput.current?.blur();
  };
  const chooseTopic = (id: number) => {
    setActive(id); setFocusedFine(null); setSelected(null); setQuery('');
    if (active === id && focusedFine === null) map.current?.setCluster(id);
    setExpandedTopic(current => current === id ? null : id);
  };
  const chooseSection = (id: number, fineId: number | null) => {
    setActive(id); setFocusedFine(fineId); setSelected(null); setQuery(''); setSearchOpen(false);
    if (active === id && focusedFine === fineId) map.current?.setCluster(id, fineId);
    searchInput.current?.blur();
  };

  return <div className="task-atlas-page">
    <Navigation />
    <main className="cluster-explorer" aria-label="Interactive task map">
      <div className="cluster-stage">
        <canvas ref={canvas} tabIndex={0} role="img" aria-label={`Map of ${tasks.length} AI olympiad problems grouped by similarity. Use search to explore with a keyboard.`} aria-describedby="cluster-controls-help" />
        <canvas ref={labelCanvas} className="cluster-labels" aria-hidden="true" />
      </div>
      <div className="cluster-header-stack atlas-matched-width">
      <Link to={returnTo} className="cluster-heading" aria-label="Back to problem bank" onClick={event => {
          if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          closeAtlas(navigate, returnTo, map.current?.getTransitionPoints() ?? []);
      }}><span className="cluster-back"><ArrowLeft size={15} aria-hidden="true" />Problem bank</span>
        <div className="cluster-title-row"><h1>Task <span className="text-gradient">Atlas</span></h1></div>
      </Link>
      <div className="cluster-search-area" ref={searchBox}>
        <div className="cluster-search">
          <Search size={17} aria-hidden="true" />
          <input ref={searchInput} type="search" placeholder="Find a task or contest" aria-label="Find a task or contest" aria-expanded={searchOpen} aria-controls="cluster-search-results" value={query}
            onFocus={() => { setSearchOpen(true); setResultIndex(0); }}
            onClick={() => setSearchOpen(true)}
            onChange={event => { setQuery(event.target.value); setSearchOpen(true); setResultIndex(0); }}
            onKeyDown={event => {
              if (event.key === 'Escape') { setSearchOpen(false); searchInput.current?.blur(); }
              if (event.key === 'Enter') {
                event.preventDefault();
                if (normalized && results[resultIndex]) chooseTask(results[resultIndex]);
                else if (!normalized && clusters[resultIndex]) chooseTopic(clusters[resultIndex].id);
              }
              if (event.key === 'ArrowDown') {
                event.preventDefault(); setSearchOpen(true); setResultIndex(0);
                requestAnimationFrame(() => resultList.current?.querySelector('button')?.focus());
              }
            }} />
          {query && <button type="button" aria-label="Clear task search" onClick={() => { setQuery(''); setResultIndex(0); searchInput.current?.focus(); setSearchOpen(true); }}><X size={15} /></button>}
        </div>
        {searchOpen && <div id="cluster-search-results" className="cluster-search-results">
          <div className="cluster-results" ref={resultList} onKeyDown={event => {
            if (event.key === 'Escape') { searchInput.current?.focus(); setSearchOpen(false); return; }
            if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
            event.preventDefault();
            const buttons = Array.from(resultList.current?.querySelectorAll<HTMLButtonElement>('button.cluster-result') ?? []);
            const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
            const next = Math.max(0, Math.min(buttons.length - 1, current + (event.key === 'ArrowDown' ? 1 : -1)));
            buttons[next]?.focus();
          }}>
            {normalized && !results.length && <div className="cluster-empty"><p>No matching tasks. Try another name or contest.</p>{active !== null && <button type="button" onClick={() => { setActive(null); setFocusedFine(null); setSelected(null); }}>Search all clusters</button>}</div>}
            {!normalized ? clusters.map((topic, index) => <div key={topic.id}>
              <button type="button" className="cluster-result" aria-expanded={expandedTopic === topic.id} aria-controls={`topic-sections-${topic.id}`} onFocus={() => setResultIndex(index)} onClick={() => chooseTopic(topic.id)}><span className="cluster-dot" style={{ backgroundColor: colors[topic.id] }} /><span><strong>{topic.name}</strong><small>{topic.tasks.length} problems</small></span><ChevronDown size={14} aria-hidden="true" style={{ transform: expandedTopic === topic.id ? 'rotate(180deg)' : undefined }} /></button>
              {expandedTopic === topic.id && <div id={`topic-sections-${topic.id}`} className="cluster-topic-sections">
                {fineClusters.map((section, id) => ({ ...section, id, count: topic.tasks.filter(task => task.fine === id).length })).filter(section => section.c === topic.id && section.count > 0).map(section => <button key={section.id} type="button" className="cluster-result" onClick={() => chooseSection(topic.id, section.id)}><span><strong>{section.n}</strong><small>{section.count} {section.count === 1 ? 'problem' : 'problems'}</small></span><ArrowUpRight size={14} aria-hidden="true" /></button>)}
              </div>}
            </div>) : results.map((task, index) => <button key={task.id} type="button" className="cluster-result" onFocus={() => setResultIndex(index)} onClick={() => chooseTask(task)}><span className="cluster-dot" style={{ backgroundColor: colors[task.cluster] }} /><span><strong>{task.name}</strong><small>{task.contest}</small></span><ArrowUpRight size={14} aria-hidden="true" /></button>)}
          </div>
        </div>}
      </div>
      </div>
      {selected && <section className="cluster-selected" aria-live="polite" aria-label="Selected problem">
        <button className="cluster-details-close" type="button" aria-label="Close task details" onClick={() => { setSelected(null); map.current?.setCluster(active); }}><X size={18} /></button>
        <SheetTaskCard key={selected.id} task={selected.details} expanded />
        <details className="cluster-context" key={`cluster-${selected.id}`}>
          <summary>{fineClusters[selected.fine].n}</summary>
          <p>{fineClusters[selected.fine].d}</p>
        </details>
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
