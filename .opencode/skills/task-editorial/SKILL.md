---
name: task-editorial
description: Write MDX editorial articles explaining AICC competition solutions
license: MIT
compatibility: opencode
metadata:
  audience: maintainers
  workflow: general
---

# Skill: task-editorial

Write high-quality MDX editorial articles that explain AI competition solutions. Editorials are published at `/solutions/round-{N}/{task-slug}` on the AICC website and must follow strict formatting, design, and quality conventions.

## Prerequisites

This skill depends on two external tools:

- **`jupyter-notebook` skill** — provides the `ipynb` CLI for reading `.ipynb` notebooks. Activate it before exploring notebooks.
- **Solutions repository** at `/home/stefan/Documents/aicc-solutions` — contains solution notebooks, baselines, and task statements.

## Workflow

### 1. Gather sources

Find and read all source material for the task:

| Source | Path |
|---|---|
| Task statement | `round-{N}/statements/{task-name}.md` |
| Solution notebook | `round-{N}/{task-name}.ipynb` |
| Baseline notebook | `round-{N}/baseline/baseline-{task-name}-aicc-round-{N}.ipynb` |

Read the statement first to understand the problem, constraints, evaluation metric, and baseline score. Then explore both notebooks using the `ipynb` tool:

```bash
ipynb cells notebook.ipynb    # list all cells with type and index
ipynb cat notebook.ipynb N    # read cell N source
```

Read every markdown cell (for author commentary and insights) and every code cell (for implementation details). Compare baseline vs. solution to identify the key improvements — architecture changes, data strategies, training tricks, optimizer choices.

Also check the existing editorial directory for format reference:

```
src/solutions/round-{N}/
```

### 2. Write the editorial

Create the file at `src/solutions/round-{N}/{task-slug}.mdx`.

Derive the slug from the task name:
```
lowercase -> strip special chars -> spaces to hyphens -> trim
```

**Structure** — Follow a scientific paper format:

| Section | Content |
|---|---|
| Abstract | One-paragraph summary: problem, approach, key innovations, final score vs baseline |
| 1. Introduction | Problem context, constraints, why this task matters |
| 2. Problem Definition | Formal task formulation with LaTeX, evaluation metric, constraints from the statement |
| 3. Data & Tokenization | Dataset, preprocessing, tokenizer design, any special data strategies (chunking, augmentation) |
| 4. Model Architecture | Architecture description with justification for every component choice |
| 5. Training Methodology | Loss, optimizer, schedule, any multi-phase training, curriculum design |
| 6. Inference | How predictions are made at test time, any packing/padding strategies |
| 7. Results | Quantitative table comparing baseline vs solution, ablation reasoning |
| 8. Discussion | Why the approach works, design principle analysis, comparison table |
| 9. Conclusion | Summary of innovations and results, attribution |

**Formatting rules:**

- Use MDX with LaTeX: inline `$...$`, display `$$...$$`
- Code blocks always specify a language: ` ```python `, ` ```text `
  - **Never use bare ` ``` ` without a language** — `rehype-prism-plus` will try to auto-detect and may guess `math`, which isn't registered in refractor
- For inline code, use single backticks: `` `pack_padded_sequence` ``
- For ASCII-only text with no syntax, use ` ```text ``
- **Use custom React components** for tables, diagrams, and structured visuals (see Component catalog below)
- **Never use markdown pipe tables** (`| col1 | col2 |`) — they render poorly. Always use `<MDXTable>` instead

### 3. Add custom components

Reference components directly in MDX — they are provided via `<MDXProvider>` and `<MDXContent components={...}>`:

```mdx
<ModelArchitecture caption="Optional caption explaining the diagram." />

<PhaseTable />

<MDXTable caption="Optional table caption.">
  <MDXThead>...</MDXThead>
  <MDXTbody>...</MDXTbody>
</MDXTable>
```

All components are in `src/components/solutions/` and exported from `src/components/solutions/index.ts`.

### 4. Verify

```bash
bun run build
```

The build must succeed with zero errors. Check that the new chunk appears in `dist/assets/autocorrect-*.js`.

Then start the dev server and navigate to `/solutions/round-{N}/{task-slug}` to visually verify. Check for runtime errors in the browser console.

### 5. Register the route

Add a `"blog"` field to the task entry in `src/data/contests.json`:

```json
{
    "name": "Autocorrect",
    "type": "NLP",
    "kaggle": "...",
    "solution": "...",
    "blog": "/solutions/round-1/autocorrect",
    "author": "...",
    "practiceStatus": "..."
}
```

---

## Design conventions

### ASCII only

Everything must be pure ASCII — **no Unicode characters anywhere**. Not in prose, not in code blocks, not in component source. Replace:

| Character | Replace with |
|---|---|
| Em dash `--` | Hyphen `-` or rephrase the sentence |
| En dash `-` | Hyphen `-` |
| Arrows `-->` `<--` | Text: `fwd`, `bwd`, or rephrase |
| Subscripts `v0` | `v0`, `h0_fwd`, etc. |
| Superscripts `10^-3` | `4e-3`, `1e-3` in code; `4 x 10^-3` in prose with LaTeX `$4 \times 10^{-3}$` |
| Multiplication sign `x` | Letter `x` or LaTeX `$\times$` |
| Minus sign `-` | Hyphen `-` or LaTeX `$-$` |

Run a verification pass:
```bash
python3 -c "
with open('path/to/file') as f:
    for i, line in enumerate(f, 1):
        for c in line:
            if ord(c) > 127:
                print(f'L{i}: U+{ord(c):04X} {c!r}')
"
```

### Colors

The AICC brand colors are defined in `tailwind.config.ts` and `index.css`:

- `aicc-purple` (`#8C00FF`) — primary, good for main architectural blocks
- `aicc-orange` (`#FF6600`) — secondary, good for contrasting paths
- `aicc-violet` (`#4A008C`) — darker purple
- `aicc-red` (`#FF3300`) — destructive/alert only

**Never use `aicc-teal` (`#00CCFF`)** — it has poor contrast against white backgrounds in light mode and against dark backgrounds in dark mode. Use these Tailwind colors instead:

- `sky-*` — good for light/accent blocks, high contrast in both modes
- `indigo-*` — good for intermediate stages between purple and emerald
- `emerald-*` — good for output/success stages
- `amber-*` — good for secondary paths (alternative to orange)
- `rose-*` — good for projection/transformation stages
- `gray-*` — good for input/neutral stages
- `violet-*` — good for forward-path RNN blocks

Use `{color}-50` for backgrounds, `{color}-400` for borders, `{color}-800` for text in light mode, and `{color}-200` for text in dark mode. Include explicit `dark:` variants:
```
border-sky-400 bg-sky-50 text-sky-800 dark:border-sky-600 dark:bg-sky-950/40 dark:text-sky-200
```

### Typography

Every component must have a clear typographic hierarchy. Use these classes consistently:

| Level | Classes |
|---|---|
| Eyebrow label | `text-[10px] font-bold uppercase tracking-[0.18em]` |
| Section title | `text-xs font-bold uppercase tracking-wider` |
| Card/box title | `text-base font-bold tracking-tight` |
| Body text | `text-sm leading-relaxed` |
| Caption | `text-xs text-gray-600 leading-relaxed` |
| Monospace label | `font-mono text-sm font-bold` |
| Monospace value | `font-mono text-xs font-bold` |
| Metric label | `text-[10px] font-semibold uppercase tracking-wider text-gray-500` |
| Metric value | `font-mono text-sm font-bold` |

The monospace font is **Fira Code** — it's imported in `index.css` and configured globally as `'mono': ['Fira Code', 'monospace']` in `tailwind.config.ts`. Just use the `font-mono` class.

### Layout

- Use `not-prose` on custom component roots to escape Tailwind Typography's styling
- Use `my-10` for vertical spacing between sections
- Use `rounded-xl` or `rounded-2xl` for card/container borders
- Use `border border-gray-200 dark:border-white/10` for containers
- Use `shadow-sm` for subtle elevation
- Use `bg-white dark:bg-white/5` for card backgrounds

---

## Component catalog

All components live in `src/components/solutions/` and are exported from `src/components/solutions/index.ts`.

### MDXTable

Styled wrapper for tabular data. Use with the shadcn-style sub-components.

```mdx
<MDXTable caption="Results comparison">
  <MDXThead>
    <MDXTr>
      <MDXTh>Column</MDXTh>
      <MDXTh align="center">Value</MDXTh>
    </MDXTr>
  </MDXThead>
  <MDXTbody>
    <MDXTr highlight="winner">
      <MDXTd><strong>Best result</strong></MDXTd>
      <MDXTd align="center"><strong>0.036</strong></MDXTd>
    </MDXTr>
    <MDXTr highlight="loser">
      <MDXTd>Baseline</MDXTd>
      <MDXTd align="center">0.094</MDXTd>
    </MDXTr>
  </MDXTbody>
</MDXTable>
```

**Props:**
- `caption?: string` — optional figure caption
- `MDXTh` / `MDXTd` — `align?: "left" | "center" | "right"`
- `MDXTr` — `highlight?: "winner" | "loser"` (green highlight or gray dim)

### ModelArchitecture

Academic-style vertical flow diagram showing the model's forward pass.

```mdx
<ModelArchitecture caption="The BiGRU processes characters in both directions, concatenates hidden states, and projects to vocabulary space." />
```

**Props:**
- `caption?: string` — optional figure caption

The diagram shows (top to bottom): input characters -> embedding -> bidirectional GRU (two columns: forward / backward) -> concatenation -> linear projection -> argmax decode -> output characters. Each stage has a colored border, dimension annotation, and Lucide icon.

**When to use:** Any model with a clear data flow (encoder-only, encoder-decoder could be adapted).

### PhaseTable

Three-card visualization of a multi-phase training curriculum.

```mdx
<PhaseTable />
```

**No props** — edit the `PHASES` array directly in the component to customize phases. Each phase card shows: accent color, icon, title, objective description, and metrics (input, epochs, LR, batch).

**When to use:** Solutions that use curriculum learning, progressive training, or multi-stage optimization.

---

## Common pitfalls

### Pitfall 1: MDXProvider doesn't auto-inject components

MDX 3 compiles content to a function that reads `props.components`. Components passed only via `<MDXProvider>` context are ignored for the top-level MDXContent. You must pass components as both:

```tsx
<MDXProvider components={mdxComponents}>
  <MDXContent components={mdxComponents} />
</MDXProvider>
```

The provider handles nested MDX content; the prop handles the root content.

### Pitfall 2: Bare fenced code blocks trigger `math` auto-detection

If you write ` ``` ` without a language, `rehype-prism-plus` auto-detects the language and may guess `math`, which isn't registered in refractor. Always specify a language: ` ```python `, ` ```text `, etc.

### Pitfall 3: Angle brackets in content break MDX

Tokens like `<UNK>`, `<PAD>`, `<EOS>` inside `<pre>` or fenced code blocks are interpreted as HTML/JSX tags. In plain text outside code blocks, use HTML entities: `&lt;UNK&gt;`. Inside fenced code blocks (```text```), the content is literal and safe.

### Pitfall 4: Markdown pipe tables render poorly

Tailwind Typography's `prose` class provides minimal table styling. Pipe tables look flat and inconsistent with the design system. Always use `<MDXTable>` instead.

### Pitfall 5: `remarkMath` in wrong plugin array

`remarkMath` must be in `remarkPlugins`, not `rehypePlugins`. If it's in the wrong array, it operates on the wrong AST type and may produce malformed `language-math` code blocks. The correct `vite.config.ts` structure is:

```ts
mdx({
  remarkPlugins: [remarkMath],
  rehypePlugins: [
    rehypeSlug,
    [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    rehypeKatex,      // KaTeX runs BEFORE Prism
    rehypePrism,       // Prism runs LAST
  ]
})
```

### Pitfall 6: Non-ASCII characters slip in

Unicode is everywhere: copy-paste from notebooks, Wikipedia, even typing `--` in VS Code auto-converts to `--`. Run the Python verification script after writing to catch these. The most common offenders: em dashes, arrows, subscripts, superscripts, and multiplication signs.

### Pitfall 7: VS Code auto-formatting

MDX files with JSX components may be auto-formatted in ways that break the layout. Review the file after any auto-save or format-on-save. Keep the JSX components on their own lines for readability.

---

## Before submitting

Run this checklist:

- [ ] Task statement, solution notebook, and baseline notebook all read and understood
- [ ] Editorial covers all sections (Abstract through Conclusion)
- [ ] All code blocks specify a language
- [ ] All tables use `<MDXTable>`, not markdown pipe syntax
- [ ] Custom components used where appropriate (architecture diagram, phase table)
- [ ] Zero non-ASCII characters (run the verification script)
- [ ] No `aicc-teal` colors anywhere
- [ ] Typography hierarchy is consistent across all components
- [ ] Dark mode variants provided for every color class
- [ ] `bun run build` succeeds with zero errors
- [ ] `"blog"` field added to `contests.json`
- [ ] Editorial visually verified in browser at `/solutions/round-{N}/{task-slug}`
