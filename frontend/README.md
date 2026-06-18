# Frontend — Library Inventory

React + TypeScript + Vite admin dashboard for the Library Inventory System.

## Scripts

```bash
npm install
npm run dev       # http://localhost:5173
npm run build
npm run preview
npm run lint
```

From repo root: `npm run dev` (delegates here).

## Environment

Optional `.env` in `frontend/`:

```env
VITE_API_URL=http://localhost:5000/api/
```

## Folder Structure

```
frontend/src/
├── app/                 # App shell
│   ├── routes/          # AppRoutes.tsx — all React Router routes
│   └── providers/       # StoreProvider re-export
├── pages/               # Thin route pages (data fetching only)
│   ├── auth/
│   ├── dashboard/
│   ├── books/
│   ├── categories/
│   ├── inventory/
│   └── reports/
├── features/            # Feature modules (UI + domain components)
│   ├── auth/
│   ├── books/
│   ├── categories/
│   ├── inventory/
│   ├── reports/
│   └── dashboard/
├── layout/              # DashboardLayout, AdminSidebar
├── shared/              # Reusable code
│   ├── components/ui/   # shadcn/ui primitives
│   ├── components/screen/
│   ├── utils/           # http, storage, request-guard
│   └── lib/
├── api/                 # HTTP API clients (*.api.ts)
├── models/              # TypeScript interfaces
└── stores/              # MobX state
    ├── root/            # RootStore + context
    └── modules/         # account, books, categories, inventory
```

## Import aliases

`@/*` maps to `frontend/src/*`

Example:
```ts
import { BooksTable } from '@/features/books'
import { useStore } from '@/stores/root/store'
import { getBooks } from '@/api/books.api'
```
