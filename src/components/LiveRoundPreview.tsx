import { RoundBannerRow } from './LiveRoundBanner';

export function LiveRoundNotice() {
  return <>
    <aside className="round-banner" aria-label="Sample ongoing round">
      <RoundBannerRow round={{ title: 'AICC Round 12', url: '/contests', startsAt: '2026-01-01T00:00:00Z', endsAt: '2026-01-03T00:00:00Z' }} now={Date.parse('2026-01-01T00:00:00Z')} />
    </aside>
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 rounded-full border border-border bg-background px-4 py-2 text-xs text-muted-foreground shadow-sm">Sample round · Local preview</div>
  </>;
}
