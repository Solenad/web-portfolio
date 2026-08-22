## Why

The About window describes Roe's Catppuccin Macchiato dev environment (Neovim, Wezterm, GlazeWM) while looking like a beige XP dialog box. Theming it as a dark, terminal-flavored Catppuccin window makes the About experience feel like a portal into his actual setup — more personal, more stylish, and cohesive with the identity the window already claims.

## What Changes

- Restyle the About window content (header, sections, modal) from the XP beige palette to **Catppuccin Macchiato** (base `#24273a`, text `#cad3f5`, blue `#8aadf4`, green `#a6da95`, mauve `#c6a0f6`, etc.)
- Apply a **Consolas monospace font stack** to all About window text (swap-ready for JetBrains Mono later)
- Add `trolley.jpg` (copied into `public/assets/`) as a **parallax background**: barely-there scroll-linked movement (0.2×), dimmed to a moody midpoint via a Catppuccin base overlay at ~75%
- Add `header.gif` as the **header background**: full-bleed, bottom-cropped, slightly darkened
- Wrap header and section text boxes in **macOS-style frosted glass panels** (`backdrop-blur` + translucent Catppuccin base) so text stays readable over the background
- Add **macOS-style terminal title bars** (classic traffic lights + centered section title) to all text blocks; section titles moved into the bars
- Retheme the image lightbox modal to dark Catppuccin glass to match
- Condense the header role lines into a single `•`-separated line and remove the "Roe" nickname
- Keep XP window chrome (titlebar, borders) and white polaroid photo frames untouched — the window is a "portal" into the dev environment

## Capabilities

### New Capabilities
- `about-catppuccin-theme`: Catppuccin Macchiato visual theme applied to the About window — palette, Consolas typography, glass panels, and dark modal
- `about-parallax-background`: `trolley.jpg` parallax background layer with scroll-linked drift and dimming overlay
- `about-terminal-panels`: macOS-style terminal title bars on text blocks and the `header.gif` animated header background

### Modified Capabilities
<!-- No existing specs in openspec/specs/ — all capabilities are new. -->

## Impact

- `src/features/windows/content/about/AboutWindow.tsx` — palette swap, glass panels, parallax layer, header gif, modal retheme, Consolas font class
- `src/features/windows/content/about/components/TerminalPanel.tsx` — new reusable macOS-style title bar panel
- `src/features/windows/content/about/components/FastfetchPanel.tsx` — created then removed by user decision
- `public/assets/about-me/trolley.jpg`, `public/assets/about-me/header.gif` — new assets copied from Downloads
- `src/app/globals.css` — scoped Catppuccin variables, dark scrollbar, and font utility class for the About window
- No external dependencies; no API or data changes; no breaking changes to other windows