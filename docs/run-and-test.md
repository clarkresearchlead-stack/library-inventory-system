# Run & Test Guide

How to run the Library Inventory System locally and test the API with Postman.

## Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 18+ | https://nodejs.org/ |
| .NET SDK | 8.0 | https://dotnet.microsoft.com/download/dotnet/8.0 |
| Postman | Any recent version | https://www.postman.com/downloads/ |

Optional: **Docker** and **SQL Server** — only needed for production database testing. See [backend/database/README.md](../backend/database/README.md).

---

## First-time setup

From the project root:

```bash
# Install frontend dependencies
cd frontend
npm install
cd ..

# Restore backend packages
dotnet restore backend/LibraryInventory.sln
```

On first backend startup, SQLite creates `backend/data/library_inventory.db` and seeds sample data (admin user, 5 categories, 8 books).

---

## Run the system

You need **two terminals** — backend first, then frontend.

### Terminal 1 — Backend (API)

From the project root:

```bash
npm run dev:backend
```

Or directly:

```bash
dotnet run --project backend/src/LibraryInventory.Api/LibraryInventory.Api.csproj
```

| Service | URL |
|---------|-----|
| API base | http://localhost:5000/api/ |
| Swagger UI | http://localhost:5000/swagger |

Wait until you see `Now listening on: http://localhost:5000`.

### Terminal 2 — Frontend (React app)

From the project root:

```bash
npm run dev
```

Or from the frontend folder:

```bash
cd frontend
npm run dev
```

| App | URL |
|-----|-----|
| Login page | http://localhost:5173/login |
| Dashboard | http://localhost:5173/ (after login) |

### Default login

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin123` |

---

## Verify in the browser

1. Confirm the backend is running (`http://localhost:5000/swagger` loads).
2. Open `http://localhost:5173/login`.
3. Sign in with `admin` / `admin123`.
4. Browse **Dashboard**, **Books**, **Categories**, **Inventory**, and **Reports**.

If login fails, the backend is usually not running or not reachable on port 5000.

---

## Test with Postman

### Base URL

```
http://localhost:5000/api
```

All protected routes require a JWT token in the header:

```
Authorization: Bearer {your_token}
Content-Type: application/json
```

### JSON property names

The API uses **snake_case** in JSON (e.g. `category_id`, `publication_year`). camelCase (`categoryId`, `publicationYear`) is also accepted.

---

## Step 1 — Login and get a token

| Setting | Value |
|---------|-------|
| Method | `POST` |
| URL | `http://localhost:5000/api/auth/login` |
| Auth | None |
| Headers | `Content-Type: application/json` |

**Body (raw → JSON):**

```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Expected response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "Admin",
    "created_at": "..."
  }
}
```

Copy the `token` value — you need it for all other requests.

---

## Step 2 — Set authorization in Postman

For every protected request:

1. Open the **Authorization** tab.
2. Type: **Bearer Token**.
3. Token: paste the value from the login response.

Or add a header manually:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## Step 3 — Test endpoints

### Books

#### GET all books

```
GET http://localhost:5000/api/books
Authorization: Bearer {token}
```

#### GET book by ID

```
GET http://localhost:5000/api/books/1
Authorization: Bearer {token}
```

#### GET low-stock books

```
GET http://localhost:5000/api/books/low-stock
Authorization: Bearer {token}
```

#### POST create book

```
POST http://localhost:5000/api/books
Authorization: Bearer {token}
Content-Type: application/json
```

```json
{
  "title": "New Book Title",
  "author": "Jane Doe",
  "category_id": 1,
  "genre": "Fiction",
  "isbn": "978-0000000001",
  "publication_year": 2024,
  "quantity": 5
}
```

#### PUT update book

```
PUT http://localhost:5000/api/books/1
Authorization: Bearer {token}
Content-Type: application/json
```

```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "category_id": 1,
  "genre": "Classic",
  "isbn": "978-0743273565",
  "publication_year": 1925,
  "quantity": 10
}
```

All fields are required on create and update.

#### DELETE book

```
DELETE http://localhost:5000/api/books/8
Authorization: Bearer {token}
```

#### PATCH stock in

```
PATCH http://localhost:5000/api/books/1/stock-in
Authorization: Bearer {token}
Content-Type: application/json
```

```json
{
  "quantity": 5,
  "remarks": "Restock from supplier"
}
```

#### PATCH stock out

```
PATCH http://localhost:5000/api/books/1/stock-out
Authorization: Bearer {token}
Content-Type: application/json
```

```json
{
  "quantity": 2,
  "remarks": "Sold to customer"
}
```

---

### Categories

#### GET all categories

```
GET http://localhost:5000/api/categories
Authorization: Bearer {token}
```

Seeded category IDs: **1** Fiction, **2** Non-Fiction, **3** Science, **4** History, **5** Technology.

#### POST create category

```
POST http://localhost:5000/api/categories
Authorization: Bearer {token}
Content-Type: application/json
```

```json
{
  "name": "Biography"
}
```

#### PUT update category

```
PUT http://localhost:5000/api/categories/1
Authorization: Bearer {token}
Content-Type: application/json
```

```json
{
  "name": "Fiction & Literature"
}
```

#### DELETE category

```
DELETE http://localhost:5000/api/categories/6
Authorization: Bearer {token}
```

---

### Inventory logs

```
GET http://localhost:5000/api/inventory-logs
Authorization: Bearer {token}
```

---

### Reports

```
GET http://localhost:5000/api/reports/inventory-summary
GET http://localhost:5000/api/reports/low-stock
GET http://localhost:5000/api/reports/books-by-category
```

All require `Authorization: Bearer {token}`.

---

## Postman collection tip

Create a **Postman Environment** with variables:

| Variable | Initial value |
|----------|---------------|
| `base_url` | `http://localhost:5000/api` |
| `token` | *(leave empty — set after login)* |

Then use `{{base_url}}/books` and `Bearer {{token}}` in requests.

After login, save the token to the environment with a **Tests** script:

```javascript
const json = pm.response.json();
pm.environment.set("token", json.token);
```

---

## Alternative: Swagger UI

With the backend running, open:

```
http://localhost:5000/swagger
```

1. Expand **POST /api/auth/login** → **Try it out** → enter credentials → **Execute**.
2. Copy the `token` from the response.
3. Click **Authorize** (top right) → enter `Bearer {token}` → **Authorize**.
4. Try any endpoint from the UI.

---

## Troubleshooting

| Problem | Likely cause | Fix |
|---------|--------------|-----|
| **401 Unauthorized** | Missing or expired token | Log in again and update the Bearer token |
| **400 Bad Request** on PUT/POST | Missing fields or invalid values | Send all required fields; use valid `category_id` (1–5) and unique `isbn` |
| **404 Not Found** | Wrong ID | Use `GET /api/books` to list valid IDs |
| **409 Conflict** | Duplicate ISBN | Use a unique `isbn` when creating/updating books |
| **CORS error in browser** | Frontend not on port 5173 | Run frontend with `npm run dev` (default port 5173) |
| **Connection refused** | Backend not running | Start with `npm run dev:backend` |
| **Port already in use** | Another process on 5000 or 5173 | Stop the other process or change the port in config |

### Common 400 error on book update

If you see:

```json
{ "message": "'Category Id' must be greater than '0'." }
```

The request body is missing `category_id` or used the wrong property name. Use snake_case or camelCase as shown in the examples above.

---

## Quick reference

```bash
# Terminal 1
npm run dev:backend    # → http://localhost:5000

# Terminal 2
npm run dev            # → http://localhost:5173

# Login
admin / admin123
```

For a full endpoint list, see [api-endpoints.md](./api-endpoints.md).
