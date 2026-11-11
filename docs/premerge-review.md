# Pre-merge review — November 3, 2026

Reviewed PR #54 against upstream main `a655cdcf`. No merge conflicts were present.

## Issues found and fixed

- **Netlify preview failed while the local build passed.** The deployment log
  reported missing `mdx/types` in the solution and resource readers. Declare
  `@types/mdx` directly, pin pnpm 10.30.3 (the deployment's version), and replace
  the incompatible pnpm lockfile with one imported from the npm dependency lock.
  A fresh isolated pnpm install with `--frozen-lockfile` and production build pass.
  The deployment-fix commit `9810db6` also received a successful Netlify preview.
- **Unpublished solutions offered a broken notebook link.** Solution pages now
  distinguish loading, a failed download, an unpublished solution, and a real
  notebook fallback. They only show notebook links when a URL exists, and failed
  article downloads offer a reload action. Pending imports are cancelled logically
  on navigation so an old result cannot overwrite a different solution.
- **Two diagrams were broken in Massive Problem.** Correct the VAE and scANVI
  URLs to the existing public assets, including the VAE's `.jpg` extension.
- **The route error boundary remounted healthy pages on every pathname change.**
  Reset only failed boundaries when navigating, retaining component state used by
  syllabus tabs for scroll restoration. Navigation out of an error and reload
  recovery still work in a deliberately failing-download test.
- **The dependency lock contained older vulnerable versions.** Apply the
  compatible fixes offered by npm without forced major upgrades, then synchronize
  the pnpm lockfile and repeat the isolated installation, build, and browser checks.

## Validation

- Production build, application/build-tool typechecks, five notebook-preservation
  tests, performance budgets, and full lint pass. Lint still reports seven existing
  Fast Refresh warnings and zero errors.
- Check all 43 contest tasks for known authors, difficulties and valid URL shapes;
  all team flags and 35 guide files exist; 40 popularity entries are finite and
  uniquely keyed. Raw and normalized Round 12 results agree, beginner totals and
  ties agree, and all historical CSV columns match upstream main.
- Browser checks cover all 24 published solution routes and 35 resource route
  visits (29 distinct destinations, including section redirects). The final pass
  found no missing article state, broken loaded images, or horizontal overflow.
- All four blogs render with dates and notebook links. The mathematical articles
  still render 148, 241 and 110 equation elements. Build checks verify downloaded
  notebooks deep-equal the originals.
- Check every main leaderboard, beginner standings, Round 12 raw/normalized
  switching, contest series/popularity, Team flags and credits, and atlas entry
  and return. Narrow-layout checks used an observed 480 CSS-pixel viewport;
  this is browser emulation, not a real-device performance test.
- A delayed test server rejects the first Team chunk. The error screen appears,
  Home remains reachable, and reloading Team succeeds. An old local preview tab
  also recovered after its files were replaced by a build.
- Final initial JavaScript is approximately 450 KB / 133.5 KB gzip, with an 8.2 KB
  blog listing module. The initial JavaScript budget remains 170 KB gzip.

## Remaining maintenance, not a claim of zero flaws

- Dependency audit still reports **26 package entries: 2 high, 20 moderate,
  4 low, 0 critical**. These include transitive duplicates. High entries are
  Vite (development-server/editor advisories) and Zod (oversized-collection
  validation). The audit proposes major upgrades for them; those migrations are
  not included here. The published site is static, but this is not a security
  sign-off, and local tools and admin validation still deserve an upgrade pass.
- The 18 unmapped atlas problems, unverified personal achievements, unknown
  Discord handles, and external popularity updater remain documented in
  [site-quality-audit.md](site-quality-audit.md).
- Not every external resource destination or the mathematical correctness of
  every article was audited. Production analytics delivery and real-device
  performance are outside this check.
