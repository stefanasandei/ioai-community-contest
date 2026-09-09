import { z } from 'zod';

export const roundSchema = z.object({
  title: z.string().trim().min(1, 'Enter a round name').max(80),
  url: z.string().refine(value => {
    if (/^\/(?!\/)[^\\\s]*$/.test(value)) return true;
    try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; } catch { return false; }
  }, 'Use an HTTPS link or a site path such as /contests'),
  startsAt: z.string().datetime({ message: 'Enter a valid start date in UTC' }),
  endsAt: z.string().datetime({ message: 'Enter a valid end date in UTC' }),
}).refine(round => Date.parse(round.endsAt) > Date.parse(round.startsAt), {
  message: 'End must be after start', path: ['endsAt'],
});
export const scheduleSchema = z.array(roundSchema).max(20, 'Keep at most 20 scheduled rounds');
export type LiveRound = z.infer<typeof roundSchema>;
export const activeRounds = (rounds: LiveRound[], now: number) => rounds
  .filter(round => Date.parse(round.startsAt) <= now && now < Date.parse(round.endsAt))
  .sort((a, b) => Date.parse(a.endsAt) - Date.parse(b.endsAt));
export function hoursRemaining(endsAt: string, now: number) {
  const hours = Math.max(1, Math.ceil((Date.parse(endsAt) - now) / 3600000));
  return `Ends in ${hours} ${hours === 1 ? 'hour' : 'hours'}`;
}
