## Why

The About window describes Roe's Catppuccin Macchiato dev environment (Neovim, Wezterm, GlazeWM) while looking like a beige XP dialog box. Theming it as a dark, terminal-flavored Catppuccin window makes the About experience feel like a portal into his actual setup — more personal, more stylish, and cohesive with the identity the window already claims.

## What Changes

- Restyle the About window content (header, sections, modal, system info) from the XP beige palette to **Catppuccin Macchiato** (base `#24273a`, text `#cad3f5`, blue `#8aadf4`, green `#a6da95`, mauve `#c6a0f6`, etc.)
- Apply a **Consolas monospace font stack** to all About window text (swap-ready for JetBrains Mono later)
- Add `trolley.jpg` (copied into `public/assets/`) as a **parallax background**: barely-there scroll-linked movement, dimmed to a moody midpoint via a Catppuccin base overlay
- Wrap header and section text boxes in **macOS-style frosted glass panels** (`backdrop-blur` + translucent Catppuccin base) so text stays readable over the background
- Replace the XP-style SystemInfoPanel with a **fastfetch-style block**: a `roe@macchiato` ASCII banner plus colored `label: value` lines
- Retheme the image lightbox modal to dark Catppuccin glass to match
- Keep XP window chrome (titlebar, borders) and white polaroid photo frames untouched — the window is a "portal" into the dev environment

## Capabilities

### New Capabilities
- `about-catppuccin-theme`: Catppuccin Macchiato visual theme applied to the About window — palette, Consolas typography, glass panels, and dark modal
- `about-parallax-background`: `trolley.jpg` parallax background layer with scroll-linked drift and dimming overlay
- `about-fastfetch-panel`: fastfetch-style system info block with `roe@macchiato` ASCII banner and Catppuccin-colored info lines

### Modified Capabilities
<!-- No existing specs in openspec/specs/ — all capabilities are new. -->

## Impact

- `src/features/windows/content/about/AboutWindow.tsx` — palette swap, glass panels, parallax layer, modal retheme, Consolas font class
- `src/features/windows/content/about/components/SystemInfoPanel.tsx` — replaced by fastfetch-style panel (or rewritten in place)
- `public/assets/about-me/trolley.jpg` — new asset copied from `C:\Users\Lenovo\Downloads\trolley.jpg`
- `src/app/globals.css` — possibly a scoped dark scrollbar style and font utility class for the About window
- No external dependencies; no API or data changes; no breaking changes to other windows