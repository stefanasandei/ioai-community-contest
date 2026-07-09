import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Copy,
  Download,
  RotateCcw,
  Eye,
  Check,
  Undo2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { referenceSections } from '@/data/referenceTasks';
import type { PracticeStatus } from '@/data/types';
import { cn } from '@/lib/utils';

type Difficulty = PracticeStatus | '';

interface EditorLearn {
  topic: string;
  seq: string;
}
interface EditorTask {
  id: string;
  task: string;
  taskUrl: string;
  solutionUrl: string;
  competition: string;
  difficulty: Difficulty;
  learn: EditorLearn[];
}
interface EditorSection {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  accent: string;
  type: string;
  tasks: EditorTask[];
}

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
  { value: 'legacy', label: 'Legacy' },
];

const NOT_SET_BADGE =
  'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700';

const DIFF_BADGE: Record<PracticeStatus, string> = {
  easy: 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700',
  medium: 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700',
  hard: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700',
  legacy: 'bg-gray-200 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
};

const ACCENT_BADGE: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700',
  teal: 'bg-teal-100 text-teal-700 border-teal-300 dark:bg-teal-900/40 dark:text-teal-300 dark:border-teal-700',
  orange: 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-700',
  pink: 'bg-pink-100 text-pink-700 border-pink-300 dark:bg-pink-900/40 dark:text-pink-300 dark:border-pink-700',
  purple: 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-700',
};

const inputCls =
  'bg-white dark:bg-white/10 text-gray-900 dark:text-white border-gray-300 dark:border-white/15 placeholder:text-gray-400 dark:placeholder:text-gray-500';

const btnOutlineCls =
  'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:bg-aicc-purple hover:text-white dark:hover:bg-aicc-purple dark:hover:text-white';

const btnGhostCls =
  'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-aicc-purple dark:hover:text-aicc-purple-light';

const slugify = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

const genTaskId = (competition: string, task: string): string => {
  const base = [competition, task].filter(Boolean).map(slugify).filter(Boolean).join('-');
  return base || `task-${Math.random().toString(36).slice(2, 8)}`;
};

const cloneOriginal = (): EditorSection[] =>
  referenceSections.map((s) => ({
    id: s.id,
    title: s.title,
    shortTitle: s.shortTitle,
    description: s.description,
    accent: s.accent,
    type: s.type,
    tasks: s.tasks.map((t) => ({
      id: t.id,
      task: t.task,
      taskUrl: t.taskUrl ?? '',
      solutionUrl: t.solutionUrl ?? '',
      competition: t.competition,
      difficulty: (t.difficulty ?? '') as Difficulty,
      learn: t.learn.map((l) => ({
        topic: l.topic,
        seq: l.seq != null ? String(l.seq) : '',
      })),
    })),
  }));

const cleanLearn = (l: EditorLearn): { topic: string; seq?: number } => {
  const topic = l.topic.trim();
  const seqNum = l.seq === '' ? undefined : Number(l.seq);
  const out: { topic: string; seq?: number } = { topic };
  if (seqNum != null && !Number.isNaN(seqNum)) out.seq = seqNum;
  return out;
};

const cleanTask = (t: EditorTask) => {
  const out: Record<string, unknown> = {
    id: t.id.trim(),
    task: t.task.trim(),
  };
  const taskUrl = t.taskUrl.trim();
  if (taskUrl) out.taskUrl = taskUrl;
  const solutionUrl = t.solutionUrl.trim();
  if (solutionUrl) out.solutionUrl = solutionUrl;
  out.competition = t.competition.trim();
  if (t.difficulty) out.difficulty = t.difficulty;
  out.learn = t.learn.map(cleanLearn).filter((l) => l.topic);
  return out;
};

// Sections are edited in code — pass them through unchanged.
const cleanSection = (s: EditorSection) => ({
  id: s.id,
  title: s.title,
  shortTitle: s.shortTitle,
  description: s.description,
  accent: s.accent,
  type: s.type,
  tasks: s.tasks.map(cleanTask).filter((t) => (t as { id: string }).id && (t as { task: string }).task),
});

const serialize = (sections: EditorSection[]): string =>
  JSON.stringify(sections.map(cleanSection), null, 2);

const computedDifficulty = (index: number, total: number): PracticeStatus => {
  if (total <= 1) return 'easy';
  const ratio = index / (total - 1);
  if (ratio < 0.34) return 'easy';
  if (ratio < 0.67) return 'medium';
  return 'hard';
};

const move = <T,>(arr: T[], from: number, dir: -1 | 1): T[] => {
  const to = from + dir;
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  [next[from], next[to]] = [next[to], next[from]];
  return next;
};

const AdminRoadmap = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState<EditorSection[]>(cloneOriginal);
  const undoStack = useRef<EditorSection[][]>([]);
  const sectionsRef = useRef(sections);
  useEffect(() => { sectionsRef.current = sections; });
  const canUndo = undoStack.current.length > 0;

  const updateSections = useCallback(
    (updater: EditorSection[] | ((prev: EditorSection[]) => EditorSection[])) => {
      const prev = sectionsRef.current;
      undoStack.current = [...undoStack.current.slice(-49), prev];
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setSections(next);
    },
    [],
  );

  const handleUndo = useCallback(() => {
    const stack = undoStack.current;
    if (stack.length === 0) return;
    const prev = stack[stack.length - 1];
    undoStack.current = stack.slice(0, -1);
    setSections(prev);
  }, []);

  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [showJson, setShowJson] = useState(false);
  const [copied, setCopied] = useState(false);

  const originalJson = useMemo(() => serialize(cloneOriginal()), []);
  const currentJson = useMemo(() => serialize(sections), [sections]);
  const dirty = originalJson !== currentJson;

  const totalTasks = sections.reduce((n, s) => n + s.tasks.length, 0);

  const toggleSection = (idx: number) =>
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });

  const toggleTask = (key: string) =>
    setExpandedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const expandAll = () => {
    setExpandedSections(new Set(sections.map((_, i) => i)));
    setExpandedTasks(
      new Set(
        sections.flatMap((s, si) => s.tasks.map((_, ti) => `${si}-${ti}`)),
      ),
    );
  };
  const collapseAll = () => {
    setExpandedSections(new Set());
    setExpandedTasks(new Set());
  };

  // --- Task ops ---
  const taskKey = (si: number, ti: number) => `${si}-${ti}`;

  const updateTask = (si: number, ti: number, patch: Partial<EditorTask>) =>
    updateSections((prev) =>
      prev.map((s, i) =>
        i === si
          ? { ...s, tasks: s.tasks.map((t, j) => (j === ti ? { ...t, ...patch } : t)) }
          : s,
      ),
    );

  const addTask = (si: number) => {
    const newTask: EditorTask = {
      id: genTaskId('New Competition', 'new task'),
      task: 'new task',
      taskUrl: '',
      solutionUrl: '',
      competition: 'New Competition',
      difficulty: '',
      learn: [{ topic: 'New Topic', seq: '' }],
    };
    updateSections((prev) =>
      prev.map((s, i) => (i === si ? { ...s, tasks: [...s.tasks, newTask] } : s)),
    );
    setExpandedTasks((prev) => new Set(prev).add(taskKey(si, sections[si].tasks.length)));
    setExpandedSections((prev) => new Set(prev).add(si));
  };

  const deleteTask = (si: number, ti: number) =>
    updateSections((prev) =>
      prev.map((s, i) =>
        i === si ? { ...s, tasks: s.tasks.filter((_, j) => j !== ti) } : s,
      ),
    );

  const moveTask = (si: number, ti: number, dir: -1 | 1) =>
    updateSections((prev) =>
      prev.map((s, i) => (i === si ? { ...s, tasks: move(s.tasks, ti, dir) } : s)),
    );

  // --- Learn ops ---
  const updateLearn = (
    si: number,
    ti: number,
    li: number,
    patch: Partial<EditorLearn>,
  ) =>
    updateSections((prev) =>
      prev.map((s, i) =>
        i === si
          ? {
            ...s,
            tasks: s.tasks.map((t, j) =>
              j === ti
                ? {
                  ...t,
                  learn: t.learn.map((l, k) => (k === li ? { ...l, ...patch } : l)),
                }
                : t,
            ),
          }
          : s,
      ),
    );

  const addLearn = (si: number, ti: number) =>
    updateSections((prev) =>
      prev.map((s, i) =>
        i === si
          ? {
            ...s,
            tasks: s.tasks.map((t, j) =>
              j === ti ? { ...t, learn: [...t.learn, { topic: '', seq: '' }] } : t,
            ),
          }
          : s,
      ),
    );

  const deleteLearn = (si: number, ti: number, li: number) =>
    updateSections((prev) =>
      prev.map((s, i) =>
        i === si
          ? {
            ...s,
            tasks: s.tasks.map((t, j) =>
              j === ti ? { ...t, learn: t.learn.filter((_, k) => k !== li) } : t,
            ),
          }
          : s,
      ),
    );

  const moveLearn = (si: number, ti: number, li: number, dir: -1 | 1) =>
    updateSections((prev) =>
      prev.map((s, i) =>
        i === si
          ? {
            ...s,
            tasks: s.tasks.map((t, j) =>
              j === ti ? { ...t, learn: move(t.learn, li, dir) } : t,
            ),
          }
          : s,
      ),
    );

  // --- Export ---
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(currentJson);
      setCopied(true);
      toast.success('JSON copied to clipboard');
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error('Copy failed — open the preview and copy manually.');
      setShowJson(true);
    }
  }, [currentJson]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([currentJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'referenceSections.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded referenceSections.json');
  }, [currentJson]);

  const handleReset = () => {
    if (!dirty || window.confirm('Discard all changes and reload the original data?')) {
      updateSections(cloneOriginal());
      setExpandedSections(new Set([0]));
      setExpandedTasks(new Set());
      toast('Reset to original data');
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Page header */}
      <header className="shrink-0 bg-white dark:bg-[#0d0d14] border-b border-gray-200 dark:border-white/10">
        <div className="px-6 py-3 flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 mr-auto min-w-0">
            <div className="leading-tight min-w-0">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                Roadmap editor
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {totalTasks} tasks across {sections.length} tracks
                {dirty && <span className="text-amber-600 dark:text-amber-400"> · unsaved</span>}
              </p>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={handleUndo} disabled={!canUndo} className={cn('gap-1.5', btnOutlineCls)}>
            <Undo2 className="w-3.5 h-3.5" />
            Undo
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset} className={cn('gap-1.5', btnOutlineCls)}>
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowJson(true)} className={cn('gap-1.5', btnOutlineCls)}>
            <Eye className="w-3.5 h-3.5" />
            Preview JSON
          </Button>
          <Button size="sm" onClick={handleCopy} className="gap-1.5 btn-gradient text-white">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy JSON'}
          </Button>
        </div>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-6 space-y-4">
          {/* Hint */}
          <div className="rounded-lg border border-blue-200 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 text-sm text-blue-800 dark:text-blue-200">
            Edit tasks within each track, then click <strong>Copy JSON</strong> and paste it into{' '}
            <code className="px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 font-mono text-xs">
              src/data/referenceSections.json
            </code>
            . Track settings (title, accent, type…) are managed in code. Nothing is saved to a database.
          </div>

          {/* Tracks controls */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Tracks
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={expandAll} className={cn('text-xs', btnGhostCls)}>
                Expand all
              </Button>
              <Button variant="ghost" size="sm" onClick={collapseAll} className={cn('text-xs', btnGhostCls)}>
                Collapse all
              </Button>
            </div>
          </div>

          {/* Section list (read-only groupings) */}
          <div className="space-y-3 pb-10">
            {sections.map((section, si) => {
              const sectionOpen = expandedSections.has(si);
              return (
                <div
                  key={si}
                  className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm overflow-hidden"
                >
                  {/* Section header (read-only) */}
                  <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100 dark:border-white/5">
                    <button
                      onClick={() => toggleSection(si)}
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400"
                      aria-label={sectionOpen ? 'Collapse' : 'Expand'}
                    >
                      {sectionOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-mono font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/10">
                      {String(si + 1).padStart(2, '0')}
                    </span>
                    <button
                      onClick={() => toggleSection(si)}
                      className="flex items-center gap-2 min-w-0 flex-1 text-left"
                    >
                      <span className="font-semibold text-gray-900 dark:text-white truncate">
                        {section.title || 'Untitled track'}
                      </span>
                      <span
                        className={cn(
                          'shrink-0 text-[11px] font-semibold px-1.5 py-0.5 rounded border capitalize',
                          ACCENT_BADGE[section.accent] ?? ACCENT_BADGE.purple,
                        )}
                      >
                        {section.accent}
                      </span>
                      <span className="shrink-0 text-[10px] font-mono text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-white/10 rounded px-1 py-0.5">
                        {section.type}
                      </span>
                      <Badge variant="secondary" className="shrink-0 text-[11px]">
                        {section.tasks.length} tasks
                      </Badge>
                    </button>
                    {sectionOpen && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addTask(si)}
                        className={cn('gap-1.5 h-8 shrink-0', btnOutlineCls)}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add task
                      </Button>
                    )}
                  </div>

                  {/* Section body — tasks only */}
                  {sectionOpen && (
                    <div className="p-4 space-y-3 bg-gray-50/50 dark:bg-white/[0.02]">
                      <div className="space-y-2">
                        {section.tasks.length === 0 && (
                          <div className="text-center py-8 border border-dashed border-gray-200 dark:border-white/10 rounded-lg">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              No tasks in this track.
                            </p>
                            <Button size="sm" onClick={() => addTask(si)} className="mt-3 gap-1.5">
                              <Plus className="w-3.5 h-3.5" />
                              Add the first task
                            </Button>
                          </div>
                        )}
                        {section.tasks.map((task, ti) => {
                          const key = taskKey(si, ti);
                          const taskOpen = expandedTasks.has(key);
                          const computed = computedDifficulty(ti, section.tasks.length);
                          const effective: PracticeStatus = (task.difficulty || computed) as PracticeStatus;
                          return (
                            <div
                              key={ti}
                              className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden"
                            >
                              <div className="flex items-center gap-2 px-2.5 py-2">
                                <button
                                  onClick={() => toggleTask(key)}
                                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400"
                                  aria-label={taskOpen ? 'Collapse' : 'Expand'}
                                >
                                  {taskOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                </button>
                                <span className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded text-[11px] font-mono font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/10">
                                  {ti + 1}
                                </span>
                                <button
                                  onClick={() => toggleTask(key)}
                                  className="flex items-center gap-2 min-w-0 flex-1 text-left"
                                >
                                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {task.task || 'Untitled task'}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate hidden sm:inline">
                                    from {task.competition || '—'}
                                  </span>
                                </button>
                                <span
                                  className={cn(
                                    'shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded border',
                                    task.difficulty ? DIFF_BADGE[effective] : NOT_SET_BADGE,
                                  )}
                                  title={
                                    task.difficulty
                                      ? 'Explicit override'
                                      : `Click to set a difficulty`
                                  }
                                >
                                  {task.difficulty ? effective : 'Not set'}
                                </span>
                                <div className="flex items-center gap-0.5 shrink-0">
                                  <IconBtn label="Move up" onClick={() => moveTask(si, ti, -1)} disabled={ti === 0}>
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </IconBtn>
                                  <IconBtn
                                    label="Move down"
                                    onClick={() => moveTask(si, ti, 1)}
                                    disabled={ti === section.tasks.length - 1}
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </IconBtn>
                                  <IconBtn label="Delete task" onClick={() => deleteTask(si, ti)} destructive>
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </IconBtn>
                                </div>
                              </div>

                              {taskOpen && (
                                <div className="p-3 space-y-3 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <Field label="Competition">
                                      <Input
                                        value={task.competition}
                                        onChange={(e) => updateTask(si, ti, { competition: e.target.value })}
                                        className={inputCls}
                                      />
                                    </Field>
                                    <Field label="Task name">
                                      <Input
                                        value={task.task}
                                        onChange={(e) => updateTask(si, ti, { task: e.target.value })}
                                        className={inputCls}
                                      />
                                    </Field>
                                    <Field label="Task URL (optional)">
                                      <Input
                                        value={task.taskUrl}
                                        onChange={(e) => updateTask(si, ti, { taskUrl: e.target.value })}
                                        placeholder="https://…"
                                        className={inputCls}
                                      />
                                    </Field>
                                    <Field label="Solution URL (optional)">
                                      <Input
                                        value={task.solutionUrl}
                                        onChange={(e) => updateTask(si, ti, { solutionUrl: e.target.value })}
                                        placeholder="https://…"
                                        className={inputCls}
                                      />
                                    </Field>
                                    <div className="space-y-1.5">
                                      <div className="flex items-center gap-2">
                                        <Label className="text-xs text-gray-500 dark:text-gray-400">Difficulty</Label>
                                        {!task.difficulty && (
                                          <span className={cn('inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border', NOT_SET_BADGE)}>
                                            Not set
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex flex-wrap gap-1.5 min-h-[40px] items-center">
                                        {DIFFICULTIES.map((d) => {
                                          const isSelected = d.value === task.difficulty;
                                          return (
                                            <button
                                              key={d.value}
                                              type="button"
                                              onClick={() =>
                                                updateTask(si, ti, {
                                                  difficulty: d.value as Difficulty,
                                                })
                                              }
                                              className={cn(
                                                'inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-semibold border transition-colors cursor-pointer',
                                                isSelected
                                                  ? DIFF_BADGE[d.value as PracticeStatus]
                                                  : cn(
                                                    DIFF_BADGE[d.value as PracticeStatus],
                                                    'opacity-60 hover:opacity-100',
                                                  ),
                                              )}
                                            >
                                              {d.label}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Learn items */}
                                  <div className="pt-1">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Learn topics / tags
                                      </h4>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => addLearn(si, ti)}
                                        className={cn('gap-1.5 h-7', btnOutlineCls)}
                                      >
                                        <Plus className="w-3 h-3" />
                                        Add tag
                                      </Button>
                                    </div>
                                    <div className="space-y-1.5">
                                      {task.learn.length === 0 && (
                                        <p className="text-xs text-gray-400 dark:text-gray-500 italic px-1">
                                          No tags.
                                        </p>
                                      )}
                                      {task.learn.map((learn, li) => (
                                        <div key={li} className="flex items-center gap-2">
                                          <span className="shrink-0 w-5 text-[11px] font-mono text-gray-400 text-right">
                                            {li + 1}
                                          </span>
                                          <Input
                                            value={learn.topic}
                                            onChange={(e) =>
                                              updateLearn(si, ti, li, { topic: e.target.value })
                                            }
                                            placeholder="Topic name"
                                            className={cn(inputCls, 'h-8 text-sm')}
                                          />
                                          <Input
                                            value={learn.seq}
                                            onChange={(e) =>
                                              updateLearn(si, ti, li, {
                                                seq: e.target.value.replace(/[^0-9]/g, ''),
                                              })
                                            }
                                            placeholder="seq"
                                            className={cn(inputCls, 'h-8 w-16 text-sm text-center')}
                                          />
                                          <div className="flex items-center gap-0.5 shrink-0">
                                            <IconBtn
                                              label="Move up"
                                              onClick={() => moveLearn(si, ti, li, -1)}
                                              disabled={li === 0}
                                              small
                                            >
                                              <ArrowUp className="w-3 h-3" />
                                            </IconBtn>
                                            <IconBtn
                                              label="Move down"
                                              onClick={() => moveLearn(si, ti, li, 1)}
                                              disabled={li === task.learn.length - 1}
                                              small
                                            >
                                              <ArrowDown className="w-3 h-3" />
                                            </IconBtn>
                                            <IconBtn
                                              label="Delete tag"
                                              onClick={() => deleteLearn(si, ti, li)}
                                              destructive
                                              small
                                            >
                                              <Trash2 className="w-3 h-3" />
                                            </IconBtn>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* JSON preview dialog */}
      <Dialog open={showJson} onOpenChange={setShowJson}>
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>referenceSections.json</DialogTitle>
            <DialogDescription>
              Copy this JSON and paste it into{' '}
              <code className="font-mono text-xs">src/data/referenceSections.json</code>.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 pb-2">
            <Button size="sm" onClick={handleCopy} className="gap-1.5 btn-gradient text-white">
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy all'}
            </Button>
            <Button size="sm" variant="outline" onClick={handleDownload} className={cn('gap-1.5', btnOutlineCls)}>
              <Download className="w-3.5 h-3.5" />
              Download
            </Button>
          </div>
          <textarea
            value={currentJson}
            readOnly
            onFocus={(e) => e.target.select()}
            className="flex-1 min-h-[40vh] w-full rounded-md border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/40 p-3 font-mono text-xs text-gray-800 dark:text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-aicc-purple/40"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// --- Small inline helpers ---

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label className="text-xs text-gray-500 dark:text-gray-400">{label}</Label>
    {children}
  </div>
);

interface IconBtnProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  destructive?: boolean;
  small?: boolean;
  children: React.ReactNode;
}

const IconBtn = ({ label, onClick, disabled, destructive, small, children }: IconBtnProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={label}
    aria-label={label}
    className={cn(
      'inline-flex items-center justify-center rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed',
      small ? 'w-7 h-7' : 'w-8 h-8',
      destructive
        ? 'text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30'
        : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10',
    )}
  >
    {children}
  </button>
);

export default AdminRoadmap;
