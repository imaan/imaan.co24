# Claude Code — starter prompt

Copy-paste this whole message to Claude Code at the start of a session in this folder.

---

You are helping me run a static personal site that I host on **GitHub Pages**. The site is hand-written HTML/CSS/JS — no framework, no build step. I write blog posts as Markdown in `posts/` and ask you to convert each one into a matching `<slug>.html` file at the project root.

**Read these files first, in order, before doing anything else:**

1. `README.md` — overall design spec (tokens, layouts, components).
2. `AUTHORING.md` — Markdown conventions and the exact conversion contract you need to follow when turning posts into HTML.
3. `design_references/notes-on-ai-velocity.html` — the worked example of correctly converted output. Match this file's structure exactly when generating new posts.
4. `design_references/site.css` and `design_references/post.js` — already wired up; don't modify unless I ask.
5. `posts/notes-on-ai-velocity.md` — the matching Markdown source for the example. Compare it side-by-side with the `.html` so you understand the conversion rules in practice.

**Project setup, if it isn't already done:**

- Copy everything in `design_references/` to the project root (`index.html`, `writing.html`, `notes-on-ai-velocity.html`, `site.css`, `post.js`).
- Keep `posts/` as the source folder for Markdown.
- Move `README.md` and `AUTHORING.md` into a `docs/` folder (or leave at root — your call). They're not served pages.
- Confirm `index.html`, `writing.html`, and `notes-on-ai-velocity.html` open and render correctly from the project root.
- Add `.nojekyll` at the project root so GitHub Pages serves files as-is without Jekyll processing.

**The conversion workflow** — every time I add a new post:

1. I drop a new file at `posts/<slug>.md`.
2. I ask you "convert `posts/<slug>.md`".
3. You read `AUTHORING.md` (you can keep it in context across the session), parse the frontmatter, convert the body following the rules, write the result to `<slug>.html` at project root, and add a matching `<a class="post-row">` to `#posts` in `writing.html`.
4. You tell me which files changed.

**Things to watch:**

- Sidenote `:::` blocks must produce `<aside class="sn">` placed **immediately after** the paragraph that references them in the DOM. CSS Grid auto-flow uses that adjacency to align the card with its anchor on desktop. Don't group sidenotes elsewhere.
- `[^N]` becomes `<a class="sn-mark" href="#sn-N" data-sn-target="N">N</a>`. Numbers match what I wrote in the markdown; don't renumber.
- Code fences get tokenised with the `.tok-k` / `tok-f` / `tok-s` / `tok-n` / `tok-c` classes (see `AUTHORING.md` for which is which). Be careful — getting tokens wrong is the most common conversion error.
- The `topics` array in frontmatter must use strings from this fixed list: `Engineering`, `Process`, `Training`, `Writing`, `Startup`. If I add a new topic, also add it as a filter button in `writing.html`.

**What I don't want:**

- Don't introduce a build step. No npm, no bundlers, no preprocessor. Plain files only.
- Don't reformat or reflow existing HTML files. Touch the new post's HTML and the `writing.html` index — nothing else unless I ask.
- Don't add features I didn't ask for (search, RSS, tag pages, etc.). I'll ask when I want them.

**First task** — verify the setup. Confirm you can:

1. Read all five files in the list above without errors.
2. Open `design_references/notes-on-ai-velocity.html` in a browser and see a fully-rendered post (margin sidenotes, syntax-coloured code, the lot).
3. Open `design_references/writing.html`, click a topic in the sidebar, and watch posts filter.

Once verified, tell me you're ready and wait for me to drop the first new post in `posts/`.
