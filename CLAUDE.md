# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Electron desktop app for Japanese trash/garbage collection reminders (ゴミ出し通知). Built with Electron 35 + React 19 + TypeScript 5.8 + Vite 6. Uses Google Gemini 3 Flash API to parse PDF schedules into structured data.

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

- `src/main/index.ts` — App entry, creates BrowserWindow (500x400) and tray icon, initializes auto-updater
- `src/main/ipc/scheduleHandlers.ts` — IPC handlers for schedule CRUD and API key management
- `src/main/ipc/geminiHandlers.ts` — IPC handlers for PDF file selection and Gemini extraction
- `src/main/ipc/updaterHandlers.ts` — IPC handlers for manual update check and installation
- `src/main/services/scheduleStore.ts` — `electron-store` persistence with V1→V2 auto-migration
- `src/main/services/geminiService.ts` — Google Gemini PDF-to-schedule extraction (V1/V2 response handling)
- `src/main/services/updaterService.ts` — `electron-updater` auto-update with renderer notification

### Renderer

- Types: `src/renderer/src/types/` (`schedule.ts` for V2 schema, `electron.d.ts` for IPC types)
- Constants: `src/renderer/src/constants/schedule.ts` (trash icons, day names, rule labels)
- Utils: `src/renderer/src/utils/` (`dateUtils.ts` for date formatting, `scheduleMatch.ts` for rule matching)
- State: Jotai atoms in `src/renderer/src/stores/` (`scheduleAtom`, `viewModeAtom`, `updaterAtom`)
- Hooks: `useSchedule` (load/save), `useDateTime` (clock tick), `useGeminiImport` (PDF import), `useUpdater` (auto-update)
- Views: Dashboard (today's trash + weekly schedule), Settings (API key, PDF import, schedule/rule editor), UpdateBanner (global)
- Path alias: `@/` maps to `src/renderer/src/`

### Key Types

```typescript
type TrashDay = { name: string; icon: string };
type ScheduleRule = WeeklyRule | BiweeklyRule | NthWeekdayRule | SpecificDatesRule;
type ScheduleEntry = { id: string; trash: TrashDay; rule: ScheduleRule };
type TrashSchedule = { version: 2; entries: ScheduleEntry[] };
```

## Code Style & Linting

- **Linters**: Oxlint (primary, Rust-based) + ESLint with `eslint-config-love` + `eslint-plugin-functional`
- **Formatters**: Oxfmt for TS/TSX, Prettier for CSS only
- **Preload must output as CJS** (configured in `electron.vite.config.ts`) — changing this causes white screen
- Use `type` keyword instead of `interface` (ESLint rule)
- No magic numbers except 0 and 1
- Max function lines: 50, max nesting depth: 4, complexity limit: 15
- Functional components with hooks only, no class components
- Functional style enforced: no `let` (use `const`), no loops (use array methods), no mutations

## Testing

- Vitest with `happy-dom` environment
- `@testing-library/react` for component tests
- `window.electronAPI` is globally mocked in `src/renderer/src/test/setup.ts`
- Test files: `src/**/*.test.{ts,tsx}` or `src/**/__tests__/**`
