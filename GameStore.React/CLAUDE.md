# CLAUDE.md - GameStore Frontend

## Stack

- Vite + React 19 + TypeScript
- Routing: React Router v7 (data-router mode)
- Server State: TanStack Query (React Query)
- Client State: Zustand
- Forms: React Hook Form + Zod
- Styling: Tailwind CSS + shadcn/ui

## Backend Contract

Backend contract is defined in `../GameStore.Api/CLAUDE.md` and `../GameStore.Api/games.http`.
Read both before writing any API hook. Do not invent endpoints or DTO fields.
The dev server runs on `http://localhost:5173`.

## Folder Structure

We use a feature-based architecture:

- `src/app/`: app shell, providers (QueryClient, Router), main.tsx
- `src/features/`: domain-specific modules (e.g., games, genres).
- `src/shared/`: generic api client, ui primitives, utilities, hooks.

## Rules

1. Use TypeScript strict mode. No `any` without a comment.
2. Loose Coupling: Features can import from `shared/` freely, but NEVER from another feature directly — only through that feature's `index.ts` barrel.
3. No business logic in components. Components are presentational unless explicitly a container.
4. API calls live ONLY inside `features/*/api/`.
5. Execution Flow: Execute ONLY one phase at a time from SPEC.md. NEVER proceed to the next phase automatically. End every phase by running the verification commands (e.g., `npm run dev`, `npm run lint`) and wait for the user's explicit approval.

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
