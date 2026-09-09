import { useState } from 'react';
import { Plus, Trash2, Copy, ExternalLink, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import schedule from '@/data/live-rounds.json';
import { scheduleSchema } from '@/lib/liveRounds';
import { RoundBannerRow } from '@/components/LiveRoundBanner';

type Draft = { key: string; title: string; url: string; startsAt: string; endsAt: string };
const asUTC = (value: string) => value ? `${value.length === 16 ? value + ':00' : value}Z` : '';
const initial: Draft[] = (scheduleSchema.safeParse(schedule).data ?? []).map((round, index) => ({ title: round.title, url: round.url, key: String(index), startsAt: round.startsAt.slice(0, -1), endsAt: round.endsAt.slice(0, -1) }));
const editorURL = 'https://github.com/stefanasandei/ioai-community-contest/edit/main/src/data/live-rounds.json';

export default function AdminRounds() {
  const [rounds, setRounds] = useState<Draft[]>(initial);
  const [message, setMessage] = useState('');
  const parsed = scheduleSchema.safeParse(rounds.map(({ title, url, startsAt, endsAt }) => ({ title, url, startsAt: asUTC(startsAt), endsAt: asUTC(endsAt) })));
  const json = parsed.success ? JSON.stringify(parsed.data, null, 2) + '\n' : '';
  const update = (key: string, field: keyof Draft, value: string) => { setRounds(items => items.map(item => item.key === key ? { ...item, [field]: value } : item)); setMessage(''); };
  const copy = async () => {
    try { await navigator.clipboard.writeText(json); setMessage('Copied. Open GitHub, replace the file contents, then propose a change on a new branch.'); }
    catch { setMessage('Clipboard unavailable. Download the JSON or copy it from the preview below.'); }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = 'live-rounds.json'; a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <div className="mx-auto w-full max-w-4xl p-6 md:p-10 space-y-6">
      <header><h1 className="text-3xl font-bold">Round announcements</h1><p className="mt-2 text-muted-foreground">Schedule the homepage banner. Dates use UTC; changes go live after the GitHub PR is merged and the site deploys.</p></header>
      {rounds.length === 0 && <p className="rounded-xl border border-border p-6 text-muted-foreground">No rounds scheduled. The homepage banner stays hidden.</p>}
      {rounds.map((round, index) => <section key={round.key} className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex justify-between items-center"><h2 className="text-base font-semibold">Round {index + 1}</h2><Button variant="ghost" size="icon" aria-label={`Remove round ${index + 1}`} onClick={() => { setRounds(items => items.filter(item => item.key !== round.key)); setMessage(''); }}><Trash2 size={16} /></Button></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor={`title-${round.key}`}>Round name</Label><Input id={`title-${round.key}`} maxLength={80} value={round.title} placeholder="AICC Round 12" onChange={e => update(round.key, 'title', e.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor={`url-${round.key}`}>Round link</Label><Input id={`url-${round.key}`} value={round.url} placeholder="https://… or /contests" onChange={e => update(round.key, 'url', e.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor={`start-${round.key}`}>Starts at (UTC)</Label><Input id={`start-${round.key}`} type="datetime-local" step="0.001" value={round.startsAt} onChange={e => update(round.key, 'startsAt', e.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor={`end-${round.key}`}>Ends at (UTC)</Label><Input id={`end-${round.key}`} type="datetime-local" step="0.001" value={round.endsAt} onChange={e => update(round.key, 'endsAt', e.target.value)} /></div>
        </div>
      </section>)}
      <Button variant="outline" disabled={rounds.length >= 20} onClick={() => { setRounds(items => [...items, { key: crypto.randomUUID(), title: '', url: '/contests', startsAt: '', endsAt: '' }]); setMessage(''); }}><Plus className="mr-2 h-4 w-4" />Add round</Button>
      {!parsed.success && <div role="status" className="text-sm text-red-600 dark:text-red-300 space-y-1">{parsed.error.issues.map((issue, index) => <p key={index}>Round {Number(issue.path[0]) + 1}: {issue.message}</p>)}</div>}
      {parsed.success && parsed.data.length > 0 && <section className="space-y-2"><h2 className="text-base font-semibold">Banner preview at the start of each round</h2><div className="round-banner !mt-0 rounded-lg overflow-hidden">{parsed.data.map((round, index) => <RoundBannerRow key={index} round={round} now={Date.parse(round.startsAt)} />)}</div><p className="text-xs text-muted-foreground">Only ongoing rounds appear on the homepage. The remaining hours update automatically.</p></section>}
      <section className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h2 className="text-lg font-semibold">Propose the schedule on GitHub</h2>
        <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground"><li>Copy the proposed JSON, then open the GitHub editor and replace the file contents.</li><li>Choose a new branch when committing the change, then create a pull request. GitHub may offer to fork the repository if you don’t have write access.</li><li>Review and merge the PR. Opening the editor or copying changes does not publish anything.</li></ol>
        <p className="text-xs text-muted-foreground">Start from the latest site version to avoid replacing someone else’s new schedule. Keep any other rounds you still need in the file.</p>
        <div className="flex flex-wrap gap-3"><Button disabled={!parsed.success} onClick={copy}><Copy className="mr-2 h-4 w-4" />Copy proposed JSON</Button><Button variant="outline" asChild><a href={editorURL} target="_blank" rel="noopener noreferrer"><ExternalLink className="mr-2 h-4 w-4" />Open GitHub editor</a></Button><Button variant="ghost" disabled={!parsed.success} onClick={download}><Download className="mr-2 h-4 w-4" />Download JSON</Button></div>
        <p role="status" className="text-sm text-muted-foreground">{message}</p>
        {parsed.success && <details><summary className="cursor-pointer text-sm">Review proposed file</summary><pre className="mt-3 overflow-auto rounded-lg bg-muted p-4 text-xs">{json}</pre></details>}
      </section>
    </div>
  );
}
