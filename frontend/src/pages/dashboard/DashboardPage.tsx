import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/stores/root/store'
import { BookOpen, Library, Copy } from 'lucide-react'
import { SummaryCard } from '@/shared/components/ui/summary-card'
import { LowStockCard } from '@/features/dashboard/components/LowStockCard'
import { RecentActivity } from '@/features/dashboard/components/RecentActivity'
import { CategoryProgress } from '@/features/dashboard/components/CategoryProgress'
import { InventoryChart } from '@/features/dashboard/components/InventoryChart'
import PageLoader from '@/shared/components/ui/page-loader'

const LOW_STOCK_THRESHOLD = 5

function formatTimeAgo(dateString: string) {
  const diffMs = Date.now() - new Date(dateString).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const DashboardPage = observer(() => {
  const { bookStore, categoryStore, inventoryStore } = useStore()

  useEffect(() => {
    bookStore.fetchBooks()
    categoryStore.fetchCategories()
    inventoryStore.fetchLogs()
  }, [])

  if (bookStore.observable.isLoading) return <PageLoader />

  const books = bookStore.observable.books
  const categories = categoryStore.observable.categories
  const logs = inventoryStore.observable.logs

  const totalCopies = books.reduce((sum, b) => sum + b.quantity, 0)

  const lowStockBooks = books
    .filter((b) => b.quantity < LOW_STOCK_THRESHOLD)
    .map((b) => ({
      id: b.id,
      title: b.title,
      currentStock: b.quantity,
      minimumStock: LOW_STOCK_THRESHOLD,
    }))

  const categoryData = categories.map((cat) => ({
    name: cat.name,
    count: books.filter((b) => b.category_id === cat.id).length,
  }))

  const outOfStock = books.filter((b) => b.quantity === 0).length
  const lowStock = books.filter((b) => b.quantity > 0 && b.quantity < LOW_STOCK_THRESHOLD).length
  const wellStocked = books.length - outOfStock - lowStock
  const totalBooksCount = books.length || 1

  const inventoryStatus = [
    {
      status: 'Well Stocked',
      count: wellStocked,
      percentage: Math.round((wellStocked / totalBooksCount) * 100),
      color: '#44443f',
    },
    {
      status: 'Low Stock',
      count: lowStock,
      percentage: Math.round((lowStock / totalBooksCount) * 100),
      color: '#d6a647',
    },
    {
      status: 'Out of Stock',
      count: outOfStock,
      percentage: Math.round((outOfStock / totalBooksCount) * 100),
      color: '#c45c4a',
    },
  ]

  const recentActivities = [...logs]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
    .map((log) => ({
      id: log.id,
      type: log.transaction_type === 'stock_in' ? ('in' as const) : ('out' as const),
      bookTitle: log.book_title ?? 'Unknown book',
      quantity: log.quantity,
      timestamp: formatTimeAgo(log.created_at),
    }))

  const avgBooksPerCategory = categories.length > 0 ? Math.round(books.length / categories.length) : 0

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-serif text-stone-900">Library Inventory</h1>
        <p className="text-stone-500">Monitor and manage your library collection</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <SummaryCard title="Total Books" value={books.length} icon={BookOpen} description="Unique titles in collection" />
        <SummaryCard title="Total Categories" value={categories.length} icon={Library} description="Different categories" />
        <SummaryCard title="Total Copies" value={totalCopies} icon={Copy} description="Physical copies available" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <LowStockCard books={lowStockBooks} />
        </div>

        <div className="rounded-lg border border-stone-200 bg-white p-6 transition-colors hover:border-stone-300 lg:col-span-1">
          <h3 className="mb-6 text-lg font-semibold text-stone-900">Books Per Category</h3>
          <CategoryProgress categories={categoryData} />
        </div>

        <div className="lg:col-span-1">
          <InventoryChart statuses={inventoryStatus} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivity activities={recentActivities} />

        <div className="rounded-lg border border-stone-200 bg-white p-6 transition-colors hover:border-stone-300">
          <h3 className="mb-6 text-lg font-semibold text-stone-900">Collection Insights</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-stone-50 p-4">
              <span className="font-medium text-stone-900">Average Books per Category</span>
              <span className="text-2xl font-semibold text-stone-900">{avgBooksPerCategory}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-stone-50 p-4">
              <span className="font-medium text-stone-900">Total Stock Transactions</span>
              <span className="text-2xl font-semibold text-stone-900">{logs.length}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-stone-50 p-4">
              <span className="font-medium text-stone-900">Items Needing Attention</span>
              <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                {lowStockBooks.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default DashboardPage