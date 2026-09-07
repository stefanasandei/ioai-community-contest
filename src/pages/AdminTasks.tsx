import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import SheetTaskCard from '@/components/SheetTaskCard';
import initialData from '@/data/sheet/sheet.json';
import { parseSheetTask, type SheetTask } from '@/data/sheet/sheetUtils';

const inputClass = 'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/20 dark:bg-gray-900 dark:text-white';
const githubFile = 'https://github.com/stefanasandei/ioai-community-contest/edit/main/src/data/sheet/sheet.json';
const draftKey = 'aicc-tasks-editor-draft';
const cloneInitial = () => structuredClone(initialData) as SheetTask[];

function validate(data: unknown): asserts data is SheetTask[] {
  if (!Array.isArray(data) || !data.length) throw new Error('The task list must be a non-empty JSON array.');
  data.forEach((row, index) => {
    if (!row || typeof row !== 'object' || typeof row.Problem !== 'string' || !row.Problem.trim()) {
      throw new Error(`Task ${index + 1} needs a problem name.`);
    }
    for (const field of ['Contest', 'Category', 'Topic', 'Link', 'Solution']) {
      if (row[field] != null && typeof row[field] !== 'string') throw new Error(`Task ${index + 1}: ${field} must be text.`);
    }
    for (const [field, max] of [['Difficulty', 10], ['Insightful', 3]] as const) {
      const value = row[field];
      if (value === null || value === undefined || value === '') continue;
      if (!['string', 'number'].includes(typeof value) || !Number.isFinite(Number(value)) || Number(value) < 0 || Number(value) > max || (field === 'Insightful' && !Number.isInteger(Number(value)))) {
        throw new Error(`${row.Problem}: ${field} must be ${field === 'Insightful' ? 'a whole number ' : ''}between 0 and ${max}, or blank.`);
      }
    }
  });
}

const AdminTasks = () => {
  const [data, setData] = useState<SheetTask[]>(cloneInitial);
  const [selected, setSelected] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<SheetTask[][]>([]);
  const [showJson, setShowJson] = useState(false);
  const task = selected === null ? null : data[selected];
  const json = JSON.stringify(data, null, 2) + '\n';
  let error = '';
  try { validate(data); } catch (e) { error = (e as Error).message; }
  const change = (next: SheetTask[]) => {
    setHistory(previous => [...previous.slice(-19), data]);
    setData(next);
  };
  const update = (field: string, value: string) => {
    if (selected === null) return;
    change(data.map((row, index) => index === selected ? { ...row, [field]: value || null } : row));
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'sheet.json';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const saveDraft = () => {
    try { localStorage.setItem(draftKey, json); toast.success('Draft saved in this browser.'); }
    catch { toast.error('Could not save draft. Download the JSON instead.'); }
  };
  const loadDraft = () => {
    try {
      const saved = localStorage.getItem(draftKey);
      if (!saved) { toast.info('No saved draft in this browser.'); return; }
      const parsed: unknown = JSON.parse(saved);
      validate(parsed);
      if (!window.confirm('Replace your current edits with the saved draft?')) return;
      change(parsed); setSelected(null);
      toast.success('Draft loaded. Review it against the latest published tasks before submitting.');
    } catch (e) { toast.error(`Could not load draft: ${(e as Error).message}`); }
  };
  const fields = [
    ['Problem', 'Problem name'], ['Contest', 'Contest / round'], ['Category', 'Category'],
    ['Topic', 'Topics'], ['Link', 'Problem link'],
  ];
  const filtered = data.map((row, index) => ({ row, index })).filter(({ row }) =>
    `${row.Problem} ${row.Contest ?? ''} ${row.Category ?? ''}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="p-4 md:p-6 text-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold">Tasks editor</h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Edit the problem bank, then download or copy the JSON. Replace <code>src/data/sheet/sheet.json</code> on GitHub and submit a pull request. The website updates after the change is merged and deployed.</p>
      <p className="mt-2 text-xs text-gray-500">Edits stay in this editor until exported. Save a browser draft before leaving. Loading an older draft can overwrite newer published data.</p>
      <div className="my-4 flex flex-wrap gap-2">
        <Button onClick={() => { change([...data, { Problem: 'New task', Contest: '', Category: null, Topic: null, Difficulty: null, Insightful: null, Link: null, Solution: null }]); setSelected(data.length); setQuery(''); }}>Add task</Button>
        <Button variant="outline" disabled={!history.length} onClick={() => { setData(history[history.length - 1]); setHistory(history.slice(0, -1)); setSelected(null); }}>Undo</Button>
        <Button variant="outline" onClick={saveDraft}>Save draft</Button>
        <Button variant="outline" onClick={loadDraft}>Load draft</Button>
        <Button variant="outline" onClick={() => { if (window.confirm('Reset all edits to the tasks loaded with this version of the site?')) { change(cloneInitial()); setSelected(null); } }}>Reset</Button>
        <Button variant="outline" onClick={() => setShowJson(!showJson)}>{showJson ? 'Hide JSON' : 'Review JSON'}</Button>
        <Button disabled={!!error} onClick={download}>Download JSON</Button>
        <Button disabled={!!error} onClick={async () => { try { await navigator.clipboard.writeText(json); toast.success('JSON copied.'); } catch { toast.error('Could not copy. Download the JSON instead.'); } }}>Copy JSON</Button>
        <Button variant="outline" asChild><a href={githubFile} target="_blank" rel="noopener noreferrer">Open file on GitHub</a></Button>
      </div>
      {error && <p role="alert" className="mb-4 text-sm text-red-600 dark:text-red-400">{error} Fix this before exporting.</p>}
      {showJson && <textarea aria-label="Tasks JSON preview" readOnly value={json} className={`${inputClass} mb-4 h-64 font-mono text-xs`} />}
      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside>
          <label htmlFor="task-search" className="text-sm font-medium">Search tasks</label>
          <input id="task-search" className={`${inputClass} mt-1`} value={query} onChange={e => setQuery(e.target.value)} placeholder="Problem, contest, category…" />
          <p className="my-2 text-xs text-gray-500">{filtered.length} of {data.length} tasks</p>
          <div className="max-h-[65vh] space-y-1 overflow-y-auto">
            {filtered.map(({ row, index }) => <button key={index} onClick={() => setSelected(index)} className={`w-full rounded-lg p-3 text-left text-sm ${selected === index ? 'bg-aicc-purple/10 text-aicc-purple dark:text-aicc-purple-light' : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}><span className="block font-medium">{row.Problem || 'Unnamed task'}</span><span className="text-xs text-gray-500 dark:text-gray-400">{row.Contest || 'No contest'}</span></button>)}
            {!filtered.length && <p className="p-3 text-sm text-gray-500">No matching tasks.</p>}
          </div>
        </aside>
        {task ? <section className="min-w-0 space-y-4">
          <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-semibold">Edit task</h2><Button variant="destructive" onClick={() => { if (window.confirm(`Remove "${task.Problem}" from this draft?`)) { change(data.filter((_, index) => index !== selected)); setSelected(null); } }}>Remove task</Button></div>
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map(([field, label]) => <label key={field} className="space-y-1 text-sm"><span>{label}</span><input className={inputClass} value={String(task[field] ?? '')} onChange={e => update(field, e.target.value)} placeholder={field === 'Category' ? 'Unspecified' : undefined} /></label>)}
            <label className="space-y-1 text-sm"><span>Difficulty (0–10; blank means unrated)</span><input aria-label="Difficulty" className={inputClass} type="number" min="0" max="10" step="0.1" value={task.Difficulty ?? ''} onChange={e => update('Difficulty', e.target.value)} /></label>
            <label className="space-y-1 text-sm"><span>Insightfulness</span><select className={inputClass} value={task.Insightful ?? ''} onChange={e => update('Insightful', e.target.value)}><option value="">Unrated</option><option value="0">0 — Not insightful</option><option value="1">1 — Slightly insightful</option><option value="2">2 — Insightful</option><option value="3">3 — Very insightful</option></select></label>
          </div>
          <label className="block space-y-1 text-sm"><span>Solution links</span><textarea className={inputClass} rows={3} value={String(task.Solution ?? '')} onChange={e => update('Solution', e.target.value)} /><span className="block text-xs text-gray-500">Paste one or more public URLs, separated by spaces or newlines. Their order determines Solution 1, Solution 2, and so on.</span></label>
          <h3 className="text-sm font-semibold">Card preview</h3>
          <div className="max-w-xl"><SheetTaskCard task={parseSheetTask(task)} /></div>
        </section> : <p className="py-10 text-center text-gray-500">Select a task to edit its details, ratings, and solution links.</p>}
      </div>
    </div>
  );
};

export default AdminTasks;
