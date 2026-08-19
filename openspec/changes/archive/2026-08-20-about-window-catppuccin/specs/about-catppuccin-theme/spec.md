## ADDED Requirements

### Requirement: Catppuccin Macchiato palette
The About window content SHALL use the Catppuccin Macchiato palette: base `#24273a` for backgrounds, text `#cad3f5` for primary text, blue `#8aadf4` for headers and accents, green `#a6da95`, mauve `#c6a0f6`, and surface tones `#363a4f`/`#404066` for panels and borders. The XP window chrome (titlebar, borders, menus) SHALL remain unchanged.

#### Scenario: Window opens with dark theme
- **WHEN** the About window renders
- **THEN** all content areas display Catppuccin Macchiato colors with no XP beige (`#ece9d8`, `#eef3fb`, `#10233f`) visible in the content

#### Scenario: Chrome stays XP
- **WHEN** the About window opens
- **THEN** the titlebar, window borders, and menu bar retain the original Windows XP styling

### Requirement: Consolas monospace typography
All text inside the About window SHALL render with a Consolas-first monospace font stack (`Consolas`, `ui-monospace`, `"Cascadia Mono"`, monospace), including headers, body text, badges, captions, and the fastfetch panel.

#### Scenario: Text renders monospace
- **WHEN** any text element in the About window is inspected
- **THEN** its computed font-family resolves to the Consolas monospace stack

### Requirement: Frosted glass panels
The window header and each section text box SHALL be rendered as frosted glass panels: a translucent Catppuccin base background (approximately 70% opacity) with backdrop blur, so text remains readable over the parallax background.

#### Scenario: Header and sections use glass
- **WHEN** the About window renders
- **THEN** the header and all section text boxes show a blurred, translucent Catppuccin base backdrop with readable `#cad3f5` text

### Requirement: Dark lightbox modal
The image preview modal SHALL use the Catppuccin Macchiato palette (dark translucent backdrop, surface-toned frame, light text) while keeping its existing behavior (open on photo click, close on backdrop click, X button, or Esc).

#### Scenario: Modal matches theme
- **WHEN** a photo is clicked and the modal opens
- **THEN** the modal backdrop and frame render in Catppuccin Macchiato tones with light text