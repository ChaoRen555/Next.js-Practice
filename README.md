# Next Project

A Next.js 16 issue tracker built with the App Router, TypeScript, Tailwind CSS v4, MUI 9, Prisma, NextAuth, React Query, React Hook Form, Zod, and Zustand.

## Features

- Authentication with NextAuth and Prisma.
- Issue list, detail, create, edit, and delete flows.
- Server-side issue APIs under `src/app/api/issues`.
- Markdown-based issue descriptions.
- Creator tracking for each issue, including database relation, API responses, and UI display.

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

3. Apply Prisma migrations:

```bash
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
- `npm run lint` runs the Next.js ESLint command configured in the project.

## Project Structure

```text
src/
  app/          Routes, layouts, API handlers, and route-local components
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

## Data Model Notes

The `Issue` model stores:

- `title`
- `description`
- `status`
- `createdAt`
- `updatedAt`
- `creatorId`

Each issue can be linked to a `User` through the `creator` relation. If the related user is removed, Prisma sets `creatorId` to `NULL`, and the UI falls back to an unknown creator label.

## Validation

Before committing changes, run:

```bash
npm run type-check
npm run build
```
