import { useState, useMemo, useCallback, useRef } from 'react';
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
  Save,
  Library,
  BookOpen,
  GraduationCap,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { resources as initialResources } from '@/data/resources';
import type {
  ResourcesData,
  GeneralCategory,
  SyllabusSection,
  SyllabusSubsection,
  Resource,
  ResourceType,
  Difficulty,
} from '@/data/resources';
import { resourceTypeLabel, difficultyLabel } from '@/data/resources';
import { cn } from '@/lib/utils';

type Selection =
  | { kind: 'general'; id: string }
  | { kind: 'section'; id: string }
  | { kind: 'subsection'; sectionId: string; id: string };

const RESOURCE_TYPES: ResourceType[] = [
  'article',
  'video',
  'course',
  'documentation',
  'book',
  'notebook',
  'interactive',
  'tool',
  'other',
];

const DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

const ACCENTS = ['purple', 'orange', 'pink', 'teal', 'blue'];

const ICONS = ['Sparkles', 'Flame', 'Brain', 'MessageSquare', 'Eye', 'Volume2', 'Table', 'Trophy', 'GraduationCap', 'BookOpen'];

const clone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

const genId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

const inputCls =
  'bg-white dark:bg-white/10 text-gray-900 dark:text-white border-gray-300 dark:border-white/15 placeholder:text-gray-400 dark:placeholder:text-gray-500';

const btnOutlineCls =
  'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:bg-aicc-purple hover:text-white dark:hover:bg-aicc-purple dark:hover:text-white';

const AdminResources = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ResourcesData>(() => clone(initialResources));
  const [history, setHistory] = useState<ResourcesData[]>([]);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [showJson, setShowJson] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    const set = new Set<string>();
    initialResources.syllabus.forEach((s) => set.add(s.id));
    return set;
  });

  const selectedItem = useMemo(() => {
    if (!selection) return null;
    if (selection.kind === 'general') {
      return data.general.find((c) => c.id === selection.id) ?? null;
    }
    if (selection.kind === 'section') {
      return data.syllabus.find((s) => s.id === selection.id) ?? null;
    }
    const section = data.syllabus.find((s) => s.id === selection.sectionId);
    return section?.subsections.find((sub) => sub.id === selection.id) ?? null;
  }, [data, selection]);

  const pushHistory = useCallback(() => {
    setHistory((prev) => [clone(data), ...prev].slice(0, 20));
  }, [data]);

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const [last, ...rest] = prev;
      setData(last);
      setSelection(null);
      toast.info('Undo applied');
      return rest;
    });
  }, []);

  const reset = useCallback(() => {
    setData(clone(initialResources));
    setSelection(null);
    toast.info('Reset to original data');
  }, []);

  const updateData = useCallback(
    (updater: (draft: ResourcesData) => void) => {
      pushHistory();
      const next = clone(data);
      updater(next);
      setData(next);
    },
    [data, pushHistory],
  );

  const updateField = useCallback(
    <K extends keyof (GeneralCategory & SyllabusSection & SyllabusSubsection)>(
      field: K,
      value: unknown,
    ) => {
      if (!selection) return;
      updateData((draft) => {
        if (selection.kind === 'general') {
          const item = draft.general.find((c) => c.id === selection.id);
          if (item) (item as Record<K, unknown>)[field] = value;
        } else if (selection.kind === 'section') {
          const item = draft.syllabus.find((s) => s.id === selection.id);
          if (item) (item as Record<K, unknown>)[field] = value;
        } else {
          const section = draft.syllabus.find((s) => s.id === selection.sectionId);
          const item = section?.subsections.find((sub) => sub.id === selection.id);
          if (item) (item as Record<K, unknown>)[field] = value;
        }
      });
    },
    [selection, updateData],
  );

  const updateResource = useCallback(
    (resourceId: string, field: keyof Resource, value: unknown) => {
      if (!selection) return;
      updateData((draft) => {
        const resourcesList =
          selection.kind === 'general'
            ? draft.general.find((c) => c.id === selection.id)?.resources
            : selection.kind === 'section'
              ? draft.syllabus
                  .find((s) => s.id === selection.id)
                  ?.subsections.flatMap((sub) => sub.resources)
              : draft.syllabus
                  .find((s) => s.id === selection.sectionId)
                  ?.subsections.find((sub) => sub.id === selection.id)?.resources;

        const resource = resourcesList?.find((r) => r.id === resourceId);
        if (resource) {
          (resource as Record<keyof Resource, unknown>)[field] = value;
        }
      });
    },
    [selection, updateData],
  );

  const addResource = useCallback(() => {
    if (!selection) return;
    updateData((draft) => {
      const newResource: Resource = {
        id: genId('resource'),
        title: 'New Resource',
        url: 'https://example.com',
        type: 'article',
        difficulty: 'beginner',
        description: '',
        free: true,
      };

      if (selection.kind === 'general') {
        draft.general.find((c) => c.id === selection.id)?.resources.push(newResource);
      } else if (selection.kind === 'section') {
        draft.syllabus
          .find((s) => s.id === selection.id)
          ?.subsections.forEach((sub) => sub.resources.push(clone(newResource)));
      } else {
        draft.syllabus
          .find((s) => s.id === selection.sectionId)
          ?.subsections.find((sub) => sub.id === selection.id)
          ?.resources.push(newResource);
      }
    });
  }, [selection, updateData]);

  const deleteResource = useCallback(
    (resourceId: string) => {
      updateData((draft) => {
        if (selection?.kind === 'general') {
          const cat = draft.general.find((c) => c.id === selection.id);
          if (cat) cat.resources = cat.resources.filter((r) => r.id !== resourceId);
        } else if (selection?.kind === 'section') {
          const section = draft.syllabus.find((s) => s.id === selection.id);
          section?.subsections.forEach((sub) => {
            sub.resources = sub.resources.filter((r) => r.id !== resourceId);
          });
        } else if (selection?.kind === 'subsection') {
          const section = draft.syllabus.find((s) => s.id === selection.sectionId);
          const sub = section?.subsections.find((s) => s.id === selection.id);
          if (sub) sub.resources = sub.resources.filter((r) => r.id !== resourceId);
        }
      });
    },
    [selection, updateData],
  );

  const moveResource = useCallback(
    (resourceId: string, direction: 'up' | 'down') => {
      updateData((draft) => {
        const getList = () => {
          if (selection?.kind === 'general') {
            return draft.general.find((c) => c.id === selection.id)?.resources;
          }
          if (selection?.kind === 'section') return undefined;
          if (selection?.kind === 'subsection') {
            return draft.syllabus
              .find((s) => s.id === selection.sectionId)
              ?.subsections.find((sub) => sub.id === selection.id)?.resources;
          }
          return undefined;
        };
        const list = getList();
        if (!list) return;
        const idx = list.findIndex((r) => r.id === resourceId);
        if (idx === -1) return;
        const newIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= list.length) return;
        [list[idx], list[newIdx]] = [list[newIdx], list[idx]];
      });
    },
    [selection, updateData],
  );

  const addCategory = useCallback(() => {
    updateData((draft) => {
      const newCat: GeneralCategory = {
        id: genId('category'),
        title: 'New Category',
        description: '',
        order: draft.general.length + 1,
        guideMdxPath: `general/${genId('category')}.mdx`,
        resources: [],
      };
      draft.general.push(newCat);
      setSelection({ kind: 'general', id: newCat.id });
    });
  }, [updateData]);

  const addSection = useCallback(() => {
    updateData((draft) => {
      const newSection: SyllabusSection = {
        id: genId('section'),
        title: 'New Section',
        description: '',
        order: draft.syllabus.length + 1,
        guideMdxPath: `syllabus/${genId('section')}.mdx`,
        subsections: [],
      };
      draft.syllabus.push(newSection);
      setExpandedSections((prev) => new Set([...prev, newSection.id]));
      setSelection({ kind: 'section', id: newSection.id });
    });
  }, [updateData]);

  const addSubsection = useCallback(
    (sectionId: string) => {
      updateData((draft) => {
        const section = draft.syllabus.find((s) => s.id === sectionId);
        if (!section) return;
        const newSub: SyllabusSubsection = {
          id: genId('subsection'),
          title: 'New Subsection',
          description: '',
          order: section.subsections.length + 1,
          guideMdxPath: `syllabus/${sectionId}/${genId('subsection')}.mdx`,
          resources: [],
        };
        section.subsections.push(newSub);
        setSelection({ kind: 'subsection', sectionId, id: newSub.id });
      });
    },
    [updateData],
  );

  const deleteItem = useCallback(() => {
    if (!selection) return;
    updateData((draft) => {
      if (selection.kind === 'general') {
        draft.general = draft.general.filter((c) => c.id !== selection.id);
      } else if (selection.kind === 'section') {
        draft.syllabus = draft.syllabus.filter((s) => s.id !== selection.id);
      } else {
        const section = draft.syllabus.find((s) => s.id === selection.sectionId);
        if (section) {
          section.subsections = section.subsections.filter((sub) => sub.id !== selection.id);
        }
      }
    });
    setSelection(null);
  }, [selection, updateData]);

  const moveItem = useCallback(
    (direction: 'up' | 'down') => {
      if (!selection) return;
      updateData((draft) => {
        const moveInArray = <T extends { id: string }>(arr: T[], id: string) => {
          const idx = arr.findIndex((x) => x.id === id);
          if (idx === -1) return;
          const newIdx = direction === 'up' ? idx - 1 : idx + 1;
          if (newIdx < 0 || newIdx >= arr.length) return;
          [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
        };

        if (selection.kind === 'general') {
          moveInArray(draft.general, selection.id);
        } else if (selection.kind === 'section') {
          moveInArray(draft.syllabus, selection.id);
        } else {
          const section = draft.syllabus.find((s) => s.id === selection.sectionId);
          if (section) moveInArray(section.subsections, selection.id);
        }
      });
    },
    [selection, updateData],
  );

  const copyJson = useCallback(() => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast.success('JSON copied to clipboard');
  }, [data]);

  const downloadJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resources.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('JSON downloaded');
  }, [data]);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0a0a0f]">
      <header className="border-b border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d0d14] px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resources editor</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Edit resource categories, syllabus sections, and links. Nothing is saved to a database — copy the JSON back into{' '}
              <code className="text-xs bg-gray-100 dark:bg-white/10 px-1 rounded">src/data/resources.json</code>.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={undo} disabled={history.length === 0} className={btnOutlineCls}>
              <Undo2 className="w-4 h-4 mr-1" />
              Undo
            </Button>
            <Button variant="outline" size="sm" onClick={reset} className={btnOutlineCls}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowJson(true)} className={btnOutlineCls}>
              <Eye className="w-4 h-4 mr-1" />
              Preview JSON
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-72 shrink-0 border-r border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d0d14] overflow-y-auto p-4 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">
                General
              </span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={addCategory}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <nav className="space-y-1">
              {data.general
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((category) => {
                  const active = selection?.kind === 'general' && selection.id === category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelection({ kind: 'general', id: category.id })}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors',
                        active
                          ? 'bg-aicc-purple/10 text-aicc-purple dark:text-aicc-purple-light'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5',
                      )}
                    >
                      <Library className="w-4 h-4 shrink-0" />
                      <span className="truncate">{category.title}</span>
                    </button>
                  );
                })}
            </nav>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">
                IOAI Syllabus
              </span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={addSection}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <nav className="space-y-1">
              {data.syllabus
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((section) => {
                  const expanded = expandedSections.has(section.id);
                  const active = selection?.kind === 'section' && selection.id === section.id;
                  return (
                    <div key={section.id}>
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="p-1 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded"
                        >
                          {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => setSelection({ kind: 'section', id: section.id })}
                          className={cn(
                            'flex-1 px-2 py-1.5 rounded-lg text-left text-sm transition-colors truncate',
                            active
                              ? 'bg-aicc-purple/10 text-aicc-purple dark:text-aicc-purple-light'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5',
                          )}
                        >
                          {section.title}
                        </button>
                      </div>
                      {expanded && (
                        <div className="ml-5 pl-2 border-l border-gray-200 dark:border-white/10 space-y-0.5 mt-1">
                          {section.subsections
                            .slice()
                            .sort((a, b) => a.order - b.order)
                            .map((sub) => {
                              const subActive =
                                selection?.kind === 'subsection' &&
                                selection.sectionId === section.id &&
                                selection.id === sub.id;
                              return (
                                <button
                                  key={sub.id}
                                  onClick={() => setSelection({ kind: 'subsection', sectionId: section.id, id: sub.id })}
                                  className={cn(
                                    'w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left text-xs transition-colors',
                                    subActive
                                      ? 'bg-aicc-purple/10 text-aicc-purple dark:text-aicc-purple-light'
                                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5',
                                  )}
                                >
                                  <BookOpen className="w-3.5 h-3.5 shrink-0" />
                                  <span className="truncate">{sub.title}</span>
                                </button>
                              );
                            })}
                          <button
                            onClick={() => addSubsection(section.id)}
                            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add subsection
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
            </nav>
          </div>
        </aside>

        <main className="flex-1 min-w-0 overflow-y-auto p-6">
          {selectedItem ? (
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selection?.kind === 'general' && 'General Category'}
                  {selection?.kind === 'section' && 'Syllabus Section'}
                  {selection?.kind === 'subsection' && 'Syllabus Subsection'}
                </h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => moveItem('up')} className={btnOutlineCls}>
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => moveItem('down')} className={btnOutlineCls}>
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={deleteItem} className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-white dark:bg-[#0d0d14] border border-gray-200 dark:border-white/10 rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Title</Label>
                    <Input
                      value={selectedItem.title}
                      onChange={(e) => updateField('title', e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  {'shortTitle' in selectedItem && (
                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Short title</Label>
                      <Input
                        value={selectedItem.shortTitle ?? ''}
                        onChange={(e) => updateField('shortTitle', e.target.value || undefined)}
                        className={inputCls}
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Order</Label>
                    <Input
                      type="number"
                      value={selectedItem.order}
                      onChange={(e) => updateField('order', parseInt(e.target.value) || 0)}
                      className={inputCls}
                    />
                  </div>
                  {'icon' in selectedItem && (
                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Icon</Label>
                      <Select
                        value={selectedItem.icon ?? 'BookOpen'}
                        onValueChange={(value) => updateField('icon', value)}
                      >
                        <SelectTrigger className={inputCls}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ICONS.map((icon) => (
                            <SelectItem key={icon} value={icon}>
                              {icon}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {'accent' in selectedItem && (
                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Accent</Label>
                      <Select
                        value={selectedItem.accent ?? 'purple'}
                        onValueChange={(value) => updateField('accent', value)}
                      >
                        <SelectTrigger className={inputCls}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ACCENTS.map((accent) => (
                            <SelectItem key={accent} value={accent}>
                              {accent}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">Description</Label>
                  <textarea
                    value={selectedItem.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={3}
                    className={cn(
                      'w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      inputCls,
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">MDX guide path</Label>
                  <Input
                    value={selectedItem.guideMdxPath}
                    onChange={(e) => updateField('guideMdxPath', e.target.value)}
                    className={inputCls}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Make sure this MDX file exists in <code className="text-xs bg-gray-100 dark:bg-white/10 px-1 rounded">src/resources/</code>.
                  </p>
                </div>
              </div>

              {'resources' in selectedItem && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Resources</h3>
                    <Button onClick={addResource} size="sm" className="btn-gradient">
                      <Plus className="w-4 h-4 mr-1" />
                      Add resource
                    </Button>
                  </div>

                  {selectedItem.resources.length === 0 ? (
                    <div className="text-center py-8 bg-white dark:bg-[#0d0d14] border border-gray-200 dark:border-white/10 rounded-xl">
                      <p className="text-gray-500 dark:text-gray-400">No resources yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedItem.resources.map((resource: Resource, index: number) => (
                        <div
                          key={resource.id}
                          className="bg-white dark:bg-[#0d0d14] border border-gray-200 dark:border-white/10 rounded-xl p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">#{index + 1}</Badge>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => moveResource(resource.id, 'up')}
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => moveResource(resource.id, 'down')}
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-red-600 hover:text-red-700"
                                onClick={() => deleteResource(resource.id)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs text-gray-500 dark:text-gray-400">Title</Label>
                              <Input
                                value={resource.title}
                                onChange={(e) => updateResource(resource.id, 'title', e.target.value)}
                                className={cn(inputCls, 'h-9')}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-gray-500 dark:text-gray-400">URL</Label>
                              <Input
                                value={resource.url}
                                onChange={(e) => updateResource(resource.id, 'url', e.target.value)}
                                className={cn(inputCls, 'h-9')}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-gray-500 dark:text-gray-400">Type</Label>
                              <Select
                                value={resource.type}
                                onValueChange={(value: ResourceType) => updateResource(resource.id, 'type', value)}
                              >
                                <SelectTrigger className={cn(inputCls, 'h-9')}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {RESOURCE_TYPES.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {resourceTypeLabel[type]}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-gray-500 dark:text-gray-400">Difficulty</Label>
                              <Select
                                value={resource.difficulty ?? ''}
                                onValueChange={(value) => updateResource(resource.id, 'difficulty', value || undefined)}
                              >
                                <SelectTrigger className={cn(inputCls, 'h-9')}>
                                  <SelectValue placeholder="None" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="">None</SelectItem>
                                  {DIFFICULTIES.map((diff) => (
                                    <SelectItem key={diff} value={diff}>
                                      {difficultyLabel[diff]}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-gray-500 dark:text-gray-400">Source</Label>
                              <Input
                                value={resource.source ?? ''}
                                onChange={(e) => updateResource(resource.id, 'source', e.target.value || undefined)}
                                className={cn(inputCls, 'h-9')}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-gray-500 dark:text-gray-400">Tags (comma separated)</Label>
                              <Input
                                value={(resource.tags ?? []).join(', ')}
                                onChange={(e) =>
                                  updateResource(
                                    resource.id,
                                    'tags',
                                    e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                                  )
                                }
                                className={cn(inputCls, 'h-9')}
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500 dark:text-gray-400">Description</Label>
                            <textarea
                              value={resource.description ?? ''}
                              onChange={(e) => updateResource(resource.id, 'description', e.target.value || undefined)}
                              rows={2}
                              className={cn(
                                'w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                                inputCls,
                              )}
                            />
                          </div>

                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                              <Checkbox
                                checked={resource.free === true}
                                onCheckedChange={(checked) => updateResource(resource.id, 'free', checked === true)}
                              />
                              Free
                            </label>
                            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                              <Checkbox
                                checked={resource.featured === true}
                                onCheckedChange={(checked) => updateResource(resource.id, 'featured', checked === true)}
                              />
                              Featured
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <GraduationCap className="w-12 h-12 text-aicc-purple/40 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Select a category or section
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                Choose an item from the sidebar to edit its details, guidance path, and resources.
              </p>
            </div>
          )}
        </main>
      </div>

      <Dialog open={showJson} onOpenChange={setShowJson}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Resources JSON</DialogTitle>
            <DialogDescription>
              Copy this JSON and replace the contents of{' '}
              <code className="text-xs bg-gray-100 dark:bg-white/10 px-1 rounded">src/data/resources.json</code>.
            </DialogDescription>
          </DialogHeader>
          <pre className="flex-1 overflow-auto bg-gray-100 dark:bg-[#0d0d14] p-4 rounded-lg text-xs text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-white/10">
            {JSON.stringify(data, null, 2)}
          </pre>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={downloadJson} className={btnOutlineCls}>
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
            <Button onClick={copyJson} className="btn-gradient">
              <Copy className="w-4 h-4 mr-1" />
              Copy to clipboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminResources;
