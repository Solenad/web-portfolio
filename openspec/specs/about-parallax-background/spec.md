# about-parallax-background Specification

## Purpose

Defines the parallax background behavior of the About window: a dimmed trolley image layer with scroll-linked drift and preserved text readability.

## Requirements

### Requirement: Parallax background image
The About window content SHALL render `trolley.jpg` (served from `public/assets/`) as a background layer behind all content. The layer SHALL be dimmed via a translucent Catppuccin base overlay so the image reads as texture without obscuring text.

#### Scenario: Background renders
- **WHEN** the About window opens
- **THEN** the trolley image is visible behind the content, dimmed by the Catppuccin base overlay

#### Scenario: Image asset bundled
- **WHEN** the production build runs
- **THEN** `trolley.jpg` is served from `public/assets/` and loads without a broken image

### Requirement: Scroll-linked parallax drift
The background layer SHALL drift at a barely-there rate (approximately 0.2x of the window's scroll offset) while the window content scrolls, producing a subtle parallax effect. The drift SHALL be contained within the About window's scroll container and MUST NOT escape the window bounds.

#### Scenario: Subtle drift on scroll
- **WHEN** the user scrolls the About window content
- **THEN** the background layer shifts vertically at roughly 20% of the scroll distance while content scrolls normally

#### Scenario: Static at rest
- **WHEN** the window is scrolled to the top
- **THEN** the background layer returns to its resting position aligned with the content area

### Requirement: Readability preservation
Text over the background SHALL remain readable at all scroll positions: the parallax layer plus glass panels SHALL keep text contrast sufficient for comfortable reading.

#### Scenario: Text readable mid-scroll
- **WHEN** the user scrolls to any position in the About window
- **THEN** all text on glass panels remains legible against the background