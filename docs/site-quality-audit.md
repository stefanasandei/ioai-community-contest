# Website quality audit — November 3, 2026

This audit covers the 23 team identities and displayed achievement claims, all 14 contest records and 43 tasks, blog metadata, local solution/resource targets, flags, homepage copy and counts, task-atlas coverage, popularity keys and maintenance instructions, and repository build/install checks. It does not certify every external learning-resource URL or the technical correctness of every notebook/article.

## Confirmed omissions and defects fixed

| Finding | Change |
| --- | --- |
| Wang Zerui was listed only as “Zerui / IOAI '25,” omitting both medals. | Use Wang Zerui, IOAI 2025 Silver and 2024 Gold, with the existing `iamnumber4` handle. Sources and all 23 identity checks are in [team-sources.md](team-sources.md). |
| Contributor achievement records were incomplete, and contributor rows rendered only names even when a bio/handle existed. | Add verified results for Malo, Theo, Ellison, Gheorghică, Martin, Low Yu Xuan, and Zane; render biographies and known handles. Add Jithun's already-published JEXo handle. |
| Wang Jiayu and Carson have equal official Hall of Fame medal records but only Carson's position was shown. | State joint 2nd for both using the official all-editions medal ranking. |
| Contributor names contained “Elison” and “Gheorghiță.” | Correct to Ellison and Gheorghică. Ellison's identity was confirmed by the user; Gheorghică's spelling comes from Romania's official national organizer. |
| Eleven task credits used different nicknames or abbreviated names for the same authors. | Standardize to the Team display names for Georgios, Yue Heng, Dauzhan, and Luvidi. Keep former labels in `authorAliases` so searches for Gior, Walnit, Daujohn, and old name orders still work. Normalize Dauzhan's testimonial name too. |
| The homepage still described only monthly contests on Kaggle. | Name main/beginner formats and Kaggle, Nitro Judge, and SprawdzAI. Counts remain derived: 14 contests, 43 tasks. |
| The homepage had no main heading and nested a button inside a link. | Give its existing subtitle a semantic `h1` and use a single link for the archive action, retaining the visual design. |
| Biographical team cards omitted bottom padding when a description was present. | Give every card consistent padding. |
| Atlas search silently covered 217 of the bank's 235 entries. | Show the actual coverage and link an empty map search to the full problem-bank search. Do not invent coordinates for the 18 unmapped entries. |
| The clean-install command rejected the dependency lockfile because PostHog and its dependencies were missing. | Synchronize the lockfile without changing declared dependency ranges. Verify the clean-install dry run. |
| The production build skipped TypeScript checks; a separate check reported eight errors in MDX rendering props, task-topic types, homepage contest types, and resource-editor select values. | Fix the types and string guards, add `npm run typecheck`, and run it as part of `npm run build`. |
| Stylesheet imports came after Tailwind output, causing import-order warnings and risking ignored font imports. | Move imports before generated CSS. |
| Syllabus scroll restoration read navigation state without tracking state changes. | Include navigation state in the effect dependencies. |
| Popularity maintenance instructed maintainers to overwrite the entire file with Kaggle-only output. | Merge other series' saved entries so a future Kaggle refresh preserves the four beginner ratings. No popularity refresh was performed during this audit. |

## Remaining limits and claims needing a better source

- **18 problem-bank entries have no supplied atlas coordinates.** They are five Singapore 2026 entries, five China/NOAI entries, and eight Philippines 2026 entries. They remain available in the problem bank and through the atlas fallback search; the map requires a new embedding snapshot to include them.
- **Not every personal biography is independently sourced.** Apostolidis's national top-12/top-25 claims, Yue Heng's national/hackathon/university details, and existing school/university statements are member-provided. They were not silently replaced or expanded. Chon's reported CEOAI participation and Jithun's official individual IOAI result remain unmatched.
- **Some Discord handles are unknown.** Known handles render in both author cards and contributor rows; missing handles were not guessed.
- **Blog dates are site-publication dates from first-added Git commits**, not verified notebook drafting dates. Same-day posts use a stable URL-name tie-breaker; this is documented in [blog-dates.md](blog-dates.md).
- **Popularity is a dated estimate, not live analytics.** Beginner scores use participation alone; the three Nitro Judge tasks have no comparable popularity metrics. The Kaggle refresh tool still lives outside this repository, which remains a portability limitation.
- **Full lint has seven warnings, with no errors.** These are existing Fast Refresh export warnings in shared UI files. Build bundle-size warnings also remain; no rendering failure was attributed to them in this audit.

## Validation

Static checks verified all 43 contest tasks have a known author, difficulty, and valid URL shape; all referenced solution articles and 35 resource guides exist; every listed team country has a local flag; all 40 popularity entries have finite scores and unique series/round/task keys. This checks references and schema, not availability of every external website. Existing team memberships and contest/task order are preserved.

The production build now includes a passing TypeScript check. Full lint passes with the seven warnings noted above. The clean-install dry run passes after the lockfile repair.

Browser checks covered the homepage, both contest series, problem bank, blogs, resources, roadmap, and an internal solution article. No broken loaded images or horizontal overflow were observed on those routes. Searches for Gior, Walnit, Daujohn, and Luvidi Alghari return the canonical author credits. An unmapped task's atlas search correctly links to its full-bank result. Narrow-layout checks at 480 pixels covered the team, atlas, and homepage, including flags, coverage text, counts, and the homepage heading/link markup.
