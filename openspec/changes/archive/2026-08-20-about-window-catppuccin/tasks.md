## 1. Asset & Styling Foundation

- [x] 1.1 Copy `C:\Users\Lenovo\Downloads\trolley.jpg` to `public/assets/about-me/trolley.jpg`
- [x] 1.2 Add Catppuccin Macchiato CSS variables (`.about-catppuccin` scope: base, mantle, text, subtext, surface0-2, overlay0-2, blue, mauve, green, yellow, peach, red) to `globals.css`
- [x] 1.3 Add `.font-about-mono` utility (Consolas stack) to `globals.css`
- [x] 1.4 Add dark scrollbar variant scoped to `.about-catppuccin` in `globals.css`

## 2. Parallax Background

- [x] 2.1 Add parallax layer (absolute, oversized `trolley.jpg`, `object-cover`) inside the About scroll container with a ref on the container
- [x] 2.2 Implement scroll listener (rAF-throttled) translating the layer by `scrollTop * 0.2`, cleanup on unmount, `will-change: transform`
- [x] 2.3 Add Catppuccin base dim overlay (≈75% opacity) between layer and content; verify "moody midpoint" readability
- [x] 2.4 Verify the background never escapes the window bounds (clipped by `overflow: hidden` window chrome)

## 3. Theme Swap (AboutWindow)

- [x] 3.1 Apply `.about-catppuccin` + `.font-about-mono` classes to the About window root
- [x] 3.2 Replace header palette (bg gradient, name, status, roles, location text) with Catppuccin colors
- [x] 3.3 Convert header + three section text boxes to frosted glass panels (`backdrop-blur` + base/70) with Catppuccin borders
- [x] 3.4 Recolor section titles (blue diamond accent → `#8aadf4`), badges (keep brand colors, adjust bg for dark), captions, and PS note
- [x] 3.5 Recolor the lightbox modal (dark translucent backdrop, surface frame, light caption text, dark close button)

## 4. Fastfetch Panel

> **Status**: Implemented as `FastfetchPanel.tsx`, then **removed by user decision** (2026-08-20). Final state: no system info panel — see REMOVED requirements in `specs/about-fastfetch-panel/spec.md`.

- [x] 4.1 Rewrite `SystemInfoPanel.tsx` as `FastfetchPanel.tsx` with `roe@macchiato` ASCII banner (blue + mauve/green accents) — later removed
- [x] 4.2 Render 9 info lines in fastfetch format: padded blue labels + `text`-colored values, monospace column alignment — later removed
- [x] 4.3 Keep existing data values (OS, kernel, shell, WM, editor, terminal, theme, agents, disk) and update AboutWindow import — later removed
- [x] 4.4 Wrap fastfetch block in a glass/panel container matching the window theme — later removed

## 5. Terminal Panels

- [x] 5.1 Create `TerminalPanel.tsx` (macOS-style title bar: classic traffic lights red/yellow/green + centered title, glass body)
- [x] 5.2 Move section titles (About Me / Professional Progress / Interests & Hobbies) into the terminal panel title bars
- [x] 5.3 Add `header.gif` background to the header (center-cropped, later bottom-cropped per user, slightly darkened)

## 6. Verification

- [x] 6.1 Run `npm run lint` — no new warnings/errors from changed files
- [x] 6.2 Run `npm run build` — production build succeeds
- [x] 6.3 Manual check: scroll window — trolley drifts subtly; glass panels keep text readable; photos still open the dark modal; XP chrome unchanged; other windows unaffected
- [x] 6.4 Tune dim opacity / parallax factor / glass opacity to the agreed "moody midpoint" (final: `PARALLAX_FACTOR = 0.2`, `DIM_OPACITY = 0.75`, glass `rgba(36,39,58,0.7)`)