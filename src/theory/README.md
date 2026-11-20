# Editing Theory

The syllabus outline lives in [`../data/theory.ts`](../data/theory.ts). It has five sections, each containing categories and topics. The visible order is the order in that file. Keep existing section and topic IDs stable so visitors' completion cookies continue to point to the same topics.

To add a topic, add a line in the appropriate `category(...)` block using `Title|Theory`, `Title|Practice`, or `Title|Both`. A URL-safe ID is generated from the title. If you need a new category or main section, copy an existing `category(...)` or section object.

To write a lesson, add a matching `<topic-id>.mdx` file in this folder. For example, `Python Basics (Loops, Functions, etc.)` maps to `python-basics-loops-functions-etc.mdx`. The existing Python file is a working example. MDX renders with the same components, math, code highlighting, and article typography as solution editorials. A topic with no MDX file shows an honest “Lesson in preparation” message.

To add resource buttons or a recommended task, edit `topicDetails` near the top of `../data/theory.ts`. Use the topic's generated ID as its key:

```ts
'python-basics-loops-functions-etc': {
  resources: [{ label: 'Python tutorial', url: 'https://example.org/python' }],
  task: { label: 'Recommended AICC problem', url: '/tasks' },
},
```

Use the real resource and task URLs when available. Run `npm run build` after editing; missing MDX files do not block the build.

Progress is stored in a small, one-year browser cookie (`aicc_theory_progress`). It is per browser and does not sync between devices. Reordering topics is safe; renaming an existing topic changes its generated ID, so set that topic's ID explicitly if you want to preserve saved progress.
