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

3. After a successful run, review `popularity.json`. From the **website repository root**, copy it into the website data file:

   ```powershell
   Copy-Item -LiteralPath "$env:USERPROFILE\aicc_popularity\popularity.json" -Destination 'src/data/popularity.json'
   ```

4. Check `/contests?sort=popular`: task names/rounds must match, both sort directions must work, and unscored tasks must stay last. Review the diff; commit/push only when requested. The website uses the saved scores; it never contacts Kaggle or recalculates them on its own.

## Scoring notes

The script combines age-adjusted notebook upvotes (75%) and participating teams (25%), shrinks estimates toward mature-task medians, then rescales to 0–100. Default time constants are 51.2 and 8.6 days. It exports confidence and uses teams alone when no public notebook exists.

A useful time to request a refresh is after a round closes, then monthly while scores mature. There is no schedule or automatic refresh. Do not use `--refit` unless specifically requested. Nitro Judge tasks need separately supplied metrics; this updater cannot fetch them. Tasks absent from the output remain unranked.
