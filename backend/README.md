# Library Inventory Backend API

ASP.NET Core 8 Web API for the Library Inventory System frontend.

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Development:** SQLite (included, no install needed)
- **Production:** SQL Server — see [database/README.md](database/README.md)

## Setup

```bash
cd backend
dotnet restore
dotnet ef database update --project src/LibraryInventory.Infrastructure --startup-project src/LibraryInventory.Api
dotnet run --project src/LibraryInventory.Api
```

## URLs

- API base: `http://localhost:5000/api/`
- Swagger: `http://localhost:5000/swagger`

## Default Login

- **Username:** `admin`
- **Password:** `admin123`

## Frontend Connection

The React frontend is already configured to use `http://localhost:5000/api/`. Start the frontend with:

```bash
npm run dev
```

Then open `http://localhost:5173` and sign in with the credentials above.

## Production Database (SQL Server)

See **[database/README.md](database/README.md)** for:
- SQL Server Express, Azure SQL, and Docker setup
- Connection string examples
- SQL scripts (`database/sql/`)
- Migration commands
- Security and backup guide

Quick production start:

```bash
cd backend
$env:ASPNETCORE_ENVIRONMENT="Production"
$env:ConnectionStrings__DefaultConnection="Server=YOUR_SERVER;Database=LibraryInventoryDb;User Id=library_app;Password=YOUR_STRONG_PASSWORD;TrustServerCertificate=True;Encrypt=True;"
dotnet ef database update --project src/LibraryInventory.Infrastructure --startup-project src/LibraryInventory.Api
dotnet run --project src/LibraryInventory.Api
```

## Project Structure

```
backend/
├── LibraryInventory.sln
├── src/
│   ├── LibraryInventory.Api/           # Controllers, middleware, Program.cs
│   ├── LibraryInventory.Application/   # Services, requests, validators, DTOs
│   ├── LibraryInventory.Domain/        # Entities and enums
│   └── LibraryInventory.Infrastructure/ # EF Core, repositories, security, seed
├── database/                           # SQL Server scripts, Docker, setup guide
└── data/                               # SQLite dev database (gitignored)
```

## API Endpoints

| Method | Route | Auth |
|--------|-------|------|
| POST | /api/auth/login | No |
| GET/POST/PUT/DELETE | /api/books | Yes |
| GET | /api/books/low-stock | Yes |
| PATCH | /api/books/{id}/stock-in | Yes |
| PATCH | /api/books/{id}/stock-out | Yes |
| GET/POST/PUT/DELETE | /api/categories | Yes |
| GET | /api/inventory-logs | Yes |
| GET | /api/reports/inventory-summary | Yes |
| GET | /api/reports/low-stock | Yes |
| GET | /api/reports/books-by-category | Yes |
