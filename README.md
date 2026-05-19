# Handoff — imaan.co personal site

## Overview

A minimal, dark-themed personal website with three page types:

1. **Homepage** — name, intro, single-column list of links (Building / Projects / Writing), Connect block.
2. **Writing index** — evergreen list of posts (no dates), filterable by topic.
3. **Blog post** — long-form essay with margin sidenotes, syntax-highlighted code, pull quotes, tables, and video/tweet embeds.

The look is dark, sans-serif, with a single orange accent.

## About the design files

The files in `design_references/` are the **production site** — hand-written HTML/CSS/JS. There is no framework, no build step. They're meant to be copied to the project root and served directly by GitHub Pages.

Posts are authored as Markdown in `posts/` and converted to HTML on demand by Claude Code. See `AUTHORING.md` for the conversion contract and `CLAUDE_CODE_PROMPT.md` for the kickoff prompt.

## Fidelity

**High-fidelity and final.** Colors, type sizes, spacing, and interactions are locked. Treat them as the canonical version of the design.

## Stack

- **Hosting:** GitHub Pages (or any static host — Netlify, Cloudflare Pages, etc.). Add a `.nojekyll` file at the repo root so Pages serves files as-is.
- **Authoring:** Markdown files in `posts/`. Frontmatter for metadata. Custom `:::` blocks for sidenotes. See `AUTHORING.md`.
- **Conversion:** Claude Code reads a `.md` file and outputs a matching `<slug>.html` at the project root, then patches `writing.html` to add the post to the index. No automated pipeline — you ask, it converts.
- **Runtime:** A small vanilla JS file (`post.js`) handles the sidenote click-to-highlight on post pages. The writing index has an inline ~25-line script for topic filtering. Both ship as plain `<script>` tags. No bundler.

## If you outgrow this

When the manual "convert this post" workflow gets tedious (probably around 15-20 posts, or when you want RSS / sitemap / tag pages), graduate to **Astro + MDX**. Astro can ingest the existing `posts/*.md` files mostly as-is (the `:::` sidenote syntax becomes `<Sidenote>` MDX components). The design tokens and HTML structure in `site.css` and `design_references/` port over wholesale. Plan for a half-day migration, not a rewrite.

---

## Design tokens

All tokens are declared as CSS custom properties in `design_references/site.css` (top of the file). Carry them over verbatim.

### Colors

| Token | Value | Use |
|---|---|---|
| `--bg` | `#18171a` | Page background (warm near-black) |
| `--bg-elev` | `#1f1d22` | Elevated surfaces (unused so far; reserved) |
| `--text` | `#e9e6e0` | Primary text (warm off-white) |
| `--text-mute` | `rgba(233,230,224,0.55)` | Secondary text / descriptions |
| `--text-dim` | `rgba(233,230,224,0.38)` | Tertiary text / metadata |
| `--border` | `rgba(233,230,224,0.08)` | Dividers / row borders |
| `--border-soft` | `rgba(233,230,224,0.05)` | Faintest dividers / card borders |
| `--border-strong` | `rgba(233,230,224,0.18)` | Link underlines |
| `--accent` | `#e35a30` | Orange accent (links on hover, active sidenote anchors) |
| `--accent-bg` | `rgba(227,90,48,0.12)` | Subtle orange surface (hover pill) |
| `--accent-bg-hi` | `rgba(227,90,48,0.18)` | Active sidenote card background |
| `--accent-border` | `rgba(227,90,48,0.45)` | Active sidenote card border |

### Typography

- Font family: **Inter** (Google Fonts), weights `400`, `500`, `600`.
- Feature settings: `"ss01", "cv11"` (single-storey a, alternate 1).
- Base body: `15.5px` / line-height `1.75` / weight `400`.

| Element | Size | Weight | Letter-spacing | Line-height |
|---|---|---|---|---|
| Body paragraph | `15.5–16px` | 400 | normal | 1.7–1.78 |
| Homepage name | `22px` | 500 | `-0.01em` | normal |
| Item name (in lists) | `15px` | 500 | normal | normal |
| Eyebrow (uppercase label) | `11.5px` | 500 | `0.16em` | normal, `text-transform: uppercase` |
| Post H1 title | `32px` | 500 | `-0.02em` | `1.18` |
| Post H2 | `21px` | 500 | `-0.01em` | normal |
| Post H3 | `17px` | 500 | normal | normal |
| Sidenote body | `13px` | 400 | normal | `1.55` |
| Code (pre + inline) | `13px` | 400 | normal | `1.65`, family `ui-monospace, "SF Mono", Menlo, Consolas, monospace` |
| Pull quote | `19px` | 400 | `-0.005em` | `1.45` |
| Table cell | `14px` | 400 | normal | normal |
| Table header | `11px` | 500 | `0.12em` | uppercase |
| Footer year | `12px` | 400 | `0.04em` | normal |

### Spacing rhythm

- Reading column max-width: **560px** (`--col`)
- Reading column + sidenote rail max-width: **856px** (`--col-wide`)
- Sidenote rail width: **240px** (`--rail`)
- Gutter between body column and rail: **56px**
- Section gap (major sections on homepage): **64px** (`--section-y`)
- Paragraph gap: **22px** (`--para-y`)
- Vertical gap between Building/Projects/Writing blocks: **40px**
- Item gap inside a block: **16px**

### Borders & radii

- Card border-radius: **8px** (sidenotes, code blocks, table containers)
- Small radius: **2–4px** (inline code, dot markers)
- Pill: **999px** (mobile topic chips, topic tags)
- Border default: `1px solid var(--border)`

### Shadows

None. The design has no shadows — depth comes from contrast and spacing only.

---

## Pages

### 1. Homepage (`/`)

Reference: `design_references/index.html`

**Layout** — Centered single column, max-width `560px`, padded `110px 24px` top/sides on desktop, `56px 22px` on mobile.

**Content order**, top to bottom:

1. **Name** — `Imaan`. 22px, weight 500. No link.
2. **Intro** — Two paragraphs. Inline link to `abliterate.ai`.
3. **Building / Projects / Writing grid** — A single-column flex stack at all viewports (gap 40px between blocks, 16px between items inside a block). Each block has:
   - Eyebrow label (`BUILDING` / `PROJECTS` / `WRITING`)
   - List of items, each with:
     - Name as link (underlined with `--border-strong`, hover flips underline + text to `--accent`)
     - Optional `↗` arrow if external
     - Description paragraph beneath (`13.5px`, `--text-mute`, max-width 420px)
4. **Now section** (currently hidden via `hidden` attribute — toggle to bring back)
5. **Connect section** — Eyebrow `CONNECT`, one paragraph with social + email links.

**Footer** — A horizontal strip below `main`, right-aligned year. Border-top `1px var(--border-soft)`. 32px vertical padding.

**Behaviour** — Static. No JS.

### 2. Writing index (`/writing`)

Reference: `design_references/writing.html`

**Layout** — Two-column grid at >800px: `160px (filter) | 1fr (main)`, 56px gap. Single column on mobile.

**Left column — Topics filter:**
- Eyebrow `TOPICS`
- Vertical list of buttons. Each button has a small 6×6 square dot + label.
- Active button: dot and label flip to `--accent`.
- Initial state: `All` is active.

**Right column — Posts:**
- Page title `Writing` (24px, weight 500)
- Lede paragraph (14px, muted, max-width 520px)
- List of post rows, each row is an `<a>`:
  - Title (17px, weight 500)
  - One-line description (14px, muted)
  - Topics meta line (11.5px, dim, separated by `·`)
  - 1px bottom border between rows; none on the last
  - Hover flips title to `--accent`
- Empty state: "Nothing here under that topic — yet." — shown when filter matches zero posts.

**No dates.** Posts are evergreen and shown in author-defined chronological order from the data layer.

**Mobile (<800px):** filter row collapses into horizontal pills (chips). Active chip has accent border + tinted background. Dots are hidden in chip mode.

**Behaviour** — Topic filter is purely client-side. Clicking a topic toggles `aria-pressed="true"` on the button and hides post rows whose `data-topics` (CSV) does not include the topic. Pure DOM filtering; no fetch.

### 3. Blog post (`/writing/[slug]`)

Reference: `design_references/notes-on-ai-velocity.html`

**Layout** — Centered, max-width `980px`, padded `72px 40px` top/sides.

- Back link `← Writing` at top
- Header block (max-width 560px):
  - Title (32px, weight 500, `-0.02em` tracking)
  - Subtitle (15px, muted)
  - Topic pills (small rounded outlined chips, 11px uppercase)
- Article body wrapped in `<article class="post">`, which is a **2-column CSS Grid**:
  - Column 1: body content (min 0, max 560px)
  - Column 2: sidenote rail (240px)
  - Column gap: 56px
- All children default to column 1. Children with class `sn` are placed in column 2.
- **CSS auto-flow handles vertical alignment:** because column 2 stays empty for body-only rows, an `<aside class="sn">` placed in the DOM immediately after its referenced paragraph lands in column 2 of the same grid row, naturally aligned with its anchor.

#### Body components

| Component | HTML | Notes |
|---|---|---|
| Paragraph | `<p>` | 16px / 1.78 |
| H2 | `<h2>` | 21px, margin `36px 0 12px` |
| H3 | `<h3>` | 17px, margin `24px 0 8px` |
| Unordered list | `<ul>` | 16px |
| Ordered list | `<ol>` | 16px |
| Code block | `<pre class="code">` with `<span class="tok-k">`, `tok-s`, `tok-n`, `tok-c`, `tok-f` for keyword / string / number / comment / function-name | Dark slab, 13px monospace. Pre-tokenised in the reference; in production use Shiki or Prism with the same token classes mapped to these colors. |
| Inline code | `<code class="inline">` | Subtle bg, 1px border |
| Pull quote | `<blockquote class="pull">` | 2px left border in `--accent`, 19px text |
| Table | `<table class="tbl">` | 14px, header is 11px uppercase tracked |
| Video / embed placeholder | `<div class="embed">` | 16:9 aspect-ratio container — replace with `<iframe>` or `<video>` in production |
| Sidenote anchor | `<a class="sn-mark" href="#sn-N" data-sn-target="N">N</a>` | Renders as small superscript orange numeral via `font-feature-settings: "sups"`. Click → activate matching card. |
| Sidenote card | `<aside class="sn" data-sn="N">…</aside>` | See "Sidenote model" below |

#### Sidenote model

Each sidenote has a **kind** which controls how the body renders. The desktop card has a header row (kind label top-right, number top-left) followed by the body content. Mobile collapses the card; the toggle button is the only visible affordance until expanded.

Kinds and required content:

| Kind | Card body shape |
|---|---|
| `note` | One or more `<p>` |
| `tweet` | `<p class="handle">` + `<p class="quote">` (quoted text wrapped in `"…"`) |
| `link` | `<p>` description + `<p class="url">` showing `↗ host/path` |
| `video` | `<div class="embed">` + caption `<p>` |

#### Interaction (`post.js`)

- Click `.sn-mark` in body → set `data-sn-target` value as active. Adds `is-active` to the matching `.sn` card and to the mark itself; adds `has-active` to `.post`.
- Clicking the same mark again clears.
- Clicking a `.sn` card (anywhere on the card) on desktop also toggles active.
- On mobile (matches `(max-width: 900px)`):
  - Cards become inline collapsible (`.sn-toggle` button + `[data-open]` attribute).
  - Activating from an anchor sets `data-open="true"` AND scrolls the card into view.
- The active card visual: full opacity, `--accent-bg-hi` background, `--accent-border` border. All other cards fade to `opacity: 0.18`. Default state (nothing active): all cards at `opacity: 0.55`.

#### Mobile (<900px)

- Grid collapses to single column. Sidenotes flow inline directly after their referenced paragraph.
- Sidenote cards become collapsed by default, with a `+` toggle showing `Note NN`.
- Tapping the toggle, or tapping the matching superscript anchor, expands the card.

---

## Markdown content schema for the blog

Posts live in `posts/` as `.md` files. The full conversion contract — frontmatter fields, sidenote syntax, code/table/quote conventions — is in **`AUTHORING.md`**. The starter Markdown for the sample post is at **`posts/notes-on-ai-velocity.md`**. Read both alongside the corresponding `notes-on-ai-velocity.html` to see authoring → output in one glance.

---

## Interactions & behaviour summary

| Page | Interaction | Implementation hint |
|---|---|---|
| Homepage | Static | — |
| Writing index | Topic filter | Pure client-side, hide DOM rows by CSV match. See `writing.html` for the working script (≈25 lines). |
| Blog post | Sidenote click-to-highlight | `post.js` (see file) — ~50 lines vanilla JS, no dependencies. |
| Blog post | Mobile sidenote collapse | Same script handles `data-open` toggling on `.sn-toggle` click. |

No keyboard shortcuts. No URL state sync for filters (intentional — keeps the URL clean and the home page link in the footer "home" rather than "home with all filters cleared").

---

## Accessibility

- Topic filter buttons use `aria-pressed`. Keep that.
- Sidenote anchors are `<a href="#sn-N">` — link semantics preserved, so without JS they jump to the in-page card (which is also the mobile-default behaviour).
- Color contrast: body text on `--bg` is ~13:1 (well above WCAG AA). Muted text ~6:1. Accent on bg ~5:1.
- Respect `prefers-reduced-motion`: the only transitions are 180ms fades on sidenote state. Wrap them in a media query in production: `@media (prefers-reduced-motion: reduce) { .sn { transition: none; } }`.

---

## Assets

- Inter from Google Fonts (`?family=Inter:wght@400;500;600&display=swap`)
- No images. The `embed` placeholder is CSS-only. Real videos / images come from post content.
- No icons. The `↗` arrow is a plain Unicode glyph (`U+2197`). The back-link arrow is `←` (`U+2190`).

---

## Files in this bundle

```
design_handoff_personal_site/
├── README.md                              — this file (design spec)
├── AUTHORING.md                           — Markdown → HTML conversion contract
├── CLAUDE_CODE_PROMPT.md                  — kickoff prompt for Claude Code
├── posts/
│   └── notes-on-ai-velocity.md            — sample post in Markdown
└── design_references/
    ├── index.html                         — Homepage
    ├── writing.html                       — Writing index with topic filter
    ├── notes-on-ai-velocity.html          — Sample post (converted reference)
    ├── site.css                           — Design system + page layouts
    └── post.js                            — Sidenote interaction
```

Open each HTML file in a browser to see the live state. The sample post exercises every body component (paragraph, h2, h3, list, code with syntax highlighting, pull quote, table, video embed, all four sidenote kinds). Compare it with its Markdown source in `posts/` to see the conversion rules in practice.

---

## Suggested implementation order

1. Copy everything in `design_references/` to the project root (it becomes the live site).
2. Add a `.nojekyll` file at the root so GitHub Pages skips Jekyll.
3. Read `AUTHORING.md` and walk through `posts/notes-on-ai-velocity.md` ↔ `notes-on-ai-velocity.html` side-by-side. Confirm you understand the conversion contract.
4. Wait for the user to drop a new `.md` post in `posts/`, then convert it.
5. (Later, when you outgrow manual conversion: migrate to Astro + MDX. See the "If you outgrow this" note above.)
