# Setup Guide

First-time development environment setup for the Library Inventory System.

## Prerequisites

1. **Node.js 18+** — https://nodejs.org/
2. **.NET 8 SDK** — https://dotnet.microsoft.com/download/dotnet/8.0
3. Optional: **SQL Server** or **Docker** for production database testing

## Clone & install

```bash
git clone <repo-url>
cd library-inventory-system

# Frontend dependencies
cd frontend
npm install
cd ..

# Backend restore
dotnet restore backend/LibraryInventory.sln
```

## Run development

**Backend** (Terminal 1):
```bash
npm run dev:backend
# or
dotnet run --project backend/src/LibraryInventory.Api/LibraryInventory.Api.csproj
```

**Frontend** (Terminal 2):
```bash
npm run dev
# or
cd frontend && npm run dev
```

## Verify

1. Open http://localhost:5173/login
2. Sign in with `admin` / `admin123`
3. Browse Dashboard, Books, Categories, Inventory, Reports
4. Swagger: http://localhost:5000/swagger

## Production database

See [backend/database/README.md](../backend/database/README.md) for SQL Server setup.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Login fails | Ensure backend is running on port 5000 |
| Port in use | Stop other processes on 5000 or 5173 |
| SQLite missing | Backend auto-creates `backend/data/library_inventory.db` on first run |
| CORS error | Frontend must run on http://localhost:5173 |
