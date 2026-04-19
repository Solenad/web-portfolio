#  windows-xp-web-portfolio
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) 
![GitHub last commit](https://img.shields.io/github/last-commit/Solenad/web-portfolio)
![visitors](https://visitor-badge.laobi.icu/badge?page_id=Solenad.web-portfolio.id)


A retro-inspired web portfolio featuring an authentic Windows XP Luna desktop interface. Built with modern web technologies while capturing the nostalgic essence of the classic operating system.

<img width="1918" height="943" alt="Webpage" src="https://github.com/user-attachments/assets/e58b1735-6b6c-400d-aaff-feb195548800" />

## ✨ Features

### Desktop Environment
- **Authentic Windows XP Taskbar** - 17-stop gradient with Luna blue theme
- **Start Button** - Pixel-perfect image assets with hover and active states
- **System Tray** - Security and info icons with live clock (updates every second)
- **Desktop Icons** - 72×72 pixel icons with authentic XP selection styling
- **Bliss Wallpaper** - Classic Windows XP background

### Interaction Model
- **Single-Selection Icons** - Click to select, click another to deselect previous
- **Wallpaper Click** - Click on empty desktop to deselect all icons
- **Hover States** - Translucent blue highlight (no borders/shadows)
- **Selected States** - Darker translucent blue background

### Responsive Design
- **Desktop View** - Full XP desktop experience (768px and above)
- **Mobile Fallback** - Simplified view for smaller screens

## 🚀 Live Demo

Visit the portfolio at: [your-deployment-url]

## 🛠️ Technology Stack

- **Framework:** Next.js 16.2.4 (App Router)
- **Runtime:** React 19.2.4
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4
- **Linting:** ESLint 9

## 📁 Project Structure

```
web-portfolio/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Desktop entry point
│   ├── globals.css         # Global styles & Tailwind v4 config
│   └── favicon.ico
├── features/
│   ├── desktop/
│   │   ├── components/
│   │   │   ├── Desktop.tsx      # Desktop container with state management
│   │   │   ├── IconGrid.tsx     # Vertical column grid layout
│   │   │   ├── DesktopIcon.tsx  # 72×72 icons with XP styling
│   │   │   └── Wallpaper.tsx    # Bliss background
│   │   └── index.ts
│   └── taskbar/
│       └── components/
│           ├── Taskbar.tsx      # 17-stop gradient taskbar
│           ├── StartButton.tsx  # Image-based start button
│           └── SystemTray.tsx   # Clock and status icons
├── types/
│   └── desktop.types.ts    # DesktopIconItem type definition
├── public/
│   └── assets/
│       ├── xp-icons/       # Desktop icons (user.webp, mail.webp, etc.)
│       └── wallpapers/     # Bliss.jpg background
├── openspec/
│   └── specs/              # Feature specifications
│       ├── desktop-icon-grid/
│       ├── desktop-icon-interactions/
│       └── taskbar-component/
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
└── package.json
```

## 🎨 Design System

### Windows XP Luna Colors
- Primary Blue: `#235cdb`
- Taskbar Gradient: 17-stop linear gradient from `rgb(31, 47, 134)` to `rgb(25, 65, 165)`
- Tray Gradient: Lighter blue subset with lifted appearance
- Selection Blue (hover): `rgba(49, 106, 197, 0.25)`
- Selection Blue (selected): `rgba(30, 80, 160, 0.4)`

### Typography
- **Font Stack:** Tahoma, "Trebuchet MS", Verdana, sans-serif
- **Desktop Icons:** 12px with subtle text shadow (0px 1px 2px rgba(0,0,0,0.8))
- **Clock:** 11px semibold with text shadow

### Icon Styling
- Icon Size: 72×72 pixels
- Label: White text, subtle shadow (no heavy black border)
- Hover: Translucent blue background, no borders/gradients/shadows
- Selected: Darker translucent blue background
- Layout: Vertical columns (top-to-bottom, then left-to-right)

## 🚦 Getting Started

### Prerequisites
- Node.js 20.x or later
- npm package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/web-portfolio.git
cd web-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:3000 in your browser

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create production build |
| `npm start` | Start production server (requires build) |
| `npm run lint` | Run ESLint checks |

## 🏗️ Current Implementation Status

### ✅ Completed Features
- [x] Windows XP Luna taskbar with authentic gradient
- [x] Start button with hover and active image states
- [x] System tray with security/info icons and live clock
- [x] Desktop icons with 72×72 sizing and XP styling
- [x] Single-selection model for desktop icons
- [x] Hover and selected states with translucent backgrounds
- [x] Wallpaper click to deselect all icons
- [x] Mobile responsive fallback
- [x] Vertical column layout for icons
- [x] Authentic XP text styling (subtle shadow, no black border)

### 📝 Future Enhancements
- [ ] Window management system (opening windows from icons)
- [ ] Draggable windows with XP-style title bars
- [ ] Start menu with program list
- [ ] Right-click context menus
- [ ] Additional desktop icons with real content
- [ ] Content integration (Projects, About, Contact as actual windows)

## 🎭 The Desktop Metaphor

Instead of traditional page navigation, this portfolio uses the Windows XP desktop as the interface:

- **Desktop Icons** represent portfolio sections (About Me, Projects, Contact)
- **Taskbar** provides system status and quick access
- **Selection** mimics XP's translucent blue highlight
- **Double-click** (future) will open content in draggable windows

This creates an immersive, nostalgic experience that stands out from conventional portfolio designs.

## 🤝 Contributing

This is a personal portfolio project. While contributions are welcome, the primary focus is on maintaining the authentic Windows XP aesthetic and user experience.

## 📄 License

This project is open source. The Windows XP visual elements are used for educational and portfolio purposes.

## 🙏 Acknowledgments

- Windows XP and the Luna theme are trademarks of Microsoft Corporation
- Bliss wallpaper photographed by Charles O'Rear
- Inspired by the nostalgia of classic Windows interfaces

---

**Built with ❤️ by Rohann Dizon**

*"Backend-first developer building high-scale university platforms"*
