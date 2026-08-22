# about-terminal-panels Specification

## Purpose

Defines the terminal-style presentation of About window sections: macOS-style title bars on each text box and an animated header background.

## Requirements

### Requirement: macOS-style terminal title bars
Each section text box in the About window SHALL render as a terminal-style panel with a macOS-like title bar: three classic traffic-light dots (red `#ed8796`, yellow `#eed49f`, green `#a6da95`) on the left and the centered section title in Catppuccin tones. The panel body SHALL be a frosted glass container matching the window theme.

#### Scenario: Sections render with title bars
- **WHEN** the About window renders its sections
- **THEN** each text box shows a title bar with the three traffic-light dots and its section title (About Me / Professional Progress / Interests & Hobbies) centered

#### Scenario: Titles live in the bars
- **WHEN** a section renders
- **THEN** the section title appears inside the title bar, and no standalone heading exists above the panel

### Requirement: Animated header background
The window header SHALL render `header.gif` (served from `public/assets/`) as a full-bleed background layer, cropped with `object-cover` anchored to the bottom, and slightly darkened by a translucent overlay so header text remains readable.

#### Scenario: Header shows the gif
- **WHEN** the About window opens
- **THEN** the header displays the animated gif behind its content, bottom-anchored and darkened

#### Scenario: Header text readable
- **WHEN** the header renders
- **THEN** the name, roles, and badges remain legible against the gif background