# Session Handoff — GameStore React Frontend

Built in one session from a blank Vite template to a full CRUD app.
Backend: ASP.NET Core 10 Minimal API at `http://localhost:5090` (see `../GameStore.Api/`).

---

## (a) What Works

All seven phases from `SPEC.md` are complete. The app is fully functional.

| Route | Page | Status |
|---|---|---|
| `/` | Redirects to `/games` | ✅ |
| `/games` | Games list — shadcn Table, Name link, Genre, Price (USD), Release Date | ✅ |
| `/games/new` | Create game — RHF + Zod form, genre dropdown, navigates to new game on save | ✅ |
| `/games/:id` | Game detail — resolved genre name, Edit/Delete actions | ✅ |
| `/games/:id/edit` | Edit game — pre-filled form, returns to detail on save | ✅ |
| Delete | AlertDialog confirmation on detail page, removes game, navigates to `/games` | ✅ |

**Data layer:** TanStack Query v5 with these query keys:

| Key | Hook | Invalidated by |
|---|---|---|
| `['games']` | `useGames()` | `useCreateGame`, `useDeleteGame` |
| `['game', id]` | `useGame(id)` | `useUpdateGame(id)` |
| `['genres']` | `useGenres()` | nothing (static seed data) |

After deletion, `['game', id]` is **removed** from the cache (not just invalidated) so a stale entry never lingers.

---

## (b) Architectural Decisions Not Obvious from the Code

### 1. `GameSummaryDto.genre` is a string; `GameDetailsDto.genre` is a number
The API returns different shapes from the same resource depending on the endpoint:
- `GET /games` → `genre: string` (the genre name, already resolved server-side)
- `GET /games/:id` → `genre: number` (the raw `genreId`)

This means the detail page must cross-reference `GET /genres` to display the genre name. The comment in `src/features/games/types.ts` documents this explicitly, and the mapping happens in `GameDetail.tsx`:
```ts
const genreName = genres?.find((g) => g.id === game.genre)?.name ?? '…';
```
The field name mismatch (`genre` in the DTO vs `genreId` in form values) is handled in `EditGamePage.tsx`:
```ts
const defaultValues: GameFormValues = {
  genreId: game.genre,  // game.genre is a genreId (int), not the name
  ...
};
```

### 2. `useDeleteGame` takes `id` as a mutation variable; `useUpdateGame` takes it as a hook argument
- `useUpdateGame(id)` — `id` is a hook arg because the Edit page is mounted for one specific game.
- `useDeleteGame()` — `id` is passed to `mutate(id)` because the same hook instance could theoretically delete any game (e.g. if re-used on a list page later).

### 3. `GameDetail` is explicitly a container, not presentational
`GameDetail` (`src/features/games/components/GameDetail.tsx`) receives `game` as a prop from `GameDetailPage` but also calls `useGenres()` and `useNavigate()` internally. This is intentional and noted in CLAUDE.md rule 3's "unless explicitly a container" carve-out. The alternative — lifting genres up to `GameDetailPage` and passing them down as props — would make `GameDetailPage` responsible for genre loading concerns it doesn't own.

### 4. `/games/new` must stay above `/games/:id` in the router
`src/app/router.tsx` registers `/games/new` before `/games/:id`. React Router v7 matches routes top-down; if `:id` came first, navigating to `/games/new` would treat `"new"` as a game ID and hit the detail page.

### 5. `UpdateGameDto` is a type alias, not a separate interface
`UpdateGameDto = CreateGameDto` in `src/features/games/types.ts`. The API bodies for POST and PUT are identical. Using an alias means if they diverge in the future you change only one line; for now it avoids duplicating identical fields.

### 6. `buttonVariants` applied to `<a>` and `<button>` primitives instead of `asChild`
shadcn v4 uses Base UI primitives. Base UI does not have `asChild` — it uses a `render` prop instead. Rather than using that pattern, link-buttons throughout the app use:
```tsx
<Link to="..." className={buttonVariants({ variant: 'outline' })}>Edit</Link>
```
This is semantically correct (`<a>` not `<button>`), avoids nesting interactive elements, and is what shadcn's own docs recommend for link-as-button use cases.

### 7. `cursor-pointer` lives in `buttonVariants`, not per-component
`<a>` elements get `cursor: pointer` from the browser automatically. `<button>` elements rendered by Base UI primitives do not. Rather than adding `cursor-pointer` per usage, it was added to the `buttonVariants` base class in `src/components/ui/button.tsx` so every button (Cancel, Delete, form submit, etc.) gets it automatically.

---

## (c) Deferred / Half-Done

| Item | Notes |
|---|---|
| **Zustand** | Installed (`package.json`) but never used. No client-side global state was needed — TanStack Query covered all server state. Remove it or use it for UI state (e.g. a toast queue). |
| **Dead template files** | `src/main.tsx`, `src/App.tsx`, `src/App.css` are unreachable (index.html points to `src/app/main.tsx`). They compile fine but are noise. Safe to delete. |
| **Toast notifications** | Create/Edit/Delete all navigate or mutate silently on success. No success toasts. On mutation error, nothing is shown to the user. |
| **Loading skeletons** | Loading states are plain centered text ("Loading games…"). No skeleton rows or shimmer effects. |
| **Error boundary** | No React error boundary wraps the router. An unhandled render error will show a blank screen. |
| **Code splitting** | Build emits a single 517 kB JS chunk (vite warns about > 500 kB). All libraries are bundled together. This is fine for a learning project but would need `React.lazy()` / dynamic imports for production. |
| **Search / filter** | The games list has no search, sort, or pagination. The API has no query params for filtering either. |
| **Auth** | Explicitly excluded. All routes are public. |

---

## (d) Gotchas for Future Sessions

### D1 — Zod v4 + React Hook Form resolver type conflict
**Don't use `z.coerce.number()`** in schemas used with `useForm<T>`. Zod v4's `z.coerce.number()` types its input as `unknown`, which makes the inferred resolver type incompatible with `useForm<GameFormValues>`, producing a `TS2322` error.

**The fix used in this project** — keep `z.number()` and push coercion into RHF's register options:
```ts
// number input → valueAsNumber uses input.valueAsNumber property
register('price', { valueAsNumber: true })

// select → setValueAs converts the string option value
register('genreId', { setValueAs: (v: string) => v === '' ? NaN : parseInt(v, 10) })
```
See `src/features/games/components/GameForm.tsx` for the full schema and comments.

### D2 — Zod v4 renamed `invalid_type_error` to `error`
Old (Zod v3):
```ts
z.number({ invalid_type_error: 'Please select a genre' })
```
New (Zod v4 — what's installed):
```ts
z.number({ error: 'Please select a genre' })
```
The TypeScript error message if you use the old name: `'invalid_type_error' does not exist in type '{ error?: string | $ZodErrorMap... }'`.

### D3 — shadcn v4 uses Base UI — no `asChild`, different close pattern
shadcn components import from `@base-ui/react/*`, not Radix. Two specific differences that will bite you:

**No `asChild`** — use the `render` prop instead:
```tsx
// Radix pattern (doesn't work here):
<AlertDialogCancel asChild><Button /></AlertDialogCancel>

// Base UI pattern (what shadcn generates):
<AlertDialogPrimitive.Close render={<Button variant="outline" />} />
```

**`AlertDialogAction` does not auto-close the dialog** — unlike the Radix-based shadcn, `AlertDialogAction` here is just a styled `Button`. To close the dialog after the action completes, use controlled state:
```tsx
const [open, setOpen] = useState(false);
// in mutation onSuccess:
setOpen(false);
```
See `src/features/games/components/DeleteGameButton.tsx` for the full pattern.

### D4 — `DateOnly` from .NET must be parsed manually
The API returns dates as `"1991-10-20"` (ISO 8601 date-only, no time component). Passing this directly to `new Date("1991-10-20")` creates a **UTC midnight** date, which shifts back one day in negative-offset timezones when displayed locally.

**Always parse by splitting:**
```ts
const [year, month, day] = dateStr.split('-').map(Number);
const local = new Date(year, month - 1, day); // local midnight, no shift
```
Used in `GameList.tsx` and `GameDetail.tsx`.

### D5 — TypeScript 6 deprecated `baseUrl`
`tsconfig.app.json` uses `paths` for the `@/*` alias **without** `baseUrl`. TypeScript 6 emits a deprecation error if `baseUrl` is present. The Vite alias in `vite.config.ts` handles runtime resolution; TypeScript only needs `paths`.

### D6 — `GET /genres` is effectively static
The genres are seeded once at startup and never change in the current API. `useGenres()` has no `staleTime` configured, so TanStack Query will refetch on window focus by default. Consider adding `staleTime: Infinity` to `genresApi.ts` if this causes unnecessary requests.

---

## (e) Recommended Next Steps (ranked by value)

### 1. Toast notifications — high value, low effort
Users get no feedback when create/edit/delete succeeds or fails silently (network error). Add [sonner](https://sonner.emilkowal.ski/) or a similar toast library.

- On mutation success: "Game added", "Changes saved", "Game deleted"
- On mutation error: display `error.message` from the thrown `Error`
- Wire into the `onSuccess` / `onError` callbacks in each mutation hook in `src/features/games/api/gamesApi.ts`

### 2. Error boundary — high value, one file
A single `src/app/ErrorBoundary.tsx` wrapping the router in `src/app/providers.tsx` prevents blank-screen crashes from unhandled render errors.

### 3. Loading skeletons — medium value, medium effort
Replace the plain-text loading states with shadcn `Skeleton` rows (`npx shadcn@latest add skeleton`). Highest impact on the games list (`src/features/games/pages/GamesPage.tsx`) since it's the landing page.

### 4. Delete dead template files — low effort, low risk
Remove `src/main.tsx`, `src/App.tsx`, `src/App.css`. They are never imported (entry point is `src/app/main.tsx`), but they are type-checked and add noise. Also remove `src/assets/react.svg`, `src/assets/vite.svg` if unused.

### 5. Remove or use Zustand — low effort
Zustand is installed but unused. Either:
- Remove it: `npm uninstall zustand`
- Use it: a global toast queue or a "confirm delete" modal open/close state would be good candidates

### 6. Code splitting — medium effort, matters at scale
The single JS bundle is 517 kB (gzipped ~161 kB). Split by route with `React.lazy`:
```ts
// src/app/router.tsx
const GamesPage = lazy(() => import('@/features/games/pages/GamesPage').then(m => ({ default: m.GamesPage })));
```
Do this after adding an error boundary (lazy + Suspense needs a fallback).

### 7. `staleTime` for genres — one line
```ts
// src/features/genres/api/genresApi.ts
useQuery({ queryKey: ['genres'], queryFn: ..., staleTime: Infinity })
```
Genres are static seed data — no need to refetch on every window focus.

### 8. Pagination or search — medium/high effort, depends on data volume
The current list fetches all games in one request. If the dataset grows, add server-side pagination or at minimum client-side filtering by name/genre.
