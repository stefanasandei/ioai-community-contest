import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import schedule from '@/data/live-rounds.json';
import { activeRounds, hoursRemaining, scheduleSchema, type LiveRound } from '@/lib/liveRounds';
import './live-round-banner.css';

const publishedRounds = scheduleSchema.safeParse(schedule).data ?? [];
export function RoundBannerRow({ round, now }: { round: LiveRound; now: number }) {
  const content = <><span className="round-banner-live"><i aria-hidden="true" />Live now</span><strong>{round.title}</strong><span className="round-banner-time">{hoursRemaining(round.endsAt, now)}</span><span className="round-banner-action">View round <ArrowUpRight size={15} /></span></>;
  const props = { className: 'round-banner-row', 'aria-label': `${round.title}, ${hoursRemaining(round.endsAt, now)}. View round` };
  return round.url.startsWith('/') ? <Link to={round.url} {...props}>{content}</Link> : <a href={round.url} {...props}>{content}</a>;
}
export default function LiveRoundBanner() {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    if (!publishedRounds.length) return;
    const update = () => setNow(Date.now());
    const timer = window.setInterval(update, 1000);
    document.addEventListener('visibilitychange', update);
    return () => { window.clearInterval(timer); document.removeEventListener('visibilitychange', update); };
  }, []);
  const live = activeRounds(publishedRounds, now);
  return live.length ? <aside className="round-banner" aria-label="Ongoing contests">{live.map((round, index) => <RoundBannerRow key={`${round.title}-${index}`} round={round} now={now} />)}</aside> : null;
}
