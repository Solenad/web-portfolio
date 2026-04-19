# Web Portfolio

A retro-inspired web portfolio built with Next.js, featuring a Windows 95-style desktop interface. Projects, about sections, and content are organized as desktop icons, with layered draggable windows providing an immersive, nostalgic user experience.

## Concept

This portfolio reimagines the traditional web experience through the lens of a classic desktop operating system. Rather than navigating through conventional pages, users interact with:

- **Desktop Icons** representing portfolio sections (Projects, About, Contact)
- **Draggable Windows** that can be opened, minimized, maximized, and closed
- **Layered Window Management** with z-index handling for focused interaction
- **Start Menu & Taskbar** for quick access and window management

The Windows 95 aesthetic serves as a creative framework for presenting technical work—every "application" is a piece of content, every window is a story.

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.2.4 | React framework with App Router |
| **React** | 19.2.4 | UI component library |
| **TypeScript** | ^5 | Type-safe development (strict mode) |
| **Tailwind CSS** | ^4 | Utility-first styling with v4 features |
| **ESLint** | ^9 | Code linting with flat config |

### Key Features

- **App Router Pattern**: Next.js 16 App Router for modern routing
- **TypeScript Strict Mode**: Zero `any` policy with explicit return types
- **Tailwind CSS v4**: New configuration syntax with CSS-first approach
- **Geist Fonts**: Sans and Mono font families pre-configured
- **Dark Mode Support**: CSS media query-based theming

## Getting Started

### Prerequisites

- Node.js 20.x or later
- npm, pnpm, or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd web-portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Project Structure

```
.
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with Geist fonts
│   ├── page.tsx            # Desktop container (main entry)
│   └── globals.css         # Global styles & Tailwind v4
├── components/             # React components
│   ├── desktop/            # Desktop environment
│   ├── window/             # Window management
│   ├── taskbar/            # Taskbar & Start menu
│   └── ui/                 # Reusable UI components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities & state logic
├── types/                  # TypeScript interfaces
├── public/                 # Static assets
│   └── icons/              # Desktop & window icons
├── next.config.ts          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── eslint.config.mjs       # ESLint flat config
└── postcss.config.mjs      # Tailwind v4 PostCSS setup
```

## Architecture

The application follows a component-based architecture centered around the desktop metaphor:

```
Desktop (app/page.tsx)
├── DesktopIcons          # Grid of clickable icons
├── WindowManager         # Renders active windows
│   └── Window[]          # Draggable, layered windows
│       ├── TitleBar      # Drag handle & controls
│       └── Content       # Window content area
└── Taskbar               # Bottom bar with Start menu
    ├── StartButton       # Opens Start menu
    ├── StartMenu         # Application launcher
    └── TaskbarItems      # Open window buttons
```

State management handles:
- **Window State**: Position, size, z-index, minimize/maximize
- **Desktop State**: Active window, open applications
- **Drag State**: Mouse position, dragging state

## Development Roadmap

### Phase 1: Foundation
- [ ] Desktop container with wallpaper
- [ ] Desktop icon grid system
- [ ] Icon click handling (double-click to open)

### Phase 2: Window System
- [ ] Window component with 95-style chrome
- [ ] Draggable windows (title bar drag)
- [ ] Window controls (minimize, maximize, close)
- [ ] Z-index management (focus on click)

### Phase 3: Taskbar
- [ ] Bottom taskbar container
- [ ] Start button with menu
- [ ] Taskbar items for open windows
- [ ] System tray with clock

### Phase 4: Content Integration
- [ ] Project viewer window
- [ ] About section window
- [ ] Contact form window
- [ ] Resume/CV window

### Phase 5: Polish
- [ ] Retro color scheme & fonts
- [ ] Icon animations & hover states
- [ ] Window animations (open/close)
- [ ] Sound effects (optional)

### Phase 6: Optimization
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Mobile responsive fallback
- [ ] SEO metadata

## Screenshots & Demo

*[Screenshots and demo video will be added as features are implemented]*

### Planned Visual Elements

- **Desktop Screenshot**: Full desktop with icons and open windows
- **Window Demo**: Dragging, resizing, and layering in action
- **Mobile View**: Responsive fallback for mobile devices
- **Demo Video**: Complete walkthrough of the interface

## Development Workflow

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm start` | Start production server (requires build) |
| `npm run lint` | Run ESLint for code quality |

### Code Quality

- **ESLint**: Flat config with Next.js rules
- **TypeScript**: Strict mode enabled with zero `any` policy
- **Component Patterns**: Functional components with explicit return types

### Git Workflow

1. Create feature branches for each roadmap phase
2. Commit frequently with descriptive messages
3. Test thoroughly before merging
4. Update README as features are completed

## License

[License information to be added]

## Development Status

**Status**: Work in Progress  
**Current Phase**: Foundation setup complete, Phase 1 implementation in progress

---

*Built with Next.js 16, React 19, TypeScript 5, and Tailwind CSS v4*
