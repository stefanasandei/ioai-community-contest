import { Fragment, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Search } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { calculateDemoRatings } from '@/lib/demoRatings';

const data = calculateDemoRatings();
const signed = (n: number) => `${n > 0 ? '+' : ''}${n}`;

export default function Ratings() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);
  const filtered = useMemo(() => data.entries.filter(p => p.name.toLowerCase().includes(query.trim().toLowerCase())), [query]);
  const pages = Math.max(1, Math.ceil(filtered.length / 25));
  return <div className="min-h-screen bg-gray-50 pt-14 text-gray-900 dark:bg-[#0a0a0f] dark:text-gray-100">
    <Navigation />
    <main className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6">
      <Link to="/contests" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-purple-600 dark:text-gray-400"><ArrowLeft size={15} />Contests</Link>
      <div className="mt-7 mb-8">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-purple-600 dark:text-purple-300">Historical demo · Rounds {Math.min(...data.rounds)}–{Math.max(...data.rounds)}</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Community <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400">Ratings</span></h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-500 dark:text-gray-400">A look at performance across AICC rounds. These are illustrative Elo ratings; official ratings begin with Round 11.</p>
      </div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-gray-500 dark:text-gray-400"><strong className="font-semibold text-gray-900 dark:text-white">{data.entries.length}</strong> participants <span className="mx-2 text-gray-300 dark:text-gray-600">/</span> {data.rounds.length} rounds</p>
        <label className="flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 sm:w-64 dark:border-white/10 dark:bg-white/5"><Search size={16} className="text-gray-400" /><input aria-label="Search participants" value={query} onChange={e => { setQuery(e.target.value); setPage(0); }} placeholder="Search participants" className="w-full bg-transparent text-sm outline-none" /></label>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-[#111118]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50/80 text-xs text-gray-500 dark:border-white/10 dark:bg-white/[.02] dark:text-gray-400"><tr><th className="w-12 px-3 py-3 sm:px-5">Rank</th><th className="px-2 py-3">Participant</th><th className="px-3 py-3 text-right sm:px-5">Elo</th><th className="hidden px-4 py-3 text-right sm:table-cell">Rounds</th></tr></thead>
          <tbody>{filtered.slice(page * 25, page * 25 + 25).map(entry => {
            const last = entry.history[entry.history.length - 1];
            const open = expanded === entry.name;
            return <Fragment key={entry.name}><tr className="border-b border-gray-100 last:border-0 hover:bg-purple-50/30 dark:border-white/5 dark:hover:bg-white/[.02]">
              <td className="px-3 py-4 tabular-nums text-gray-400 sm:px-5">{entry.rank}</td>
              <td className="px-2 py-4"><button aria-expanded={open} onClick={() => setExpanded(open ? null : entry.name)} className="flex items-center gap-2 text-left font-medium hover:text-purple-600"><span className="break-all">{entry.name}</span><ChevronDown size={13} className={`shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} /></button></td>
              <td className="whitespace-nowrap px-3 py-4 text-right tabular-nums sm:px-5"><span className="font-semibold">{Math.round(entry.rating)}</span><span title={`Change in Round ${last.round}`} className={`ml-2 text-xs ${last.change > 0 ? 'text-emerald-600 dark:text-emerald-400' : last.change < 0 ? 'text-rose-500 dark:text-rose-400' : 'text-gray-400'}`}>{signed(last.change)}</span></td>
              <td className="hidden px-4 py-4 text-right tabular-nums text-gray-500 sm:table-cell">{entry.history.length}</td>
            </tr>{open && <tr><td colSpan={4} className="border-b border-gray-100 bg-gray-50/70 px-4 py-5 dark:border-white/10 dark:bg-white/[.025]">
              <p className="mb-3 text-xs font-medium text-gray-500">Rating history · Started at 1,000 · {entry.history.length} rounds played</p>
              <div className="flex flex-wrap gap-2">{entry.history.map(h => <Link key={h.round} to={`/contests/round-${h.round}/leaderboard`} className="min-w-32 rounded-lg border border-gray-200 bg-white px-3 py-2.5 transition-colors hover:border-purple-300 dark:border-white/10 dark:bg-white/[.03] dark:hover:border-purple-500"><span className="block text-xs text-gray-500 dark:text-gray-400">Round {h.round} · #{h.place}/{h.field}</span><span className="mt-1 block font-semibold tabular-nums">{h.rating} <span className="font-normal text-gray-500">({signed(h.change)})</span></span><span className="text-xs text-gray-500 dark:text-gray-400">{h.points.toFixed(2)} points</span></Link>)}</div>
            </td></tr>}</Fragment>;
          })}</tbody>
        </table>
        {!filtered.length && <p role="status" className="p-10 text-center text-sm text-gray-500">No participants match “{query}”.</p>}
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-xs text-gray-500 dark:border-white/10"><span>{filtered.length ? page * 25 + 1 : 0}–{Math.min((page + 1) * 25, filtered.length)} of {filtered.length}</span><div className="flex items-center gap-4"><button disabled={!page} onClick={() => setPage(page - 1)} className="py-1 hover:text-purple-600 disabled:opacity-30">Previous</button><span>{page + 1} / {pages}</span><button disabled={page + 1 >= pages} onClick={() => setPage(page + 1)} className="py-1 hover:text-purple-600 disabled:opacity-30">Next</button></div></div>
      </div>
      <details className="mt-5 text-xs leading-relaxed text-gray-500 dark:text-gray-400"><summary className="w-fit cursor-pointer py-2 hover:text-purple-600">How this demo is calculated</summary><p className="mt-2 max-w-3xl">Everyone starts at 1,000. Each round compares participants’ normalized total scores against every opponent, using standard Elo expectations (400-point scale) and K = 64 averaged over opponents. Ties count as half a win; updates happen simultaneously. Only participants with a recorded score are included. No inactivity penalty applies. The change shown is from each person’s latest round.</p><p className="mt-2 max-w-3xl">Usernames are matched exactly across historical leaderboards. Renamed accounts may appear separately, and identical names are assumed to be the same person. This is a design preview, not an official rating or verified identity record.</p></details>
    </main><Footer />
  </div>;
}
