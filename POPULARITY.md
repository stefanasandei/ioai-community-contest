# Updating task popularity

**Manual only:** follow this guide only when explicitly asked to update popularity ratings. Adding tasks, opening the site, building, or deploying must not trigger a refresh. This does not change difficulty or insightfulness ratings.

## Refresh

The updater currently lives outside this repository at `C:\Users\Antony\aicc_popularity`. Another maintainer needs a copy of that folder, Python with numpy/pandas/requests/scipy, and their own Kaggle token at `~/.kaggle/access_token`. Never commit tokens.

1. Add new Kaggle tasks to that folder's `tasks.csv`, matching its header. The current columns are `slug,title,difficulty,round`. Use the exact website task name and displayed round number (Round 0 = `0`). Do not add a category value unless the header includes `category`.
2. Run in PowerShell:

   ```powershell
   Set-Location "$env:USERPROFILE\aicc_popularity"
   python refresh.py
   ```

3. After a successful run, review `popularity.json`. From the **website repository root**, merge the Kaggle output with saved scores from other series. Replacing the whole file would erase beginner ratings:

   ```powershell
   $existingPopularity = @(Get-Content -LiteralPath 'src/data/popularity.json' -Raw | ConvertFrom-Json)
   $kagglePopularity = @(Get-Content -LiteralPath "$env:USERPROFILE\aicc_popularity\popularity.json" -Raw | ConvertFrom-Json)
   $otherSeriesPopularity = @($existingPopularity | Where-Object { $_.series -and $_.series -ne 'main' })
   $mergedPopularity = ConvertTo-Json -InputObject @($kagglePopularity + $otherSeriesPopularity) -Depth 10
   [System.IO.File]::WriteAllText((Join-Path (Get-Location) 'src/data/popularity.json'), $mergedPopularity, [System.Text.UTF8Encoding]::new($false))
   ```

4. Check `/contests?sort=popular`: task names/rounds must match, both sort directions must work, and unscored tasks must stay last. Review the diff; commit/push only when requested. The website uses the saved scores; it never contacts Kaggle or recalculates them on its own.

## Scoring notes

The script combines age-adjusted notebook upvotes (75%) and participating teams (25%), shrinks estimates toward mature-task medians, then rescales to 0–100. Default time constants are 51.2 and 8.6 days. It exports confidence and uses teams alone when no public notebook exists.

A useful time to request a refresh is after a round closes, then monthly while scores mature. There is no schedule or automatic refresh. Do not use `--refit` unless specifically requested. Nitro Judge tasks need separately supplied metrics; this updater cannot fetch them. Tasks absent from the output remain unranked.

## November 3, 2026 snapshot

The saved data now includes all 36 Kaggle tasks through Round 12, refreshed with
the existing formula and default time constants (no refit). Recent rounds retain
provisional confidence. `asOf` records the snapshot date.

Beginner rounds have their own series keys, so Beginner Round 0 cannot collide
with Main Round 0. SprawdzAI has no comparable notebook-vote signal: beginner
popularity is a provisional participation estimate within that series,
`100 × task participants / most-attempted task participants`.
The [Test leaderboard](https://sprawdzai.org/contest/77/ranking), including practice,
shows 9 participants for Restoring Image Size, 14 for Piano Chord Challenge,
11 for Who Are the Impostors, and 4 for Grid Puzzle Reconstruction. Zero-point
attempts count; missing scores do not. These counts are separate from the
contest-window standings. Compare scores within a series, not between platforms.
