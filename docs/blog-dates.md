# Blog publication dates

Each blog JSON contains a `publishedAt` date in `YYYY-MM-DD` format. Cards and article headers show this date; the blog index sorts newest first, with URL name as a deterministic tie-breaker for posts sharing a date. The newest post is featured. The blog editor includes this field in new exports, and builds reject missing or invalid dates.

The existing posts had no date metadata. Their initial publication dates are backfilled from the commits that first added them to this repository, using each commit's recorded calendar date. These are site publication dates, not claims about when the author first drafted the notebook. Later edits and thumbnail changes do not change publication order.

| Blog | Published | First-added commit |
| --- | --- | --- |
| Funni Optimizers | September 7, 2026 | `e13e1e9` |
| How to Approach IOAI Problems: Read, Set Up, and Start | October 25, 2026 | `2426c60` |
| Linear Algebra and Eigenvalues | October 26, 2026 | `f4f072d` |
| Neural Ordinary Differential Equations | October 26, 2026 | `f4f072d` |
