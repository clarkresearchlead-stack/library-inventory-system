import { AlertCircle } from 'lucide-react'

interface LowStockBook {
  id: number
  title: string
  currentStock: number
  minimumStock: number
}

interface LowStockCardProps {
  books: LowStockBook[]
}

export function LowStockCard({ books }: LowStockCardProps) {
  return (
    <div className="rounded-lg border-2 border-amber-300 bg-amber-50 p-6 transition-colors hover:border-amber-400">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-200/60">
          <AlertCircle className="h-5 w-5 text-amber-600" />
        </div>
        <h3 className="text-lg font-semibold text-stone-900">Low Stock Books</h3>
      </div>
      <div className="space-y-3">
        {books.length === 0 ? (
          <p className="text-sm text-stone-500">All books are well stocked</p>
        ) : (
          books.map((book) => (
            <div key={book.id} className="flex items-start justify-between gap-4 rounded bg-white/60 p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-stone-900">{book.title}</p>
                <p className="text-xs text-stone-500">
                  Stock: {book.currentStock} (Minimum: {book.minimumStock})
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-amber-200 px-3 py-1 text-xs font-semibold text-amber-800">
                -{book.minimumStock - book.currentStock}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}