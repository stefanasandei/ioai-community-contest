# Update live round announcements

1. Open `/admin/rounds` on the latest deployed site and add/edit rounds. Enter all dates in **UTC** and a round link (HTTPS or `/contests/...`).
2. Copy the proposed JSON. Open the GitHub editor, replace `src/data/live-rounds.json`, and commit to a **new branch** to propose a PR (fork first if GitHub asks).
3. Review the diff, keeping any other scheduled rounds. Merge and deploy the site.

The homepage shows variant 2 only while `startsAt <= now < endsAt`, with remaining hours rounded up. Multiple active rounds each get a row. An empty array hides the banner. No refresh command or scheduled workflow is needed; an open page checks the clock every second.

The editor does not save to GitHub or publish changes itself. GitHub handles authentication and PR permissions. This feature and its initial empty JSON file must be merged before the GitHub edit link can work on main. Local sample previews never enter the published schedule.
