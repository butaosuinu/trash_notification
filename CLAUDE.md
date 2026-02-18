# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Electron desktop app for Japanese trash/garbage collection reminders (ゴミ出し通知). Built with Electron 35 + React 19 + TypeScript 5.8 + Vite 6. Uses Google Gemini 2.0 Flash API to parse PDF schedules into structured data.

## Commands

```bash
pnpm run dev              # Start dev server with hot reload
pnpm run build            # Production build
pnpm run check            # Run format:check + lint + test:run (full CI check)
pnpm run lint             # oxlint src && eslint src
pnpm run lint:fix         # oxlint src --fix && eslint src --fix
pnpm run format           # oxfmt src --write && prettier --write 'src/**/*.css'
pnpm run typecheck        # tsc --noEmit
pnpm run test             # vitest (watch mode)
pnpm run test:run         # vitest run (single run)
pnpm run test:coverage    # vitest run --coverage
```

Run a single test file: `pnpm vitest run src/renderer/src/utils/__tests__/dateUtils.test.ts`

## Architecture

Three-process Electron app managed by `electron-vite`:

- **Main process** (`src/main/`) — Window/tray creation, IPC handler registration, services
- **Preload** (`src/preload/`) — Context bridge exposing `window.electronAPI` for safe IPC
- **Renderer** (`src/renderer/`) — React UI with Jotai state management and Tailwind CSS

### Main Process

- `src/main/index.ts` — App entry, creates BrowserWindow (500x400) and tray icon
- `src/main/ipc/` — IPC handlers for schedule CRUD and Gemini API calls
- `src/main/services/scheduleStore.ts` — `electron-store` persistence wrapper
- `src/main/services/geminiService.ts` — Google Gemini PDF-to-schedule extraction

### Renderer

- State: Jotai atoms in `src/renderer/src/stores/` (`scheduleAtom`, `settingsAtom`)
- Hooks: `useSchedule` (load/save), `useDateTime` (clock tick), `useGeminiImport` (PDF import flow)
- Views: Dashboard (today's trash + weekly schedule) and Settings (API key, PDF import, schedule editor)
- Path alias: `@/` maps to `src/renderer/src/`

### Key Types

```typescript
type TrashDay = { name: string; icon: string };
type TrashSchedule = Record<string, TrashDay>;  // key = day of week (0-6)
```

## Code Style & Linting

- **Linters**: Oxlint (primary, Rust-based) + ESLint with `eslint-config-love`
- **Formatters**: Oxfmt for TS/TSX, Prettier for CSS only
- **Preload must output as CJS** (configured in `electron.vite.config.ts`) — changing this causes white screen
- Use `type` keyword instead of `interface` (ESLint rule)
- No magic numbers except 0 and 1
- Max function lines: 50, max nesting depth: 4, complexity limit: 15
- Functional components with hooks only, no class components

## Testing

- Vitest with `happy-dom` environment
- `@testing-library/react` for component tests
- `window.electronAPI` is globally mocked in `src/renderer/src/test/setup.ts`
- Test files: `src/**/*.test.{ts,tsx}` or `src/**/__tests__/**`
