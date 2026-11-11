import { contestLeaderboards } from './leaderboard';

export type RatingHistory = { round: number; rating: number; change: number; place: number; field: number; points: number };
export type RatedEntry = { name: string; rating: number; history: RatingHistory[]; rank: number };

// Demonstration only. Official ratings will be uploaded separately from Round 11.
// One simultaneous multiplayer Elo update per round, K=64, averaged over opponents.
export function calculateDemoRatings() {
  const entries = new Map<string, RatedEntry>();
  const rounds = [...contestLeaderboards].sort((a, b) => a.roundNumber - b.roundNumber);
  for (const round of rounds) {
    const field = round.participants.filter(p => p.kind === 'participant' && p.username && p.scores.some(s => s !== null));
    if (field.length < 2) continue;
    for (const player of field) if (!entries.has(player.username)) entries.set(player.username, { name: player.username, rating: 1000, history: [], rank: 0 });
    const updates = field.map(player => {
      const previous = entries.get(player.username)!.rating;
      let difference = 0;
      for (const opponent of field) {
        if (opponent === player) continue;
        const actual = player.totalPoints === opponent.totalPoints ? .5 : player.totalPoints > opponent.totalPoints ? 1 : 0;
        const expected = 1 / (1 + 10 ** ((entries.get(opponent.username)!.rating - previous) / 400));
        difference += actual - expected;
      }
      const rating = previous + 64 * difference / (field.length - 1);
      return { player, rating, change: Math.round(rating) - Math.round(previous), place: 1 + field.filter(p => p.totalPoints > player.totalPoints).length };
    });
    for (const update of updates) {
      const entry = entries.get(update.player.username)!;
      entry.rating = update.rating;
      entry.history.push({ round: round.roundNumber, rating: Math.round(update.rating), change: update.change, place: update.place, field: field.length, points: update.player.totalPoints });
    }
  }
  const sorted = [...entries.values()].sort((a, b) => Math.round(b.rating) - Math.round(a.rating) || a.name.localeCompare(b.name));
  sorted.forEach((entry, i) => { entry.rank = i && Math.round(entry.rating) === Math.round(sorted[i - 1].rating) ? sorted[i - 1].rank : i + 1; });
  return { entries: sorted, rounds: rounds.map(r => r.roundNumber) };
}
