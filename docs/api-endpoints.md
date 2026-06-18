# API Endpoints

Base URL: `http://localhost:5000/api/`

Auth header for protected routes: `Authorization: Bearer {token}`

## Auth

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/auth/login` | No | Login with username/password |

## Books

| Method | Route | Auth |
|--------|-------|------|
| GET | `/books` | Yes |
| GET | `/books/{id}` | Yes |
| GET | `/books/low-stock` | Yes |
| POST | `/books` | Yes |
| PUT | `/books/{id}` | Yes |
| DELETE | `/books/{id}` | Yes |
| PATCH | `/books/{id}/stock-in` | Yes |
| PATCH | `/books/{id}/stock-out` | Yes |

## Categories

| Method | Route | Auth |
|--------|-------|------|
| GET | `/categories` | Yes |
| GET | `/categories/{id}` | Yes |
| POST | `/categories` | Yes |
| PUT | `/categories/{id}` | Yes |
| DELETE | `/categories/{id}` | Yes |

## Inventory Logs

| Method | Route | Auth |
|--------|-------|------|
| GET | `/inventory-logs` | Yes |

## Reports

| Method | Route | Auth |
|--------|-------|------|
| GET | `/reports/inventory-summary` | Yes |
| GET | `/reports/low-stock` | Yes |
| GET | `/reports/books-by-category` | Yes |

## Default credentials

- Username: `admin`
- Password: `admin123`

Interactive docs: http://localhost:5000/swagger
