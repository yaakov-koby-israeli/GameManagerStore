# GameStore React — Frontend Spec

## API Contract Summary

Base URL: `http://localhost:5090`

| Method | Endpoint      | Request Body    | Response          |
|--------|---------------|-----------------|-------------------|
| GET    | /games        | —               | GameSummaryDto[]  |
| GET    | /games/:id    | —               | GameDetailsDto    |
| POST   | /games        | CreateGameDto   | GameDetailsDto    |
| PUT    | /games/:id    | UpdateGameDto   | 204               |
| DELETE | /games/:id    | —               | 204               |
| GET    | /genres       | —               | GenreDto[]        |

### Key DTO shapes

**GameSummaryDto** (list): `{ id, name, genre: string, price, releaseDate }`  
**GameDetailsDto** (detail/create response): `{ id, name, genre: number (genreId), price, releaseDate }`  
**CreateGameDto / UpdateGameDto**: `{ name, genreId, price, releaseDate }` — name ≤50 chars, genreId 1–50, price 1–100  
**GenreDto**: `{ id, name }`

> Note: `GET /games` returns resolved genre *name*; `GET /games/:id` returns genre *id*. Resolve genre name on the detail page by cross-referencing `/genres`.

---

## Tech Stack (per CLAUDE.md)

- **Routing**: React Router v7 (data-router mode)
- **Server state**: TanStack Query (React Query)
- **Client state**: Zustand
- **Forms**: React Hook Form + Zod
- **Styling**: Tailwind CSS + shadcn/ui

---

## Folder Structure

```
src/
├── app/
│   ├── main.tsx          # entry point, mounts providers + router
│   ├── providers.tsx     # QueryClientProvider, RouterProvider
│   └── router.tsx        # createBrowserRouter — all routes defined here
├── features/
│   ├── games/
│   │   ├── index.ts      # barrel export
│   │   ├── api/
│   │   │   └── gamesApi.ts   # all /games fetch hooks
│   │   ├── components/
│   │   │   ├── GameList.tsx
│   │   │   ├── GameDetail.tsx
│   │   │   ├── GameForm.tsx  # shared by create + edit
│   │   │   └── DeleteGameButton.tsx
│   │   ├── pages/
│   │   │   ├── GamesPage.tsx        # /games
│   │   │   ├── GameDetailPage.tsx   # /games/:id
│   │   │   ├── CreateGamePage.tsx   # /games/new
│   │   │   └── EditGamePage.tsx     # /games/:id/edit
│   │   └── types.ts      # GameSummaryDto, GameDetailsDto, CreateGameDto, UpdateGameDto
│   └── genres/
│       ├── index.ts
│       ├── api/
│       │   └── genresApi.ts   # GET /genres hook
│       └── types.ts           # GenreDto
└── shared/
    └── api/
        └── client.ts     # base fetch wrapper (sets base URL, handles JSON, throws on non-2xx)
```

---

## Route Map

| Path              | Page             | Description                          |
|-------------------|------------------|--------------------------------------|
| `/`               | redirect → /games| Root redirects to games list         |
| `/games`          | GamesPage        | Table of all games                   |
| `/games/new`      | CreateGamePage   | Blank form to create a game          |
| `/games/:id`      | GameDetailPage   | Full game info + Edit/Delete actions |
| `/games/:id/edit` | EditGamePage     | Pre-populated form to update a game  |

---

## Phased Milestones

### Phase 1 — Project Foundation
- [ ] Install dependencies: `react-router-dom@7`, `@tanstack/react-query`, `zustand`, `react-hook-form`, `zod`, `@hookform/resolvers`
- [ ] Install and init Tailwind CSS v4 + shadcn/ui
- [ ] Create folder skeleton: `src/app/`, `src/features/games/`, `src/features/genres/`, `src/shared/`
- [ ] `src/shared/api/client.ts` — fetch wrapper (baseURL `http://localhost:5090`, JSON headers, throws on non-2xx)
- [ ] `src/app/router.tsx` — `createBrowserRouter` with placeholder routes
- [ ] `src/app/providers.tsx` — `QueryClientProvider` + `RouterProvider`
- [ ] `src/app/main.tsx` — mount providers

**Verify:** `npm run dev` loads without errors; navigating to `/` works.

---

### Phase 2 — Genres Data
- [ ] `src/features/genres/types.ts` — `GenreDto` TypeScript type
- [ ] `src/features/genres/api/genresApi.ts` — `useGenres()` hook (`useQuery` → `GET /genres`)
- [ ] Export via `src/features/genres/index.ts`

**Verify:** `useGenres()` returns an array of `{ id, name }` objects (confirm via React Query DevTools).

---

### Phase 3 — Games List Page
- [ ] `src/features/games/types.ts` — `GameSummaryDto` type
- [ ] `src/features/games/api/gamesApi.ts` — `useGames()` hook (`useQuery` → `GET /games`)
- [ ] `GameList.tsx` — table columns: Name (link to `/games/:id`), Genre, Price (formatted as currency), Release Date
- [ ] `GamesPage.tsx` — renders `<GameList>` + "Add Game" button linking to `/games/new`
- [ ] Wire `/games` route

**Verify:** Games list renders all seeded games; clicking a game name navigates to detail.

---

### Phase 4 — Game Detail Page
- [ ] Add `GameDetailsDto` to `types.ts`
- [ ] `gamesApi.ts` — `useGame(id)` hook (`useQuery` → `GET /games/:id`)
- [ ] `GameDetail.tsx` — displays Name, Genre (resolved name via `useGenres()`), Price, Release Date; includes Edit button (→ `/games/:id/edit`) and Delete button
- [ ] `GameDetailPage.tsx` — extracts `:id` param, renders `<GameDetail>`
- [ ] Wire `/games/:id` route

**Verify:** Detail page shows correct data; genre name is resolved (not a raw ID).

---

### Phase 5 — Create Game
- [ ] Add `CreateGameDto` to `types.ts`
- [ ] `gamesApi.ts` — `useCreateGame()` mutation (`useMutation` → `POST /games`, invalidates `['games']` on success)
- [ ] `GameForm.tsx` — React Hook Form + Zod schema:
  - `name`: string, required, max 50
  - `genreId`: number, required, 1–50 (rendered as `<select>` from `useGenres()`)
  - `price`: number, required, 1–100
  - `releaseDate`: string (ISO date), required
- [ ] `CreateGamePage.tsx` — renders blank `<GameForm>`, on success navigates to `/games/:newId`
- [ ] Wire `/games/new` route (must come **before** `/games/:id` in router to avoid param collision)

**Verify:** Submitting valid data creates a game and redirects to its detail page; validation errors appear inline for bad inputs.

---

### Phase 6 — Edit Game
- [ ] Add `UpdateGameDto` to `types.ts`
- [ ] `gamesApi.ts` — `useUpdateGame(id)` mutation (`useMutation` → `PUT /games/:id`, invalidates `['games']` and `['game', id]`)
- [ ] `EditGamePage.tsx` — loads game via `useGame(id)`, passes existing values as `defaultValues` to `<GameForm>`, on success navigates back to `/games/:id`
- [ ] Wire `/games/:id/edit` route

**Verify:** Edit form is pre-populated; saving updates the game; navigates back to detail.

---

### Phase 7 — Delete Game
- [ ] `gamesApi.ts` — `useDeleteGame()` mutation (`useMutation` → `DELETE /games/:id`, invalidates `['games']`)
- [ ] `DeleteGameButton.tsx` — renders Delete button; shows a confirmation dialog (shadcn/ui `AlertDialog`) before calling mutation; on success navigates to `/games`

**Verify:** Clicking Delete shows confirmation; confirming removes the game and redirects to the list.

---

## Query Key Conventions

| Key             | Used by        |
|-----------------|----------------|
| `['games']`     | `useGames()`   |
| `['game', id]`  | `useGame(id)`  |
| `['genres']`    | `useGenres()`  |

Mutations invalidate only the keys they affect (see per-phase notes above).

---

## Validation Rules (mirror API constraints)

| Field       | Rule                            |
|-------------|---------------------------------|
| name        | required, string, max 50 chars  |
| genreId     | required, integer, 1–50         |
| price       | required, number, 1–100         |
| releaseDate | required, valid ISO date string |

---

## End-to-End Verification Checklist

1. Start API: `cd ../GameStore.Api && dotnet run`
2. Start frontend: `npm run dev`
3. Navigate to `http://localhost:5173` — should redirect to `/games`
4. Games list shows seeded data
5. Click a game — detail page shows resolved genre name (not a raw ID)
6. Click "Add Game" — fill form, submit — new game appears in list
7. Open new game — click Edit, change price, save — detail reflects change
8. Click Delete — confirm — game removed from list
9. `npm run lint` — no errors
10. `npm run build` — builds without TypeScript errors
