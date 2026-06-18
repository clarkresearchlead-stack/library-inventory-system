import { observer } from 'mobx-react-lite'
import { useStore } from '@/stores/root/store'
import { BookOpen, Tag, Package, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

const COLORS = ['#292524', '#57534e', '#78716c', '#a8a29e', '#d6d3d1']

const DashboardContent = observer(() => {
  const { bookStore, categoryStore, inventoryStore } = useStore()

  const totalBooks = bookStore.observable.books.length
  const totalCategories = categoryStore.observable.categories.length
  const totalCopies = bookStore.observable.books.reduce((sum, b) => sum + b.quantity, 0)
  const lowStockCount = bookStore.observable.books.filter((b) => b.quantity <= 5).length

  const booksByCategory = categoryStore.observable.categories.map((cat) => ({
    name: cat.name,
    books: bookStore.observable.books.filter((b) => b.category_id === cat.id).length,
  }))

  const stockInCount = inventoryStore.observable.logs.filter(
    (l) => l.transaction_type === 'stock_in'
  ).length

  const stockOutCount = inventoryStore.observable.logs.filter(
    (l) => l.transaction_type === 'stock_out'
  ).length

  const inventoryStatusData = [
    { name: 'Stock In', value: stockInCount },
    { name: 'Stock Out', value: stockOutCount },
  ]

  const cards = [
    {
      title: 'Total Books',
      value: totalBooks,
      description: 'Unique titles in the library',
      icon: BookOpen,
    },
    {
      title: 'Total Categories',
      value: totalCategories,
      description: 'Book classifications',
      icon: Tag,
    },
    {
      title: 'Total Copies',
      value: totalCopies,
      description: 'Physical copies in stock',
      icon: Package,
    },
    {
      title: 'Low Stock Books',
      value: lowStockCount,
      description: 'Books with 5 or fewer copies',
      icon: AlertTriangle,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-serif text-stone-900">Dashboard</h1>
        <p className="text-stone-500 mt-1">Overview of the library inventory</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ title, value, description, icon: Icon }) => (
          <Card key={title} className="border-stone-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-stone-500">{title}</CardTitle>
              <Icon className="h-4 w-4 text-stone-400" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-stone-900">{value}</p>
              <p className="text-xs text-stone-500 mt-1">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Books Per Category */}
        <Card className="border-stone-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold font-serif text-stone-900">
              Books Per Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={booksByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#78716c' }} />
                <YAxis tick={{ fontSize: 12, fill: '#78716c' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e7e5e4',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="books" fill="#292524" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Inventory Status */}
        <Card className="border-stone-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold font-serif text-stone-900">
              Inventory Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={inventoryStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {inventoryStatusData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e7e5e4',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
})

export default DashboardContent