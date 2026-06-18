# Library Inventory — SQL Server Database Setup

Production database guide for the Library Inventory System ASP.NET Core 8 API.

## Prerequisites

- **SQL Server 2019+** or **Azure SQL Database**
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- EF Core CLI: `dotnet tool install --global dotnet-ef`
- Optional: [SQL Server Management Studio (SSMS)](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms)
- Optional: [Docker Desktop](https://www.docker.com/products/docker-desktop/) for local SQL Server testing

## Database Overview

| Setting | Value |
|---------|-------|
| Database name | `LibraryInventoryDb` |
| App login | `library_app` (least privilege) |
| Tables | `users`, `categories`, `books`, `inventory_logs` |
| Schema source of truth | EF Core migrations in `src/LibraryInventory.Infrastructure/Data/Migrations/` |

## Connection Strings

### A) SQL Server Express (Windows)

```
Server=localhost\SQLEXPRESS;Database=LibraryInventoryDb;Trusted_Connection=True;TrustServerCertificate=True;
```

### B) SQL Server LocalDB (Windows dev)

```
Server=(localdb)\mssqllocaldb;Database=LibraryInventoryDb;Trusted_Connection=True;TrustServerCertificate=True;
```

### C) Azure SQL Database

```
Server=tcp:YOUR_SERVER.database.windows.net,1433;Database=LibraryInventoryDb;User ID=library_app;Password=YOUR_PASSWORD;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```

### D) Docker SQL Server (local production testing)

```
Server=localhost,1433;Database=LibraryInventoryDb;User Id=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True;
```

> **Note:** Use `sa` only for local Docker testing. Use `library_app` in real production.

## Environment Configuration

| Environment | Config file | Database |
|-------------|-------------|----------|
| Development | `appsettings.Development.json` | SQLite (`library_inventory.db`) |
| Production | `appsettings.Production.json` | SQL Server |

Set the production environment when running:

```bash
cd backend
$env:ASPNETCORE_ENVIRONMENT="Production"   # PowerShell
dotnet run --project src/LibraryInventory.Api
```

### Override connection string with environment variable (recommended for secrets)

Do **not** commit real passwords to git. Set at deploy time:

**PowerShell:**
```powershell
$env:ConnectionStrings__DefaultConnection="Server=YOUR_SERVER;Database=LibraryInventoryDb;User Id=library_app;Password=YOUR_STRONG_PASSWORD;TrustServerCertificate=True;Encrypt=True;"
```

**Linux / macOS:**
```bash
export ConnectionStrings__DefaultConnection="Server=YOUR_SERVER;Database=LibraryInventoryDb;User Id=library_app;Password=YOUR_STRONG_PASSWORD;TrustServerCertificate=True;Encrypt=True;"
```

**Azure App Service:** Configuration → Connection strings → `DefaultConnection`

**User Secrets (local production testing):**
```bash
cd backend/src/LibraryInventory.Api
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost,1433;Database=LibraryInventoryDb;User Id=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True;"
```

---

## Option A: SQL Server Express (Windows)

1. Install [SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) and SSMS.
2. Open SSMS and connect to `localhost\SQLEXPRESS`.
3. Run SQL scripts in order (as admin):
   - `sql/01-create-database.sql`
   - `sql/02-create-login-and-user.sql` (replace `YOUR_STRONG_PASSWORD`)
4. Set connection string in environment variable or `appsettings.Production.json`.
5. Apply EF migrations:

```bash
cd backend
$env:ASPNETCORE_ENVIRONMENT="Production"
dotnet ef database update --project src/LibraryInventory.Infrastructure --startup-project src/LibraryInventory.Api
```

6. Run permissions script (after tables exist):
   - `sql/03-grant-permissions.sql`

7. Start API and verify login (see [Verify](#verify) below).

---

## Option B: Azure SQL Database

1. Create an **Azure SQL Server** and **SQL Database** named `LibraryInventoryDb`.
2. Configure firewall: allow your app server IP (or your dev IP for testing).
3. In SSMS or Azure Query Editor, run:
   - `sql/02-create-login-and-user.sql` (Azure: create user in database, not server login — adapt script for Azure AD or contained user if needed)
4. Set connection string via Azure App Service configuration or environment variable.
5. Apply migrations:

```bash
cd backend
$env:ASPNETCORE_ENVIRONMENT="Production"
$env:ConnectionStrings__DefaultConnection="Server=tcp:YOUR_SERVER.database.windows.net,1433;Database=LibraryInventoryDb;User ID=library_app;Password=YOUR_PASSWORD;Encrypt=True;TrustServerCertificate=False;"
dotnet ef database update --project src/LibraryInventory.Infrastructure --startup-project src/LibraryInventory.Api
```

6. Run `sql/03-grant-permissions.sql` if using `library_app`.

---

## Option C: Docker SQL Server (local production testing)

1. Start SQL Server:

```bash
cd backend/database
docker compose up -d
```

2. Wait until healthy (~30 seconds), then create database:

```bash
docker exec -it library-inventory-sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -C -i /dev/null
```

Or use SSMS to connect to `localhost,1433` with `sa` / `YourStrong!Passw0rd`.

3. Apply migrations with Docker connection string:

```bash
cd backend
$env:ASPNETCORE_ENVIRONMENT="Production"
$env:ConnectionStrings__DefaultConnection="Server=localhost,1433;Database=LibraryInventoryDb;User Id=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True;"
dotnet ef database update --project src/LibraryInventory.Infrastructure --startup-project src/LibraryInventory.Api
```

4. Start API with the same connection string. Seed data runs automatically on first startup.

---

## Apply Migrations

```bash
cd backend
dotnet ef database update --project src/LibraryInventory.Infrastructure --startup-project src/LibraryInventory.Api
```

On production startup, `DbInitializer` also calls `MigrateAsync()` for SQL Server, so pending migrations apply automatically.

---

## Verify

1. Start the API:

```bash
cd backend
$env:ASPNETCORE_ENVIRONMENT="Production"
dotnet run --project src/LibraryInventory.Api
```

2. Test login:

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"username":"admin","password":"admin123"}'
```

3. Confirm tables in SSMS: `users`, `categories`, `books`, `inventory_logs`, `__EFMigrationsHistory`.

4. Default credentials: **admin** / **admin123**

---

## Seed Data

On first run (empty `users` table), the API seeds:

- Admin user: `admin` / `admin123`
- 5 categories, 8 books, 7 inventory logs

---

## Security Checklist

- [ ] Use `library_app` login in production (not `sa`)
- [ ] Password minimum 16 characters
- [ ] Store connection string in environment variables or Azure Key Vault
- [ ] Use `Encrypt=True` for Azure SQL
- [ ] Restrict SQL Server / Azure firewall to app server IPs
- [ ] Enable daily backups in production
- [ ] Rotate `library_app` password periodically

### Password rotation

1. Create new password for `library_app` in SQL Server.
2. Update environment variable / Azure configuration.
3. Restart the API.
4. Revoke old password.

---

## Backup & Restore

### Backup

```sql
BACKUP DATABASE LibraryInventoryDb
TO DISK = N'C:\Backups\LibraryInventoryDb.bak'
WITH FORMAT, INIT, COMPRESSION, STATS = 10;
```

### Restore

```sql
USE master;
ALTER DATABASE LibraryInventoryDb SET SINGLE_USER WITH ROLLBACK IMMEDIATE;

RESTORE DATABASE LibraryInventoryDb
FROM DISK = N'C:\Backups\LibraryInventoryDb.bak'
WITH REPLACE;

ALTER DATABASE LibraryInventoryDb SET MULTI_USER;
```

---

## SQL Scripts Reference

| File | Purpose |
|------|---------|
| `sql/01-create-database.sql` | Create `LibraryInventoryDb` |
| `sql/02-create-login-and-user.sql` | Create `library_app` login and user |
| `sql/03-grant-permissions.sql` | Grant least-privilege permissions |

EF Core migrations remain the **source of truth** for table schema. Prefer migrations over manual DDL.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| LocalDB not found | Use Docker SQL Server or SQL Server Express |
| Login failed for library_app | Re-run `02-create-login-and-user.sql`, check password |
| Migration fails | Ensure login has schema permissions; run as admin first |
| API still uses SQLite | Set `ASPNETCORE_ENVIRONMENT=Production` |
| CORS errors | Ensure frontend runs on `http://localhost:5173` |
