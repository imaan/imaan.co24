# Authoring guide — imaan.co

You write posts as Markdown in `posts/`. To publish, ask Claude Code to convert a post to HTML and wire it into the index. Everything stays as static files served by GitHub Pages.

This guide is what Claude Code reads each time to do the conversion. Keep it short and exact.

---

## File layout

```
/
├── index.html
├── writing.html                       — index, edit when adding a post
├── notes-on-ai-velocity.html          — example of converted output
├── site.css
├── post.js
├── posts/
│   ├── notes-on-ai-velocity.md        — example source
│   └── <slug>.md                      — new posts go here
└── AUTHORING.md                       — this file
```

The published HTML for a post sits **at the project root** as `<slug>.html` (next to `index.html`), not inside `posts/`. The `posts/` folder is the source.

---

## Frontmatter

Every post starts with YAML frontmatter:

```yaml
---
title: "Notes on AI velocity"
subtitle: "On quality, speed, and the second-order effect."
slug: "notes-on-ai-velocity"
topics: ["Engineering", "Process"]
order: 1
draft: false
---
```

Fields:

- **title** — page `<h1>` and `<title>`.
- **subtitle** — sub-line below the title.
- **slug** — filename of the output HTML (no extension). Determines the URL.
- **topics** — array of strings from the canonical list: `Engineering`, `Process`, `Training`, `Writing`, `Startup`. Used for both the post-header chips and the index filter. Add a new topic anywhere it appears (the topic list lives in `writing.html`'s filter buttons).
- **order** — integer; lower = earlier in the index list. Omit to push to the end.
- **draft** — `true` to skip publishing.

No `date` field. Posts are evergreen.

---

## Body — Markdown

Standard CommonMark for headings, lists, paragraphs, bold, italic, links, blockquotes, tables.

### Headings

`##` for section headings → `<h2>`.
`###` for subsection → `<h3>`.
Don't use `#` in body — the title comes from frontmatter.

### Code

Fenced code blocks with a language hint:

````markdown
```js
function useTracked(initial) { … }
```
````

At conversion time, tokenise into `<pre class="code">` with these span classes:

| Class | Use |
|---|---|
| `tok-k` | keyword (`function`, `const`, `return`, `new`, `true`, `false`, `null`) |
| `tok-f` | function name (the identifier directly following `function` or called via `name(`) |
| `tok-s` | string literal |
| `tok-n` | number / boolean / null |
| `tok-c` | comment (`//…`, `/* … */`) |

Inline code: `` `foo` `` → `<code class="inline">foo</code>`.

### Pull quotes

A top-level `>` blockquote with no attribution:

```markdown
> Quality is what you protect when you choose not to ship the second thing.
```

Convert to `<blockquote class="pull">…</blockquote>`. Don't escape — it's plain text.

### Tables

Standard pipe-table syntax. Convert to `<table class="tbl">`. Header row → `<thead><tr><th>…</th></tr></thead>`. No additional classes needed on cells.

### Video / embeds in body

```markdown
::: video src="..." caption="Demo on stream"
:::
```

Convert to:

```html
<div class="embed">Video — 16:9</div>
<p class="muted">Demo on stream</p>
```

For real production, replace the placeholder with a real `<iframe>` or `<video>` — the `embed` class just enforces the 16:9 box; what's inside is whatever the embed needs. For drafts, the placeholder is fine.

---

## Sidenotes

The signature feature. Two parts: an **anchor** inside the prose, and a **card** that sits next to it in the right margin (desktop) or as a collapsible card (mobile).

### Syntax

Use a footnote-style anchor in the prose, then define the note as a fenced block right after the paragraph that references it:

```markdown
The promise of AI in software isn't doing more things at once — it's
doing one thing far better, far faster.[^1]

::: sidenote kind="note" n=1
Speed without quality is a debt you pay down later, usually with interest.
:::

Three habits flip when you have a good coding agent on your shoulder.[^2]

::: sidenote kind="tweet" n=2 handle="@imaan"
Whenever I catch myself spawning a fifth experiment, I close my laptop
and re-read the brief.
:::
```

The note block **must come immediately after** the paragraph that references it. This is what lets CSS Grid auto-flow align the card with its anchor on desktop — don't move it elsewhere.

### Kinds

Four kinds, each with required attributes and a body convention:

#### `kind="note"`

Just text. No extra attrs. Body is one or more paragraphs.

```markdown
::: sidenote kind="note" n=1
Plain prose. Can be multiple sentences.
:::
```

→
```html
<aside class="sn" data-sn="1">
  <button class="sn-toggle"><span>Note 01</span><span class="sn-toggle-icon">+</span></button>
  <div class="sn-head">
    <span class="sn-n">01</span>
    <span class="sn-kind">Note</span>
  </div>
  <div class="sn-body">
    <p>Plain prose. Can be multiple sentences.</p>
  </div>
</aside>
```

#### `kind="tweet"`

Attrs: `handle` (required, with `@`). Body is the quote text (don't add surrounding quote marks; the template wraps in `"…"`).

```markdown
::: sidenote kind="tweet" n=2 handle="@imaan"
Whenever I catch myself spawning a fifth experiment, I close my laptop.
:::
```

→
```html
<aside class="sn" data-sn="2">
  <button class="sn-toggle"><span>Note 02</span><span class="sn-toggle-icon">+</span></button>
  <div class="sn-head">
    <span class="sn-n">02</span>
    <span class="sn-kind">Tweet</span>
  </div>
  <div class="sn-body">
    <p class="handle">@imaan</p>
    <p class="quote">"Whenever I catch myself spawning a fifth experiment, I close my laptop."</p>
  </div>
</aside>
```

#### `kind="link"`

Attrs: `href` (required). Body is the description.

```markdown
::: sidenote kind="link" n=3 href="https://paco.me/writing/react-hook-getter"
Inspired by Paco Coursey's "React Hook Getter Pattern".
:::
```

→ display path is `host + first path segment` shortened, with a leading `↗`. So `https://paco.me/writing/react-hook-getter` → `↗ paco.me/writing/react-hook-getter`.

```html
<aside class="sn" data-sn="3">
  <button class="sn-toggle"><span>Note 03</span><span class="sn-toggle-icon">+</span></button>
  <div class="sn-head">
    <span class="sn-n">03</span>
    <span class="sn-kind">Link</span>
  </div>
  <div class="sn-body">
    <p>Inspired by Paco Coursey's "React Hook Getter Pattern".</p>
    <p class="url">↗ paco.me/writing/react-hook-getter</p>
  </div>
</aside>
```

#### `kind="video"`

Attrs: `src` (URL — can be a YouTube/Vimeo embed URL, a local mp4, anything). Body is the caption.

```markdown
::: sidenote kind="video" n=4 src="https://example.com/talk.mp4"
Demo: rewriting useTracked on stream.
:::
```

→
```html
<aside class="sn" data-sn="4">
  <button class="sn-toggle"><span>Note 04</span><span class="sn-toggle-icon">+</span></button>
  <div class="sn-head">
    <span class="sn-n">04</span>
    <span class="sn-kind">Video</span>
  </div>
  <div class="sn-body">
    <div class="embed">Video — 16:9</div>
    <p>Demo: rewriting useTracked on stream.</p>
  </div>
</aside>
```

(For drafts the `embed` placeholder is fine. For final, swap in `<iframe src="…" allowfullscreen></iframe>` or `<video src="…" controls></video>` inside the same `.embed` container.)

### The anchor mark

`[^N]` in prose becomes:

```html
<a class="sn-mark" href="#sn-N" data-sn-target="N">N</a>
```

`N` matches the `n` on the sidenote block. The `.sn-mark` is a small superscript orange numeral.

### Numbering

You number manually. `[^1]`, `[^2]`, etc. The converter trusts your numbers — it does not renumber. If you delete a sidenote, decide whether to renumber the rest yourself or leave a gap (gaps are fine; the system doesn't care).

---

## Output template

The published `.html` file follows the exact shape of `notes-on-ai-velocity.html`. Key structural points the converter must preserve:

- `<head>` with the standard fonts preconnect + Inter Google Fonts link + `<link rel="stylesheet" href="site.css">`.
- `<body data-screen-label="Post — {title}">`
- `<main class="post-wrap">` wrapping:
  - `.crumb` with the `← Writing` back-link
  - `.head` with title, subtitle, topics chips
  - `<article class="post">` containing all body content + sidenote asides
- `<script src="post.js"></script>` at end of body.

---

## Updating the index

After converting a post, edit `writing.html`:

Add a new `<a class="post-row">` block at the **top** of `#posts` (most recent first), unless the post's `order` puts it elsewhere:

```html
<a class="post-row" href="<slug>.html" data-topics="Topic1,Topic2">
  <div class="post-title">Title from frontmatter</div>
  <div class="post-desc">One-sentence description from frontmatter subtitle.</div>
  <div class="post-meta"><span>Topic1</span><span>Topic2</span></div>
</a>
```

`data-topics` is a comma-separated list with no spaces — exactly the strings from frontmatter `topics`. The index filter matches against these.

---

## Linking from the homepage

The "Writing" block on `index.html` shows up to three featured posts. When a new post should appear there, edit `index.html` directly — that's intentionally manual, not derived from the index.

---

## Quick checklist for Claude Code

When asked to "convert post X":

1. Read `posts/<slug>.md`. Parse frontmatter.
2. If `draft: true`, stop. Tell the user.
3. Convert body to HTML following this guide. Pay attention to:
   - Sidenote `:::` blocks must produce `<aside class="sn">` with the correct kind-specific markup, **placed immediately after the paragraph that references them in the DOM**.
   - `[^N]` anchors become `<a class="sn-mark" href="#sn-N" data-sn-target="N">N</a>`.
   - Code fences get tokenised with the `tok-*` spans.
4. Wrap in the page template (see `notes-on-ai-velocity.html`).
5. Write to `<slug>.html` at project root.
6. Edit `writing.html` to add the new row to `#posts`.
7. Done. Tell the user the URLs that changed.
