# AGENTS.md

> **⚠️ IMPORTANT**: This is NOT the Next.js you know. This version (16.2.4) has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

---

## Project Overview

A retro-inspired web portfolio featuring a Windows 98-style desktop interface. Rather than conventional page navigation, users interact with desktop icons, draggable windows, and a taskbar—transforming the portfolio into an immersive, nostalgic experience.

**Key Technologies:**
- **Next.js**: 16.2.4 (App Router)
- **React**: 19.2.4
- **TypeScript**: ^5 (strict mode enabled)
- **Tailwind CSS**: ^4 (CSS-first configuration)
- **ESLint**: ^9 (flat config)

---

## Setup Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Create production build
npm run build

# Start production server (requires build)
npm start

# Run ESLint
npm run lint

# Run Prettier (after configuration)
npm run format
```

**Prerequisites:**
- Node.js 20.x or later
- npm package manager
- Docker Desktop (if using containerization)

> **⚠️ Docker Reminder**: Run `docker ps` before docker commands. If you see a daemon error, start Docker Desktop first.

---

## Development Workflow

### Starting Development

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Open browser to `http://localhost:3000`
4. Make changes — hot reload is automatic

### Tailwind CSS v4 Syntax

This project uses Tailwind CSS v4 with the new CSS-first configuration:

```css
/* globals.css */
@import "tailwindcss";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

**Key differences from v3:**
- Use `@import "tailwindcss"` instead of `@tailwind` directives
- Custom properties defined in `@theme inline`
- No `tailwind.config.js` — configuration is CSS-based

### Environment Variables

Create `.env.local` for local development:

```bash
# Example (add actual variables as needed)
NEXT_PUBLIC_API_URL=https://api.example.com
CDN_URL=https://cdn.example.com
```

---

## Code Style Guidelines

### TypeScript Standards

- **Zero `any` policy**: Challenge any `.any` usage — offer typed alternatives
- **Explicit return types**: Always declare return types on functions
- **Strict mode**: Enabled in `tsconfig.json` — no exceptions
- **Props interfaces**: Name conventionally as `Props`

### Component Patterns

**Props Interface Pattern:**

```typescript
interface Props {
  src: string;
  alt: string;
  overlay?: boolean;
  children?: React.ReactNode;
}

export default function ImageBox({ src, alt, overlay }: Props) {
  // Component implementation
}
```

**Async Server Component with Data Fetching:**

```typescript
import { getUnitsWithImages, UnitWithImages } from "@/services/units.services";

export default async function DeptContainer() {
  const docs: UnitWithImages[] = await getUnitsWithImages();
  
  return (
    <div className="relative flex flex-col">
      {/* Render data */}
    </div>
  );
}
```

**Client Component (when using hooks or browser APIs):**

```typescript
"use client";

import { useState } from "react";

interface Props {
  initialCount?: number;
}

export default function Counter({ initialCount = 0 }: Props) {
  const [count, setCount] = useState(initialCount);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

### Path Aliases

Use these path aliases instead of relative paths (`../../../`):

| Alias | Maps To |
|-------|---------|
| `@/components/*` | `./components/*` |
| `@/types/*` | `./types/*` |
| `@/services/*` | `./services/*` |
| `@/hooks/*` | `./hooks/*` |
| `@/lib/*` | `./lib/*` |
| `@/features/*` | `./features/*` |
| `@/*` | `./*` |

### Tailwind CSS v4 Classes

**Windows 98 Styling:**

The project uses a Windows 98 color palette defined in CSS custom properties:

```css
:root {
  --win98-teal: #008080;
  --win98-gray: #c0c0c0;
  --win98-dark-gray: #808080;
  --win98-light-gray: #dfdfdf;
  --win98-white: #ffffff;
  --win98-black: #000000;
}
```

**Utility Classes:**

```css
/* Raised border effect (Windows 98 style) */
.win98-raised {
  border: 2px solid;
  border-color: var(--win98-white) var(--win98-black) var(--win98-black) var(--win98-white);
}

/* Inset/sunken border effect */
.win98-inset {
  border: 2px solid;
  border-color: var(--win98-dark-gray) var(--win98-light-gray) var(--win98-light-gray) var(--win98-dark-gray);
}
```

**Tailwind v4 Tips:**
- Use `bg-[#c0c0c0]` for arbitrary values
- Prefer `@theme inline` for frequently used custom values
- Responsive modifiers: `sm:`, `md:`, `lg:`, `xl:`

### Metadata and SEO

Use `generateMetadata` for page-specific SEO:

```typescript
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Rohann Dizon | Full Stack Developer",
    description: "Backend-first developer building high-scale university platforms",
    openGraph: {
      title: "Rohann Dizon Portfolio",
      description: "Full stack developer specializing in Node.js, TypeScript, and Next.js",
      type: "website",
    },
  };
}
```

**Static metadata (in layout.tsx):**

```typescript
export const metadata: Metadata = {
  title: {
    default: "Rohann Dizon",
    template: "%s | Portfolio",
  },
  description: "Full stack developer portfolio",
};
```

---

## Project Structure

```
web-portfolio/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with fonts
│   ├── page.tsx                  # Desktop container (main entry)
│   ├── globals.css               # Global styles & Tailwind v4
│   └── favicon.ico               # Site favicon
├── components/                   # React components
│   ├── desktop/                  # Desktop environment
│   ├── icons/                    # Desktop icons
│   ├── taskbar/                  # Taskbar & Start menu
│   ├── window/                   # Window management
│   └── ui/                       # Reusable UI components
├── features/                     # Feature-based organization
│   └── [feature-name]/
│       └── components/
├── services/                     # Data fetching & business logic
├── hooks/                        # Custom React hooks
├── lib/                          # Utilities & helpers
├── types/                        # TypeScript interfaces
├── public/                       # Static assets
│   └── icons/                    # Desktop & window icons
├── openspec/                     # OpenSpec change tracking
│   ├── changes/                  # In-progress changes
│   ├── specs/                      # Feature specifications
│   └── config.yaml                 # OpenSpec configuration
├── .next/                        # Next.js build output
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── eslint.config.mjs             # ESLint flat config
├── postcss.config.mjs            # PostCSS configuration
└── package.json                  # Dependencies & scripts
```

### File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Components | PascalCase | `DesktopIcon.tsx`, `Taskbar.tsx` |
| Hooks | camelCase with `use` prefix | `useWindowManager.ts` |
| Services | camelCase with `.services.ts` | `user.services.ts` |
| Types | PascalCase with `.types.ts` | `user.types.ts` |
| Utilities | camelCase | `formatDate.ts` |
| Pages | kebab-case | `about-me/page.tsx` |
| Routes | camelCase | `route.ts` (Route Handlers) |

---

## OpenSpec Workflow

This project uses OpenSpec for tracking changes and specifications.

### Directory Structure

```
openspec/
├── changes/                      # In-progress changes
│   └── <change-name>/
│       ├── .openspec.yaml        # Change metadata
│       ├── proposal.md           # Change proposal
│       ├── design.md             # Design decisions
│       └── tasks.md              # Implementation tasks
├── specs/                        # Feature specifications
│   └── <feature-name>/
│       └── spec.md               # Feature requirements
└── config.yaml                   # OpenSpec configuration
```

### Creating a New Change

1. Create directory: `openspec/changes/<change-name>/`
2. Add `.openspec.yaml`:
   ```yaml
   name: <change-name>
   status: draft
   ```
3. Write `proposal.md` with:
   - **Why**: Reason for the change
   - **What Changes**: List of modifications
   - **Capabilities**: New/modified capabilities
   - **Impact**: Affected files and breaking changes
4. Write `design.md` with:
   - **Context**: Current and target state
   - **Goals/Non-Goals**: Scope boundaries
   - **Decisions**: Design choices with rationale
   - **Risks/Trade-offs**: Potential issues
   - **Migration Plan**: Deployment and rollback
5. Write `tasks.md` with:
   - Numbered task lists
   - Checkboxes for tracking
   - Testing and verification steps

### Specifications

Feature specs live in `openspec/specs/<feature-name>/spec.md`:

```markdown
## ADDED Requirements

### Requirement: [Feature capability]
The [Component] SHALL [requirement description].

#### Scenario: [Scenario name]
- **WHEN** [action occurs]
- **THEN** [expected result]
```

---

## Git Workflow & CI/CD

### Pre-commit Hooks

After configuring Husky and Prettier, the following will run before each commit:

```bash
# .husky/pre-commit
npm run format
npm run lint
```

### Conventional Commits

Use conventional commit format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no code change)
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(desktop): add draggable window component
fix(taskbar): correct clock timezone offset
docs(readme): update development setup instructions
```

### GitHub Actions Workflows

**Setup Lint Test Scan** (`.github/workflows/setup-lint-test-scan.yml`):
- Runs on push/PR to `main`, `dev`, `staging`
- Installs dependencies: `npm ci`
- Formats code: `npm run format`
- Runs lint: `npm run lint`
- Builds project: `npm run build`
- Security scans: CodeQL, Semgrep, Trivy

**Build and Push Image** (`.github/workflows/build-push-image.yml`):
- Triggered after successful lint/test workflow
- Builds Docker image
- Pushes to GitHub Container Registry

---

## Testing Instructions

> **Note**: Testing framework to be configured (Vitest recommended). For now, use manual verification.

### Manual Verification

1. **Build Check**: Run `npm run build` — should complete without errors
2. **Lint Check**: Run `npm run lint` — should pass with no warnings
3. **Type Check**: TypeScript errors appear during build
4. **Visual Verification**: Check components render correctly in browser

### Component Testing Pattern (when Vitest is added)

```typescript
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DesktopIcon from "@/components/icons/DesktopIcon";

describe("DesktopIcon", () => {
  it("renders with label", () => {
    render(<DesktopIcon icon="folder" label="Projects" />);
    expect(screen.getByText("Projects")).toBeInTheDocument();
  });
});
```

---

## Build and Deployment

### Build Process

```bash
# Create optimized production build
npm run build

# Output directory: .next/
# Static files: .next/static/
```

### Docker Configuration (Recommended)

Add to `next.config.ts` for Docker support:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // For Docker deployment
  // ...other config
};

export default nextConfig;
```

### Deployment: Oracle Cloud

Deployment to Oracle Cloud Infrastructure (TBD):

1. Build Docker image locally or via CI/CD
2. Push to Oracle Container Registry
3. Deploy to Oracle Cloud compute instance
4. Configure environment variables
5. Set up reverse proxy (nginx)

---

## Sample Configuration Files

### .prettierrc

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 100,
  "tabWidth": 2,
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindFunctions": ["clsx", "cn"]
}
```

**Installation:**
```bash
npm install --save-dev prettier prettier-plugin-tailwindcss
```

**Add to package.json:**
```json
"scripts": {
  "format": "prettier --write .",
  "format:check": "prettier --check ."
}
```

### .husky/pre-commit

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run format
npm run lint
```

**Installation:**
```bash
npm install --save-dev husky
npx husky init
```

### eslint.config.mjs (Already Configured)

```javascript
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
```

---

## Next.js 16 Specifics

### Async Patterns (Next.js 15+)

`params` and `searchParams` are now async:

```typescript
// app/blog/[slug]/page.tsx
export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Use slug
}
```

### Server Components vs Client Components

**Server Components** (default):
- Can be async
- Can access database directly
- Cannot use hooks or browser APIs

**Client Components** (with `'use client'`):
- Can use hooks and browser APIs
- Cannot be async
- Add `'use client'` at the top of the file

### Route Handlers

Use `route.ts` for API endpoints:

```typescript
// app/api/users/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const users = await fetchUsers();
  return NextResponse.json(users);
}
```

**Note**: Route handlers cannot export from `page.tsx` in the same directory.

### Image Optimization

Always use `next/image`:

```typescript
import Image from "next/image";

<Image
  src="/path/to/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority // For LCP images
/>
```

**Remote images**: Configure in `next.config.ts`:

```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.example.com",
      },
    ],
  },
};
```

---

## Troubleshooting

### Common Issues

**Issue**: `Cannot find module '@/components/ui/dialog'`
- **Solution**: Check path alias exists in `tsconfig.json` and the file exists

**Issue**: Tailwind classes not working
- **Solution**: Ensure `@import "tailwindcss"` is at the top of `globals.css`

**Issue**: TypeScript errors after adding async params
- **Solution**: Wrap params in `Promise<>` type and await it

**Issue**: Docker build fails
- **Solution**: Check `output: 'standalone'` is set in `next.config.ts`

**Issue**: ESLint flat config errors
- **Solution**: Ensure `eslint.config.mjs` uses `.mjs` extension and ES module syntax

### Performance Tips

1. Use `next/image` for all images
2. Lazy load non-critical components with `dynamic` imports
3. Use React Server Components for data fetching
4. Minimize `'use client'` usage

### Resources

- [Next.js 16 Docs](https://nextjs.org/docs)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [OpenSpec Documentation](https://openspec.dev)

---

## Development Status

**Current Phase**: Foundation setup (Phase 1)
**Active Change**: `desktop-layout-foundation` (OpenSpec)

### Roadmap

- [x] Project initialization
- [x] Tailwind CSS v4 configuration
- [ ] Desktop layout foundation (in progress)
- [ ] Desktop icon grid system
- [ ] Window management system
- [ ] Taskbar component
- [ ] Content integration (Projects, About, Contact)
- [ ] Responsive mobile fallback
- [ ] Performance optimization
- [ ] Accessibility improvements

---

*Built with Next.js 16, React 19, TypeScript 5, and Tailwind CSS v4*
