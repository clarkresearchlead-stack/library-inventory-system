# Architecture

## System overview

```
┌─────────────────┐     HTTP/JSON      ┌─────────────────┐     EF Core     ┌─────────────────┐
│  React Frontend │ ◄───────────────► │  ASP.NET Core   │ ◄─────────────► │    Database     │
│  (Vite + MobX)  │   JWT Bearer      │   Web API       │                 │ SQLite / SQL    │
│  localhost:5173 │                   │  localhost:5000 │                 │    Server       │
└─────────────────┘                   └─────────────────┘                 └─────────────────┘
```

## Frontend architecture

- **Pages** — thin route wrappers, fetch data on mount
- **Features** — domain UI components (books, categories, etc.)
- **Stores** — MobX state management per module
- **API** — axios HTTP clients calling backend REST endpoints
- **Shared** — reusable UI primitives and utilities

## Backend architecture (Clean Architecture)

```
Api (Controllers)
    ↓
Application (Services, Validators, DTOs)
    ↓
Infrastructure (Repositories, EF Core, Security)
    ↓
Domain (Entities, Enums)
```

## Authentication flow

1. User submits login form → `POST /api/auth/login`
2. Backend validates credentials, returns JWT + user object
3. Frontend stores token in localStorage
4. All subsequent requests include `Authorization: Bearer {token}`
5. 401 responses redirect to `/login`

## Data model

```
users ──────────────────────────────────────────
categories ──► books ──► inventory_logs
```

## Key conventions

- API JSON uses **snake_case** (`category_id`, `created_at`)
- DB columns use **snake_case**
- Frontend TypeScript uses **camelCase** in code, matches API response shape
- CORS allows `http://localhost:5173` in development
