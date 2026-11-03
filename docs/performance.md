# Page loading improvements

Measured November 3, 2026 against commit `b43dbcf`, using production builds with the same installed dependencies. Sizes below are decimal KB, not load-time measurements.

| Download | Before | After |
| --- | ---: | ---: |
| Initial homepage JavaScript | 1,364.4 KB | 471.4 KB |
| Initial homepage JavaScript, gzip | 383.1 KB | 140.5 KB |
| Initial stylesheet | 207.0 KB | 175.0 KB |
| Blog listing JavaScript | 411.2 KB | 8.2 KB |
| Funni Optimizers article module | 958.6 KB | 44.7 KB |
| Linear Algebra and Eigenvalues article module | 650.2 KB | 43.5 KB |
| Neural Ordinary Differential Equations article module | 775.2 KB | 87.4 KB |
| How to Approach IOAI Problems article module | 242.4 KB | 12.2 KB |

The homepage loads about 65% less JavaScript (63% less after gzip). The blog listing module is about 98% smaller. These article/listing figures describe JavaScript only: images still download separately when needed, and the shared Markdown/math renderer downloads when an article is opened. They do not imply that the entire page, including images, is 98% smaller.

## Changes

- Keep the homepage eager, and load other routes independently, including editor pages. Preserve existing blog and atlas loading views.
- Give failed route downloads a usable navigation shell and a reload action. This covers interrupted connections and open tabs referencing files from an older deployment, without an automatic reload loop.
- Load configured PostHog asynchronously during idle time, with a two-second scheduling timeout. Buffer up to 100 explicit events/logs during initialization; initialization failure cannot block the site. Existing configuration and reporting options remain in use. Automatic analytics starts when the SDK initializes.
- Emit notebook plots and attachments as separately cacheable image assets, shared with blog covers where identical. Keep source JSON unchanged. Emit the original complete notebook for the download link, including all original outputs and metadata.
- Load equation and syntax-highlighting styles with the pages that use them. Resource guides now explicitly import these styles instead of depending on the solution page's eager import.
- Consolidate Google Fonts into one stylesheet with Inter/Fira Code variable weight ranges. Remove unused Font Awesome and duplicate CSS font imports.

A separate build with non-secret test analytics configuration had a 472.3 KB initial JavaScript file (140.9 KB gzip); the 368.1 KB SDK remained a separate asynchronous module. Live analytics delivery was not tested against the production account.

## Verification

Run with Node 22.6+ (the asset tests use Node's TypeScript stripping):

```sh
npm run build
npm run test:blog-assets
npm run check:performance
npm run lint
```

The build checks both application and build-tool TypeScript. Five asset tests verify original notebook preservation, extracted image bytes, alternate image formats, attachments, and unchanged non-image outputs. The performance check enforces a 170 KB gzip budget for initial JavaScript, a 20 KB blog-listing budget, separate route downloads, and complete emitted notebook downloads. Both the production assets and the development virtual modules/image endpoints were checked.

Browser checks covered homepage and Team navigation, main/beginner contest switching, author search, both new leaderboards, raw-score switching, problem bank to atlas and back, resource guides, an equation-heavy solution, all four blog articles, and a successful notebook download. The three mathematical articles rendered 148, 241, and 110 equation elements respectively. Protected editor routes displayed the sign-in gate; the missing-page route displayed its 404 page. No console errors were observed during the normal article/navigation checks.

An isolated test server delivered scripts/styles in 16 KB blocks every 80 ms, after a 150 ms delay, and deliberately rejected the first Team-page download. The homepage rendered under that delayed delivery. The failed navigation displayed the recovery screen, and its Reload button successfully opened Team. The server's request log confirmed that the homepage did not request other page modules or notebook bodies. This is a controlled functional test, not a Lighthouse score or a measurement on a real mobile network.

Seven pre-existing Fast Refresh lint warnings remain. The deferred Markdown/math renderer still exceeds Vite's 500 KB uncompressed chunk warning threshold; it is only requested for notebook rendering. Deployment compression, cache headers, real-device CPU performance, and all possible network failures are outside this local verification.

The browser viewport override did not change the observed viewport in this pass, so these checks do not claim a new narrow-screen or real mobile-device validation.

The subsequent [pre-merge review](premerge-review.md) fixes Netlify dependency
resolution, pins reproducible installs, and applies compatible dependency security
updates. That final build measures about 450 KB / 133.5 KB gzip for initial
JavaScript. The table above remains the original same-dependency comparison.
