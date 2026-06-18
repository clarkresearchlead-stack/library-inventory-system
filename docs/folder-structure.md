# Folder Structure

Complete map of the Library Inventory System monorepo.

## Root

```
library-inventory-system/
├── README.md                 # Project overview & quick start
├── package.json              # Root npm scripts
├── .gitignore
├── frontend/                 # React SPA
├── backend/                  # .NET Web API
└── docs/                     # Shared documentation
```

## Frontend (`frontend/`)

| Path | Purpose |
|------|---------|
| `src/app/routes/` | React Router configuration |
| `src/app/providers/` | React context providers |
| `src/pages/` | Route-level page components (thin) |
| `src/features/` | Feature modules with components |
| `src/layout/` | App shell (sidebar, dashboard layout) |
| `src/shared/components/ui/` | shadcn/ui design system |
| `src/shared/utils/` | HTTP client, storage keys, guards |
| `src/api/` | REST API client functions |
| `src/models/` | TypeScript types/interfaces |
| `src/stores/root/` | MobX root store & React context |
| `src/stores/modules/` | Per-domain MobX stores |

## Backend (`backend/`)

| Path | Purpose |
|------|---------|
| `src/LibraryInventory.Api/` | Controllers, middleware, Program.cs |
| `src/LibraryInventory.Application/` | Services, requests, validators, DTOs |
| `src/LibraryInventory.Domain/` | Entities, enums |
| `src/LibraryInventory.Infrastructure/` | EF Core, repositories, seed, migrations |
| `database/sql/` | SQL Server setup scripts |
| `database/docker-compose.yml` | Local SQL Server container |
| `data/` | SQLite dev database (gitignored) |

## Docs (`docs/`)

| File | Purpose |
|------|---------|
| `setup.md` | First-time dev environment setup |
| `folder-structure.md` | This file |
| `api-endpoints.md` | REST API reference |
| `architecture.md` | System architecture overview |

## Finding files quickly

| I need… | Go to… |
|---------|--------|
| Login form | `frontend/src/features/auth/components/LoginForm.tsx` |
| Book CRUD UI | `frontend/src/features/books/components/BooksTable.tsx` |
| API HTTP calls | `frontend/src/api/*.api.ts` |
| MobX book store | `frontend/src/stores/modules/books/store.ts` |
| Auth controller | `backend/src/LibraryInventory.Api/Controllers/AuthController.cs` |
| Book service | `backend/src/LibraryInventory.Application/Services/Implementations/BookService.cs` |
| DB entities | `backend/src/LibraryInventory.Domain/Entities/` |
| EF migrations | `backend/src/LibraryInventory.Infrastructure/Data/Migrations/` |
| Seed data | `backend/src/LibraryInventory.Infrastructure/Data/Seed/DbInitializer.cs` |
| SQL scripts | `backend/database/sql/` |
