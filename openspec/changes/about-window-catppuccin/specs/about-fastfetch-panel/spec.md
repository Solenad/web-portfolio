## ADDED Requirements

### Requirement: Fastfetch-style system info block
The About window SHALL render a fastfetch-style system info panel replacing the previous XP-style SystemInfoPanel, displaying a `roe@macchiato` ASCII banner alongside color-coded `label: value` lines for OS, kernel, shell, WM, editor, terminal, theme, agents, and disk.

#### Scenario: Panel renders banner and info
- **WHEN** the About window is scrolled to the system info section
- **THEN** a `roe@macchiato` ASCII banner and the nine info lines render in Catppuccin Macchiato colors (blue labels, light values)

#### Scenario: Values match user environment
- **WHEN** the panel renders
- **THEN** the info lines display the same values as the current implementation (OS: Windows, shell: PowerShell, WM: GlazeWM, editor: Neovim, terminal: Wezterm, theme: Catppuccin Macchiato, agents: Opencode + Customized Openspec, disk: 195.12 / 200 GiB)

### Requirement: Monospace alignment
The fastfetch block SHALL render in the Consolas monospace stack with fixed-width alignment so labels and values form clean columns.

#### Scenario: Columns align
- **WHEN** the fastfetch block renders
- **THEN** label columns align vertically across all info lines