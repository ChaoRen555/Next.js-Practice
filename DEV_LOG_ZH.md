# Development Log

This document is used to record daily learning, code reading, implementation notes, and review points. The goal is to make it easy to recover context the next day without having to remember everything from scratch.

## How To Use This File

Before ending a development session, spend 5 minutes adding one entry:

- What you understood today.
- What you changed today.
- Where you are currently stuck.
- Where to continue next time.

Try to include specific file names and concrete next actions.

## Entry Template

```markdown
## YYYY-MM-DD

### Goal

- 

### Completed

- 

### Files Read

- 

### Files Changed

- 

### Current Understanding

- 

### Current Blockers

- 

### Next Steps

1. 
2. 
3. 

### Notes

- 
```

## 2026-05-01

### Goal

- Start treating the current project as a real codebase to read, maintain, and extend.
- Build a high-level project map first, then gradually understand the implementation details.

### Completed

- Created `CODEBASE_MIND_MAP_ZH.md` to record the overall project structure and codebase mind map.
- Added `CODEBASE_MIND_MAP_ZH.md` to `.gitignore` so it stays as a local learning note and is not committed.
- Created `DEV_LOG_ZH.md` to record daily development and learning context.

### Files Read

- `src/app/layout.tsx`
- `src/components/app-theme-provider.tsx`
- `src/components/query-provider.tsx`
- `src/components/toaster-provider.tsx`
- `src/app/NavBar.tsx`
- `src/app/NavBarLinks.tsx`
- `src/app/UserMenu.tsx`
- `src/app/actions/authActions.ts`
- `src/app/api/auth/[...nextauth]/route.ts`

### Files Changed

- `.gitignore`
- `DEV_LOG_ZH.md`

### Current Understanding

- `src/app/layout.tsx` is the root layout for the whole application.
- Every page is wrapped by `RootLayout`.
- `AppThemeProvider` mounts React Query, the toast provider, the MUI theme, and `CssBaseline`.
- `NavBar` is a Server Component and uses `auth()` to read the current session.
- `NavBarLinks` and `UserMenu` are Client Components because they need browser-side hooks, state, or events.
- Logout is handled by the Server Action `logoutAction()`, which calls `signOut()`.

### Current Blockers

- The main `/issues` feature flow has not been fully read yet.
- Need to understand the complete data flow from page, to React Query, to API route, to Prisma.

### Next Steps

1. Open `src/app/issues/page.tsx`.
2. Follow it to `src/app/issues/IssuesClient.tsx`.
3. Read `useIssuesQuery()` in `src/app/issues/hooks.ts`.
4. Follow the request to `fetchIssues()` in `src/lib/issues.ts`.
5. Read the `GET` handler in `src/app/api/issues/route.ts`.

### Notes

- Before ending each development session, leave a clear handoff note in this file under `Next Steps`.
