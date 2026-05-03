# CLAUDE.md - GameStore Frontend

## Stack

- Vite + React 19 + TypeScript
- Routing: React Router v7 (data-router mode)
- Server State: TanStack Query (React Query)
- Client State: Zustand
- Forms: React Hook Form + Zod
- Styling: Tailwind CSS + shadcn/ui
- Animations: framer-motion
- Toasts: sonner

## Backend Contract

Backend contract is defined in `../GameStore.Api/CLAUDE.md` and `../GameStore.Api/games.http`.
Read both before writing any API hook. Do not invent endpoints or DTO fields.
The dev server runs on `http://localhost:5173`.

## Folder Structure

We use a feature-based architecture:

- `src/app/`: app shell, providers (QueryClient, Router), main.tsx
- `src/features/`: domain-specific modules (e.g., games, genres).
- `src/shared/`: generic api client, ui primitives, utilities, hooks.
  - `src/shared/api/`: `client.ts` — exports `apiClient` and `BASE_URL`.
  - `src/shared/context/`: React contexts (e.g., `ThemeContext`).
  - `src/shared/components/`: reusable UI components (e.g., `ThemeToggle`).
  - `src/shared/design/`: design tokens (`tokens.ts`).

## Rules

1. Use TypeScript strict mode. No `any` without a comment.

2. Loose Coupling: Features can import from `shared/` freely, but NEVER from another feature directly — only through that feature's `index.ts` barrel.

3. No business logic in components. Components are presentational unless explicitly a container.

4. API calls live ONLY inside `features/*/api/`.

5. End every phase by running the verification commands (e.g., `npm run dev`, `npm run lint`) and wait for the user's explicit approval.

6. **Single Responsibility per file.** Each file has one job, stated in one sentence. If you can't describe a file's purpose without "and," split it.
   - API hooks go in `features/*/api/*.ts` — no UI, no form logic.
   - Form schemas go in `features/*/schemas.ts` (or colocated with the form that uses them) — no API calls.
   - Types go in `features/*/types.ts` — no runtime code.
   - Components render UI and wire callbacks — they do not fetch, mutate, or validate.

7. **Depend on types and contracts, not on other features' internals.** A feature may import from another feature ONLY through its `index.ts` barrel, and only types or public hooks — never components from deep paths, never utilities marked internal. If you need something from another feature that isn't exported, promote it to `shared/` instead of reaching in.

8. **No magic values.** Hardcoded strings or numbers used in more than one place must become named constants. URLs, query keys, route paths, storage keys, timeouts — all named. Single-use values can stay inline.

9. **Extract on the third occurrence, not the first.** Do not pre-emptively create abstractions, wrappers, or generic utilities. Duplicate once, duplicate twice, extract on the third. Premature abstraction is worse than duplication.

10. **Prefer composition over configuration.** A component with 8 boolean props is a component that should be 3 components. If a function has 5+ parameters or a component has 5+ props of different shapes, split it before adding the sixth.

**Principle:** Boring, obvious code wins. If a senior engineer would call your solution "clever," rewrite it simpler. Prefer duplication to premature abstraction; prefer direct code to indirection.

## Commands

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run lint` - Check code quality

## Lessons

- **Zod v4 renamed `invalid_type_error` to `error`**: use `z.number({ error: 'msg' })`, not `z.number({ invalid_type_error: 'msg' })` — the old key is silently ignored and TypeScript will error.
- **`z.coerce.number()` breaks `useForm<T>` typing**: coerce sets the input type to `unknown`, making the zodResolver incompatible with a typed `useForm`; use `z.number()` instead and push coercion into RHF's `register('field', { valueAsNumber: true })` for number inputs and `setValueAs` for selects.
- **shadcn v4 uses Base UI, not Radix — `asChild` does not exist**: use the `render` prop instead, e.g. `render={<Button variant="outline" />}` on `AlertDialogPrimitive.Close`.
- **`AlertDialogAction` does not auto-close the dialog**: it is a plain `Button` wrapper; manage `open` state manually with `useState` and call `setOpen(false)` inside the mutation's `onSuccess`.
- **`GET /games` returns `genre: string` but `GET /games/:id` returns `genre: number` (genreId)**: always cross-reference `GET /genres` on the detail page to resolve the name; the two DTOs are intentionally different.
- **`DateOnly` from .NET serializes as `"YYYY-MM-DD"` with no time component**: never pass it directly to `new Date()` — parse with `.split('-')` to construct a local-midnight date and avoid a one-day timezone shift.
- **TypeScript 6 deprecated `baseUrl`**: do not add `baseUrl` to any tsconfig; use `paths` alone for the `@/*` alias — Vite's `resolve.alias` handles runtime resolution independently.
- **`<button>` elements do not get `cursor: pointer` automatically**: add it to the `buttonVariants` base class in `src/components/ui/button.tsx` so every button-styled element (including Base UI trigger primitives) inherits it.
- **Route order matters: `/games/new` must be registered before `/games/:id`**: React Router v7 matches top-down; if `:id` comes first, the string `"new"` is treated as a game ID.
- **`setState` synchronously inside `useEffect` triggers `react-hooks/set-state-in-effect`**: co-locate the flag and its key in one state object and derive staleness from props instead — e.g. `const stale = state.url !== prop.url` — no `useEffect` needed and no cascade render.
- **Base UI `SelectValue` does not auto-resolve item labels from a closed popup**: use the `children` render function to look up the label yourself: `<SelectValue>{(value) => genres.find(g => String(g.id) === value)?.name ?? <span>placeholder</span>}</SelectValue>`.
- **Date input calendar icon is invisible on dark backgrounds**: add `color-scheme: dark` to `input[type="date"]` in `@layer base` — it is the only CSS lever that recolours native UA form controls.
- **Sonner `theme="dark"` sets its own inline styles that outrank class selectors**: use the `!` prefix (`!bg-[...]`) on all `toastOptions.classNames` values to apply `!important`; without it, Sonner's inline styles win the cascade regardless of specificity.
- **`AnimatePresence initial={false}` prevents spurious entrance animations**: without it, the child already mounted on first render runs through the `enter` variant, causing an unwanted slide-in on page load.
