# Repository Guidelines

## Project Structure & Module Organization
This repository is a small Next.js 16 App Router project. Application routes live in `src/app/`, including the root layout in `src/app/layout.tsx`, the homepage in `src/app/page.tsx`, and shared route-level UI such as `src/app/NavBar.tsx`. Reusable components belong in `src/components/`, shared helpers in `src/lib/`, and global styles in `src/styles/globals.css`. Root config files include `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, and `tsconfig.json`.

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `npm run dev`: start the local development server.
- `npm run build`: create the production build.
- `npm run start`: serve the production build locally.
- `npm run type-check`: run TypeScript checks with `tsc --noEmit`.
- `npm run lint`: run the Next.js ESLint command configured in `package.json`.

Run `npm run type-check` before committing. Use `npm run build` for final verification when changing layout, routing, or Tailwind setup.

## Coding Style & Naming Conventions
Use TypeScript and React function components. Follow the existing style: 2-space indentation, double quotes in TS/TSX, and semicolons. Keep component names in PascalCase (`NavBar.tsx`), utility functions in camelCase (`cn`), and route files in Next.js convention (`page.tsx`, `layout.tsx`). Prefer Tailwind utilities for component styling and keep shared theme values in `src/styles/globals.css` when they affect the whole app.

## Testing Guidelines
There is currently no dedicated test framework in this repository. For now, treat `npm run type-check` and `npm run build` as the minimum validation steps. When adding tests later, place them near the feature or under a `src/__tests__/` directory and use clear names such as `navbar.test.tsx`.

## Commit & Pull Request Guidelines
Recent history uses short, imperative English commit messages, for example: `Add Tailwind setup and refine the UI with a calmer palette`. Continue with that format: start with a verb and describe the visible change. For pull requests, include a short summary, list affected areas, mention validation steps, and attach screenshots for UI changes.

## Security & Configuration Tips
Do not commit `.env` files, local overrides, or secrets. Tailwind is wired through `postcss.config.mjs` and `@import "tailwindcss";` in `src/styles/globals.css`; keep those in sync when updating styling infrastructure.
