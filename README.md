# Library Inventory System

Full-stack library inventory management application.

| Layer | Tech | Location |
|-------|------|----------|
| Frontend | React + TypeScript + Vite | `frontend/` |
| Backend | ASP.NET Core 8 Web API | `backend/src/` |
| Database | SQLite (dev) / SQL Server (prod) | `backend/data/` |

## Quick Start

### Prerequisites
- Node.js 18+
- .NET 8 SDK

### Run both apps

**Terminal 1 — Backend:**
```bash
npm run dev:backend
```

**Terminal 2 — Frontend:**
```bash
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:5000/api/
- Swagger: http://localhost:5000/swagger

### Default login
- **Username:** `admin`
- **Password:** `admin123`

## Folder Structure

```
library-inventory-system/
├── frontend/          # React app
├── backend/           # .NET API + database scripts
├── docs/              # Project documentation
├── package.json       # Root scripts (delegates to frontend/backend)
└── README.md
```

See [docs/folder-structure.md](docs/folder-structure.md) for the complete tree.

## Documentation

- [Setup guide](docs/setup.md)
- [Folder structure](docs/folder-structure.md)
- [API endpoints](docs/api-endpoints.md)
- [Architecture](docs/architecture.md)
- [Backend README](backend/README.md)
- [Database setup](backend/database/README.md)
- [Frontend README](frontend/README.md)
