# Task atlas

Open `/tasks/atlas` or select **Explore task atlas** on `/tasks`. The old `/tasks/clusters` URL redirects to the atlas.

`tasks.json` contains the 217-task embedding snapshot supplied on 2026-09-08. It stores coordinates and cluster memberships; it is not regenerated at build time. Adding a task to the problem bank does not add a map position automatically.

Names and contest labels come from the same `getSheetTasks()` data as `/tasks`, matched by problem URL. Shared contest URLs are disambiguated in `data.ts`. When changing URLs or replacing the snapshot, verify every entry still has a unique problem-bank match. Update the snapshot explicitly when new embeddings are available; do not invent positions.

The map is lazy-loaded, uses no external map service, and stops rendering when idle. The entry animation respects reduced motion. Open the atlas directly and through the button when checking desktop and mobile layouts.
