# Next Project

A Next.js 16 issue tracker built with the App Router, TypeScript, Tailwind CSS v4, MUI 9, Prisma, NextAuth, React Query, React Hook Form, Zod, and Zustand.

## Features

- Authentication with NextAuth and Prisma.
- Dashboard with status breakdown and latest issue summaries.
- Issue list, detail, create, edit, and delete flows.
- Server-side auth and issue APIs under `src/app/api`.
- Markdown-based issue descriptions.
- Creator tracking for each issue, including database relation, API responses, and UI display.
- React Query backed issue fetching, mutations, cache updates, sorting, filtering, and pagination.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- MUI 9
- Prisma with MySQL
- NextAuth v5 beta
- React Query
- React Hook Form
- Zod
- Zustand

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `.env`:

```bash
DATABASE_URL="mysql://..."
AUTH_SECRET="your-secret"
```

3. Generate the Prisma client and apply migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

4. Start the development server:

```bash
npm run dev
```

The app runs at `http://localhost:3000`.

## Available Scripts

- `npm run dev` starts the local development server.
- `npm run build` creates a production build.
- `npm run start` serves the production build.
- `npm run type-check` runs TypeScript checks with `tsc --noEmit`.
- `npm run lint` runs the project ESLint command.

## Project Structure

```text
src/
  app/          Routes, layouts, API handlers, server actions, and route-local components
    api/        Auth and issues API routes
    dashboard/  Dashboard page and route-local dashboard components
    issues/     Issues pages, hooks, forms, editor, and page-local helpers
  components/   Shared providers and reusable UI
  lib/          Shared helpers, validation, Prisma access, and data utilities
  stores/       Zustand stores
  styles/       Global styles and design tokens
  theme/        MUI theme configuration
prisma/
  migrations/   Prisma migration history
  schema.prisma Database schema
public/         Static assets
```

Prefer keeping route-specific code near its route. Move code into `src/components`, `src/lib`, `src/stores`, or `src/theme` only when it is shared across features.

## Data Model Notes

The database is managed by Prisma using MySQL. Authentication tables follow the Auth.js Prisma adapter shape, and the issue tracker uses the `Issue` model.

The `Issue` model stores:

- `title`
- `description`
- `status`
- `createdAt`
- `updatedAt`
- `creatorId`

Each issue can be linked to a `User` through the `creator` relation. If the related user is removed, Prisma sets `creatorId` to `NULL`, and the UI falls back to an unknown creator label.

## Development Notes

- Use the shared Prisma client from `src/lib/prisma.ts`.
- Keep issue serialization and shared issue API helpers in `src/lib/issues.ts`.
- Keep request validation in `src/lib/validationSchemas.ts`.
- Use React Query for server state, React Hook Form for form state, and Zustand only for transient client UI state.
- Keep Markdown editing and preview behavior inside the issues feature.

## Portfolio Readiness

This project is intended to demonstrate practical full-stack web development skills for junior or graduate developer roles, including roles in the New Zealand market.

Current strengths:

- Full-stack feature delivery with Next.js App Router, React, TypeScript, Prisma, and MySQL.
- Real CRUD workflows for issue listing, detail, creation, editing, and deletion.
- Authentication and user-linked issue ownership through NextAuth and Prisma relations.
- API request validation with Zod and structured JSON responses.
- Server state management with React Query instead of duplicating server data in local client state.
- Form handling with React Hook Form and reusable validation schemas.
- Route-local feature organization with shared infrastructure in `src/lib`, `src/components`, `src/theme`, and `src/stores`.

Recommended next steps before using this as a primary job application portfolio project:

- Deploy the app and include a live URL in this README.
- Add screenshots or a short walkthrough showing the dashboard, issue list, issue detail, editor, and auth flow.
- Add automated tests for validation schemas, issue helpers, API behavior, and important form flows.
- Strengthen authorization rules, for example by allowing only the issue creator or an admin to edit or delete an issue.
- Polish loading, empty, error, unauthorized, and not-found states across the main workflows.
- Document important architecture decisions, especially React Query versus Zustand, server versus client components, Prisma schema design, and API validation.
- Add a short "Known limitations" section once deployment and testing are in place.

Interview topics this project should support:

- How data moves between the database, API routes, server-rendered pages, React Query hooks, and UI components.
- Why server state belongs in React Query and transient UI state belongs in Zustand.
- How authentication state is checked in API handlers and protected workflows.
- How Prisma relations connect issues to users and how nullable creators are handled.
- How validation errors are returned from the API and displayed in forms.
- What would need to change for higher traffic, larger data sets, more roles, or a production deployment.

## Validation

Before committing changes, run:

```bash
npm run type-check
npm run build
```

Run `npm run lint` or `npx eslint src --max-warnings=0` when touching React components, app structure, or API handlers.
