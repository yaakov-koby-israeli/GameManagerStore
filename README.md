# GameManagerStore

A full-stack app to browse and manage a video game catalog, with a REST API backend and a React frontend.

## 🛠️ Tech Stack

| Layer        | Technology                            |
| ------------ | ------------------------------------- |
| Runtime      | .NET 10 / ASP.NET Core 10 Minimal API |
| ORM          | EF Core 10                            |
| Database     | SQLite                                |
| Frontend     | React 19, Vite 8, TypeScript 6        |
| Server state | TanStack Query v5                     |
| Routing      | React Router v7                       |
| Forms        | React Hook Form + Zod                 |
| Styling      | Tailwind CSS v4, shadcn/ui (Base UI)  |
| Client state | Zustand                               |
| Animations   | framer-motion                         |
| Toasts       | sonner                                |

## 📁 Repository Structure

```
GameManagerStore/
├── GameStore.Api/                     # ASP.NET Core 10 Minimal API
│   ├── Configurations/                # CORS and other service extensions
│   ├── Data/                          # DbContext, migrations, seeding
│   ├── Dtos/                          # Request/response DTOs
│   ├── Endpoints/                     # Minimal API route handlers
│   ├── Models/                        # Game and Genre entities
│   ├── Properties/                    # Launch profiles (dev ports)
│   ├── wwwroot/uploads/games/         # Uploaded game images (git-ignored)
│   ├── appsettings.json               # Connection string, CORS origins
│   ├── games.http                     # Sample requests (REST Client)
│   ├── GameStore.Api.csproj           # Project file and dependencies
│   └── Program.cs                     # App entry, middleware, DI setup
│
├── GameStore.React/                   # Vite + React 19 frontend
│   ├── design-refs/                   # UI reference screenshots
│   ├── docs/                          # Dev session notes
│   ├── public/                        # Static assets served at root
│   ├── src/
│   │   ├── app/                       # App shell, providers, router
│   │   ├── assets/                    # Static images
│   │   ├── components/                # shadcn/ui component primitives
│   │   ├── features/                  # Domain feature modules
│   │   ├── lib/                       # Shared utilities (cn())
│   │   ├── shared/                    # Generic API client, contexts, design tokens
│   │   └── index.css                  # Tailwind CSS directives
│   ├── components.json                # shadcn/ui CLI config
│   ├── eslint.config.js               # ESLint configuration
│   ├── index.html                     # HTML shell, refs src/app/main.tsx
│   ├── package.json                   # Dependencies and scripts
│   ├── tsconfig.json                  # TypeScript config
│   └── vite.config.ts                 # Vite + Tailwind + path aliases
│
├── GameStore.slnx                     # Visual Studio solution file
└── README.md                          # This file
```

## 📋 Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- Node 18+ (required by Vite 8)

## 🚀 Getting Started

### Run the API

```bash
cd GameStore.Api
dotnet run
```

Runs on `http://localhost:5090`.

### Run the React client

```bash
cd GameStore.React
npm install
npm run dev
```

Runs on `http://localhost:5173`.

## 📡 API Reference

Base URL: `http://localhost:5090`

| Method | Path                | Description                                                           |
| ------ | ------------------- | --------------------------------------------------------------------- |
| GET    | `/games`            | List all games (includes genre name and image URL)       |
| GET    | `/games/{id}`       | Get a single game by ID                                  |
| POST   | `/games`            | Create a new game                                        |
| PUT    | `/games/{id}`       | Update an existing game                                  |
| DELETE | `/games/{id}`       | Delete a game (also removes image file from disk)        |
| POST   | `/games/{id}/image` | Upload a cover image (`multipart/form-data`, field `file`; max 5 MB) |
| GET    | `/genres`           | List all genres                                          |

Sample requests are in `GameStore.Api/games.http` (compatible with the VS Code REST Client extension).

## 🗄️ Database

SQLite database file (`GameStore.db`) is created locally and is git-ignored. EF Core migrations are applied automatically on startup. To apply them manually:

```bash
cd GameStore.Api

# Add a new migration
dotnet ef migrations add <MigrationName>

# Apply pending migrations manually
dotnet ef database update
```

---

This project is in active development.
