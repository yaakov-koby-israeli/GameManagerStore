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

| Class   | Key properties |
|---------|----------------|
| `Game`  | `Id`, `Name`, `GenreId` (FK), `Genre?` (nav), `Price`, `ReleaseDate` |
| `Genre` | `Id`, `Name` |

### DTOs (`Dtos/`)

| Record            | Purpose |
|-------------------|---------|
| `GameSummaryDto`  | List response — includes resolved `Genre` name (string) |
| `GameDetailsDto`  | Single-item response — uses `GenreId` (int) |
| `CreateGameDto`   | POST body — has DataAnnotations validation (`[Required]`, `[StringLength]`, `[Range]`) |
| `UpdateGameDto`   | PUT body — same shape as `CreateGameDto`, no `Id` |
| `GenreDto`        | Genre list response |

Validation is enabled globally via `builder.Services.AddValidation()`.

### Endpoints (`Endpoints/`)

**`GamesEndPoints`** (`/games`) — extension method `MapGamesEndPoints`:

| Verb   | Route        | Notes |
|--------|--------------|-------|
| GET    | `/games`     | Joins `Genre` via `.Include`, projects to `GameSummaryDto`, uses `.AsNoTracking()` |
| GET    | `/games/{id}`| `FindAsync` by id, returns `GameDetailsDto`; named route `GetGameById` |
| POST   | `/games`     | Inserts new `Game`, returns `201 CreatedAtRoute` with `GameDetailsDto` |
| PUT    | `/games/{id}`| Updates fields + `SaveChangesAsync`, returns `204` |
| DELETE | `/games/{id}`| `ExecuteDeleteAsync` (no load needed), returns `204` |

**`GenresEndpoints`** (`/genres`) — extension method `MapGenresEndpoints`:

| Verb | Route     | Notes |
|------|-----------|-------|
| GET  | `/genres` | Projects all genres to `GenreDto`, uses `.AsNoTracking()` |
