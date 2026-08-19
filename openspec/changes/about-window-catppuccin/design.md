## Context

The About window (`src/features/windows/content/about/AboutWindow.tsx` + `components/SystemInfoPanel.tsx`) currently uses the site-wide Windows XP palette (beige `#ece9d8`, light blue `#eef3fb`, navy `#10233f`). It is a client component rendered inside the shared `Window.tsx` chrome, which stays XP-styled. The window has an internal scroll container (`flex-1 min-h-0 overflow-y-auto`), a lightbox modal (absolute sibling of the scroll area), and a SystemInfoPanel that already claims "Catppuccin Macchiato" as the user's theme.

The goal: transform the About window content into a dark Catppuccin Macchiato "terminal" aesthetic — parallax `trolley.jpg` background, frosted glass panels, Consolas monospace text, and a fastfetch-style system info block — without touching the XP chrome or other windows.

## Goals / Non-Goals

**Goals:**
- Full Catppuccin Macchiato palette on all About window content (header, sections, badges, modal, fastfetch block)
- Consolas monospace font stack scoped to the About window
- `trolley.jpg` parallax background with subtle (≈0.2×) scroll-linked drift, dimmed by a Catppuccin base overlay
- macOS-style frosted glass panels behind header and section text for readability
- fastfetch-style system info replacing SystemInfoPanel, with `roe@macchiato` ASCII banner
- Dark-themed lightbox modal matching the new palette

**Non-Goals:**
- Changing XP window chrome (titlebar, borders, menus) or any other window's theme
- Swapping fonts beyond Consolas (JetBrains Mono later, per user)
- Changing content copy, photo layouts, or existing modal behavior
- Global CSS theme refactor — palette stays scoped to this window

## Decisions

### D1: Palette as CSS variables, scoped to the About window
Define Catppuccin Macchiato tokens as CSS custom properties on a single root class (e.g., `.about-catppuccin`) in `globals.css`, and reference them via Tailwind arbitrary values (e.g., `bg-[var(--ctp-base)]`). Alternative: hardcode hex in each component. Chosen for consistency, future window reuse, and easy JetBrains Mono/theme swap later.

### D2: Parallax via scroll listener + transform, not `background-attachment: fixed`
The window scrolls in a nested container, so `fixed` attachment is unsupported (would fix to viewport, breaking the "inside the window only" rule). Instead: an absolutely-positioned, oversized image layer (e.g., height 120% of content, `object-cover`) inside the scroll container, translated via `transform: translateY(scrollTop * 0.2)` on a scroll listener attached to the scroll container ref. A `useRef` + direct style mutation (no re-render per scroll tick) keeps it cheap. Barely-there drift = 0.2 factor. Dimming = overlay div of `var(--ctp-base)` at ~55–65% opacity (moody midpoint between hidden and loud), plus a hint of blur for texture.

### D3: Glass panels with backdrop-blur + translucent base
Text containers (header + three section text boxes) become `backdrop-blur-md bg-[var(--ctp-base)]/70` panels with Catppuccin border (`overlay1`-ish at low opacity) and rounded corners. Alternative considered: solid `base` backgrounds (zero cost, no blur) — rejected because the user explicitly wants the trolley visible through glass. Note: `backdrop-filter` blurs everything behind the element, including the parallax layer — desired.

### D4: fastfetch block replaces SystemInfoPanel
Rewrite `SystemInfoPanel.tsx` as `FastfetchPanel` (or rename in place) rendering:
- ASCII `roe@macchiato` banner in blue `#8aadf4` (with a catppuccin accent, e.g., mauve `#c6a0f6` eyes or green `#a6da95` details)
- 9 info lines, fastfetch format: padded label in blue + `:` + value in `text` color, fixed-width via monospace + `whitespace-pre`/tabular layout
- Same data values as today
Fastfetch format chosen over neofetch-style block borders: cleaner in a narrow window and matches the "modern terminal" vibe.

### D5: Font stack via a scoped utility class
Add `.font-about-mono` (or reuse a modifier on the root container) in `globals.css`: `font-family: Consolas, ui-monospace, "Cascadia Mono", "Courier New", monospace;` applied once on the About root so all descendants inherit. Zero bundle cost; swapping to JetBrains Mono later = change one line. Alternative (next/font JetBrains_Mono) deferred per user.

### D6: Dark scrollbar + modal scoped to the window
A `custom-scrollbar-dark` variant (or overriding `.custom-scrollbar` within `.about-catppuccin` scope) for the About scroll container. Modal rethemed with surface frames (`#404066`), light text, translucent dark backdrop — behavior unchanged.

### D7: Asset handling
Copy `C:\Users\Lenovo\Downloads\trolley.jpg` → `public/assets/about-me/trolley.jpg` (existing about-me assets live there). Static import not required; direct `/assets/about-me/trolley.jpg` URL.

## Risks / Trade-offs

- [backdrop-blur cost on large glass panels] → Panels are few (4) and moderate size; blur radius kept modest (`md`). Verify scroll smoothness on lower-end devices.
- [Parallax transform jitter on scroll] → Direct style mutation via ref (no React state), `will-change: transform` on the layer, rAF-throttled scroll handler if needed.
- [Glass panels may obscure trolley too much at 70% opacity] → Opacity is a single constant; tune to ~60–75% during implementation to hit the "moody midpoint".
- [Consolas unavailable on macOS/Linux] → Fallbacks (`ui-monospace`, Cascadia Mono, Courier New) in the stack; acceptable for a personal portfolio.
- [`backdrop-blur` unsupported in very old browsers] → `@supports` fallback: solid `base` background when unsupported (readability preserved).
- [Dark scrollbar styling conflicts with shared `.custom-scrollbar`] → Scope the dark variant under `.about-catppuccin` to avoid affecting other windows.

## Migration Plan

- Deploy as a single commit; no data or API changes. Rollback = revert the commit (pure presentational change confined to the About window).
- Tuning knobs (dim opacity, parallax factor, glass opacity) are constants near the top of the component for quick adjustment.

## Open Questions

- Exact dim opacity and blur values will be tuned visually during implementation (no further user input needed; "moody midpoint" agreed).
- Whether to rename SystemInfoPanel → FastfetchPanel or keep the filename with new internals — implementation detail, default: rename to `FastfetchPanel.tsx` for clarity.