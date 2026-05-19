---
title: "Notes on AI velocity"
subtitle: "On quality, speed, and the second-order effect."
slug: "notes-on-ai-velocity"
topics: ["Engineering", "Process"]
order: 1
draft: false
---

The promise of AI in software isn't doing more things at once — it's doing one
thing far better, far faster. The teams I work with care about quality first;
speed is the second-order effect.[^1]

::: sidenote kind="note" n=1
Speed without quality is a debt you pay down later, usually with interest.
:::

## What actually changes

Three habits flip when you have a good coding agent on your shoulder: reading
code in chunks, branching exploratorily, and treating drafts as throwaway by
default.[^2]

::: sidenote kind="tweet" n=2 handle="@imaan"
Whenever I catch myself spawning a fifth experiment, I close my laptop and
re-read the brief.
:::

- You read more code than you write.
- You spawn 4–5 small experiments instead of one large one.
- Throwaway becomes the default; commitment is the rare act.

### A small example

Here's a hook I rewrote last week. The agent suggested the proxy pattern; I
tightened it.

```js
function useTracked(initial) {
  const [, rerender] = useState({});
  const tracked    = useRef({});
  const state      = useRef(initial);

  // only re-render for keys that were actually read
  return new Proxy(state.current, {
    get(_, key) {
      tracked.current[key] = true;
      return state.current[key];
    },
  });
}
```

The trick: only re-render for keys the component actually reads.[^3] The rest
are noise.

::: sidenote kind="link" n=3 href="https://paco.me/writing/react-hook-getter"
Inspired by Paco Coursey's "React Hook Getter Pattern".
:::

> Quality is what you protect when you choose not to ship the second thing.

## Measuring it

The numbers below are rough — single-developer projects over a month. Take
with salt.

| Project       | Before | After | Δ      |
|---------------|--------|-------|--------|
| Builders Log  | 3 wk   | 5 d   | −76%   |
| PT Module     | 8 wk   | 3 wk  | −62%   |
| Toolbelt      | —      | 2 wk  | n/a    |

### Talk demo

::: video src="" caption=""
:::

That's it. Build a few things, build them well.[^4]

::: sidenote kind="video" n=4 src=""
Demo: rewriting useTracked on stream.
:::
