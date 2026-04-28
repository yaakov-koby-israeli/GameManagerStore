# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run the API (HTTP on port 5090)
dotnet run

# Run with HTTPS (ports 7007 / 5090)
dotnet run --launch-profile https

# Build
dotnet build

# Watch mode (auto-reloads on file changes)
dotnet watch

# Add a new EF Core migration
dotnet ef migrations add <MigrationName>

# Apply pending migrations
dotnet ef database update
```

No test project exists yet. The `games.http` file contains sample HTTP requests that can be executed with the VS Code REST Client extension or any HTTP client against `http://localhost:5090`.

## Rules

**Principle:** Boring, obvious code wins. The codebase is a Minimal API — keep it minimal. Resist adding services, repositories, or wrapper layers unless duplication forces it.

1. **Endpoints stay thin.** Endpoint handlers in `Endpoints/*.cs` may use `GameStoreContext` directly via `IGameStoreContext` injection. Do not introduce service classes, repositories, or mediators unless the same logic is duplicated across three or more endpoints.

2. **DTOs in, DTOs out.** Endpoints accept and return DTOs from `Dtos/`, never `Models/` entities. Map between them inline — no AutoMapper, no mapping extension methods unless the mapping is duplicated 3+ times.

3. **Validation lives on DTOs.** Use DataAnnotations (`[Required]`, `[StringLength]`, `[Range]`) on `CreateGameDto` and `UpdateGameDto`. Do not write manual validation inside endpoint handlers — `AddValidation()` handles it globally.

4. **Read paths use `.AsNoTracking()`.** Any GET endpoint that doesn't mutate must call `.AsNoTracking()` on the query.

5. **Prefer `ExecuteDeleteAsync` / `ExecuteUpdateAsync` over load-then-save.** When you only need to delete or update by id, do it in one round-trip without loading the entity.

6. **Migrations are append-only.** Never edit a generated migration file. If a migration is wrong, add a new one that corrects it.

7. **No magic strings for routes or query keys.** Named routes (e.g. `GetGameById`) must be referenced by name, not by re-typing the literal string elsewhere.

8. **One endpoint group per resource file.** Games endpoints live in `GamesEndPoints.cs`, genres in `GenresEndpoints.cs`. New resources (e.g. `Publishers`) get their own file with a `MapPublishersEndpoints` extension method registered in `Program.cs`.

## Architecture

ASP.NET Core 10 Minimal API backed by **SQLite via Entity Framework Core 10**.

### Data layer (`Data/`)

- **`GameStoreContext`** — EF Core `DbContext` with two `DbSet`s: `Games` (`Game`) and `Genre` (`Genre`).
- **`DataExtensions`** — two extension methods registered in `Program.cs`:
  - `AddGameStoreDb()` — registers `GameStoreContext` as a scoped SQLite service, reads the connection string from `appsettings.json` (`ConnectionStrings:GameStore`), and seeds `Genre` rows on first run.
  - `MigrateDb()` — applies pending EF Core migrations at startup.
- **`Data/Migrations/`** — auto-generated EF Core migration files. Do not edit by hand.
- Database file: `GameStore.db` (SQLite, local, git-ignored).

### Models (`Models/`)

| Class   | Key properties                                                       |
| ------- | -------------------------------------------------------------------- |
| `Game`  | `Id`, `Name`, `GenreId` (FK), `Genre?` (nav), `Price`, `ReleaseDate` |
| `Genre` | `Id`, `Name`                                                         |

### DTOs (`Dtos/`)

| Record           | Purpose                                                                                |
| ---------------- | -------------------------------------------------------------------------------------- |
| `GameSummaryDto` | List response — includes resolved `Genre` name (string)                                |
| `GameDetailsDto` | Single-item response — uses `GenreId` (int)                                            |
| `CreateGameDto`  | POST body — has DataAnnotations validation (`[Required]`, `[StringLength]`, `[Range]`) |
| `UpdateGameDto`  | PUT body — same shape as `CreateGameDto`, no `Id`                                      |
| `GenreDto`       | Genre list response                                                                    |

Validation is enabled globally via `builder.Services.AddValidation()`.

### Endpoints (`Endpoints/`)

**`GamesEndPoints`** (`/games`) — extension method `MapGamesEndPoints`:

| Verb   | Route         | Notes                                                                              |
| ------ | ------------- | ---------------------------------------------------------------------------------- |
| GET    | `/games`      | Joins `Genre` via `.Include`, projects to `GameSummaryDto`, uses `.AsNoTracking()` |
| GET    | `/games/{id}` | `FindAsync` by id, returns `GameDetailsDto`; named route `GetGameById`             |
| POST   | `/games`      | Inserts new `Game`, returns `201 CreatedAtRoute` with `GameDetailsDto`             |
| PUT    | `/games/{id}` | Updates fields + `SaveChangesAsync`, returns `204`                                 |
| DELETE | `/games/{id}` | `ExecuteDeleteAsync` (no load needed), returns `204`                               |

**`GenresEndpoints`** (`/genres`) — extension method `MapGenresEndpoints`:

| Verb | Route     | Notes                                                     |
| ---- | --------- | --------------------------------------------------------- |
| GET  | `/genres` | Projects all genres to `GenreDto`, uses `.AsNoTracking()` |

## Lessons

- **Image upload validates only filename extension and Content-Type header — not magic bytes**: a malicious client can spoof both. Acceptable for local/learning use; add magic-byte validation before any production deployment.
