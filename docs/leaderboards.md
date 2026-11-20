# Leaderboard snapshots

Round 12 and Beginner Round 0 were captured on November 3, 2026. These are static
snapshots; the website does not fetch results at runtime.

## Main Round 12

The existing raw and normalized CSV files include the final downloaded Kaggle
leaderboards for all three tasks. Join individual participants by Kaggle username;
exclude rank-zero host submissions from the contestant standings. There are 14
distinct contestants across the three tasks. Missing results stay missing.

Normalized points are `100 × (score − baseline) / (benchmark − baseline)`, capped
to 0–100 per task. Sum the available task points; missing tasks contribute zero
to the total, while their cells display a dash. Equal totals share a place.

| Task | Baseline | 100-point benchmark | Source |
| --- | ---: | ---: | --- |
| Put the Sounds Back Together | 0.3838 | 0.89438 | Published evaluation baseline; final host `ref` submission |
| Alakazam | 0.3325 | 0.9075 | Final host `baseline` and best host solution submissions |
| Moonlight At Midday | 0 | 0.9864 | Zero baseline and winning contestant score; no host anchors were published |

The first baseline is published to four decimal places. Moonlight's benchmark is
the winning score, not an official reference solution. The benchmark is recorded
here; the extra explanatory paragraph was removed from the page at the user's
request. Source leaderboards:

- [Put the Sounds Back Together](https://www.kaggle.com/competitions/put-the-sounds-back-together-aicc-round-12/leaderboard)
- [Alakazam](https://www.kaggle.com/competitions/alakazam-aicc-round-12/leaderboard)
- [Moonlight At Midday](https://www.kaggle.com/competitions/moonlight-at-midday-aicc-round-12/leaderboard)

## Beginner Round 0

`src/leaderboard/beginner-round-0.json` preserves the **Contest** view of the
[SprawdzAI leaderboard](https://sprawdzai.org/contest/77/ranking): nine participants,
with scores from their competition windows. It excludes later practice results.
Scores and totals use the whole-point precision displayed by SprawdzAI. Preserve
ties and missing cells. The four task columns are reordered to match the contest
card, rather than the platform's column order.

Beginner leaderboards use `/contests/beginner-round-0/leaderboard`. Their numbering
and data lookup are separate from main rounds and the development-only Elo preview.
