work in progress; website for the IOAI community contest (unofficial)

Manual maintenance: [Update task popularity](POPULARITY.md).

Main rounds live in `src/data/contests.json`. Beginner rounds live separately in
`src/data/beginner-contests.json` and use their own numbering. Select the series
on `/contests`, or link directly to `/contests?series=beginner`.
Use `sprawdzai` for SprawdzAI task links. Leave unpublished solution links empty;
only add authors and difficulty labels when confirmed.

Leaderboard sources and scoring: [Leaderboard snapshots](docs/leaderboards.md).

Development and Netlify installs use pnpm 10.30.3 (pinned in `packageManager`):

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm build
pnpm test:blog-assets
pnpm check:performance
pnpm lint
```

Commit `pnpm-lock.yaml` with dependency changes. The npm lockfile is also kept
for npm users; Netlify selects pnpm. Types imported by application code must be
direct dependencies, even when npm makes a transitive copy available locally.
