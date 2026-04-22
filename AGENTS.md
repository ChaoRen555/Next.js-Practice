# Repository Guidelines

## Project Structure & Module Organization

This repository is a Next.js 16 App Router project using TypeScript, Tailwind CSS v4, MUI 9, Prisma, NextAuth, Zod, React Hook Form, React Query, and Zustand.

Key directories:

- `src/app/`: route entries, layouts, server actions, API routes, and route-local components. Current routes include the homepage, login page, issues list, issue detail, issue edit, issue creation, and issues APIs.
- `src/app/issues/`: issues feature UI, feature-level hooks, Markdown editor integration, and page-local helpers.
- `src/components/`: shared providers and reusable UI such as `app-theme-provider.tsx` and `query-provider.tsx`.
- `src/lib/`: shared helpers and infrastructure such as `prisma.ts`, `issues.ts`, validation schemas, and general utilities.
- `src/stores/`: Zustand stores for client-side UI state.
- `src/theme/`: MUI theme configuration.
- `src/styles/`: global styles, Tailwind import, and project-wide design tokens in `globals.css`.
- `prisma/`: schema and migration history.

Prefer keeping route-specific code close to the route and moving only reusable logic into `src/components/`, `src/lib/`, `src/stores/`, or `src/theme/`.

## Build, Test, and Development Commands

- `npm install`: install project dependencies.
- `npm run dev`: start the local development server.
- `npm run build`: create the production build.
- `npm run start`: serve the production build locally.
- `npm run type-check`: run TypeScript checks with `tsc --noEmit`.
- `npm run lint`: run the project ESLint configuration.
- `npx eslint src --max-warnings=0`: run ESLint directly against the source tree when targeted source-only validation is needed.

Validation expectations:

- Run `npm run type-check` before committing any change.
- Run `npm run build` after changes to routing, layout, Prisma usage, or shared styling/theme setup.
- Run `npm run lint` or `npx eslint src --max-warnings=0` when touching app structure, React components, or API handlers.

## Coding Style & Naming Conventions

- Use TypeScript and React function components throughout the app.
- Follow the existing code style: 2-space indentation, double quotes, and semicolons.
- Use PascalCase for React component files, camelCase for utilities, and Next.js route conventions like `page.tsx`, `layout.tsx`, and `route.ts`.
- Prefer the `@/` import alias defined in `tsconfig.json` for imports under `src/`.
- Keep server-only logic in server contexts such as route handlers or non-client modules; add `"use client";` only when the component truly needs client-side behavior.
- For feature work, prefer small route-local components and hooks over large monolithic client files.

## UI, Styling, and Theme Conventions

- Prefer Tailwind utilities for local layout and spacing.
- Keep shared colors, typography, and global tokens aligned with `src/styles/globals.css`.
- Reuse the MUI theme in `src/theme/theme.ts` instead of hardcoding repeated design values in multiple components.
- When building MUI-based UI, preserve the existing visual direction: soft light palette, rounded surfaces, serif typography, and glass-like panels.
- Shared client providers should be mounted once at the app shell level, not recreated inside individual pages.

## Data, Validation, and API Conventions

- Use the shared Prisma client from `src/lib/prisma.ts`; do not create ad hoc `PrismaClient` instances in route handlers or components.
- Keep request validation in shared Zod schemas such as `src/lib/validationSchemas.ts`.
- Return explicit HTTP status codes and structured JSON errors from API routes.
- When changing persisted data structures, update `prisma/schema.prisma` and commit the corresponding migration.
- Keep fetch/query functions in shared feature helpers such as `src/lib/issues.ts` when multiple hooks or components need the same server contract.
- Keep issue serialization logic centralized in `src/lib/issues.ts` so API handlers and server-rendered pages return the same shape.
- Preserve the `Issue.creator` relation and `creatorId` handling when changing issue persistence or API response shapes.

## Client State Conventions

- Use React Query for server state, fetching, mutations, cache updates, and invalidation.
- Use React Hook Form for client-side form state, submission wiring, and field error presentation.
- Use Zustand for transient UI state such as selected rows, dialog visibility, and local non-form UI state.
- Do not duplicate server state in Zustand when the same data already lives in React Query cache.
- Do not store form drafts or field-level validation state in Zustand when the form is already managed by React Hook Form.
- Prefer feature-level hooks, for example under `src/app/issues/`, to wrap React Query usage and keep page components thin.
- Keep Markdown editing and preview behavior inside the issues feature instead of scattering editor-specific state across shared layers.

## Testing Guidelines

There is no dedicated automated test framework in this repository yet.

Current minimum validation:

- `npm run type-check`
- `npm run build`

If tests are added later, place them near the feature or under `src/__tests__/` and use clear names such as `issues-api.test.ts` or `navbar.test.tsx`.

## Commit & Pull Request Guidelines

- Use short, imperative English commit messages, for example: `Add issues API validation` or `Refine homepage layout`.
- Keep each commit focused on one visible change or one coherent internal refactor.
- For pull requests, include a short summary, affected areas, validation steps, and screenshots for UI changes.

## Security & Configuration Tips

- Do not commit `.env` files, local overrides, database credentials, or other secrets.
- Keep Tailwind and PostCSS configuration in sync with `postcss.config.mjs` and `src/styles/globals.css`.
- Treat Prisma migrations as source-controlled artifacts and avoid editing applied migration files unless there is a clear recovery plan.
