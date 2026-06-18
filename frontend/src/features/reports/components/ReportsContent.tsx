import { useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/stores/root/store'
import { Download, BarChart2, AlertTriangle, Tag } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'

const ReportsContent = observer(() => {
  const { bookStore, categoryStore, inventoryStore } = useStore()

  // Inventory Summary
  const inventorySummary = useMemo(() => {
    return bookStore.observable.books.map((book) => {
      const bookLogs = inventoryStore.observable.logs.filter(
        (log) => log.book_id === book.id
      )
      const totalStockIn = bookLogs
        .filter((log) => log.transaction_type === 'stock_in')
        .reduce((sum, log) => sum + log.quantity, 0)
      const totalStockOut = bookLogs
        .filter((log) => log.transaction_type === 'stock_out')
        .reduce((sum, log) => sum + log.quantity, 0)
      return {
        id: book.id,
        title: book.title,
        author: book.author,
        total_stock_in: totalStockIn,
        total_stock_out: totalStockOut,
        current_quantity: book.quantity,
      }
    })
  }, [bookStore.observable.books, inventoryStore.observable.logs])

  // Low Stock
  const lowStockBooks = useMemo(() => {
    return bookStore.observable.books.filter((b) => b.quantity <= 5)
  }, [bookStore.observable.books])

  // Books by Category
  const booksByCategory = useMemo(() => {
    return categoryStore.observable.categories.map((cat) => ({
      category: cat.name,
      total_books: bookStore.observable.books.filter(
        (b) => b.category_id === cat.id
      ).length,
    }))
  }, [categoryStore.observable.categories, bookStore.observable.books])

  // Export CSV
  const exportCSV = (data: object[], filename: string) => {
    if (data.length === 0) return
    const headers = Object.keys(data[0])
    const rows = data.map((row) =>
      headers.map((h) => String((row as Record<string, unknown>)[h] ?? '')).join(',')
    )
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-serif text-stone-900">Reports</h1>
        <p className="text-stone-500 mt-1">View and export inventory reports</p>
      </div>

      {/* Inventory Summary */}
      <Card className="border-stone-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-stone-400" />
            <CardTitle className="text-base font-semibold font-serif text-stone-900">
              Inventory Summary
            </CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportCSV(inventorySummary, 'inventory-summary')}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead className="text-right">Stock In</TableHead>
                <TableHead className="text-right">Stock Out</TableHead>
                <TableHead className="text-right">Current Qty</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventorySummary.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-stone-500 py-8">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                inventorySummary.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-semibold text-stone-900">{item.title}</TableCell>
                    <TableCell className="text-stone-600">{item.author}</TableCell>
                    <TableCell className="text-right text-green-600 font-medium">
                      +{item.total_stock_in}
                    </TableCell>
                    <TableCell className="text-right text-red-600 font-medium">
                      -{item.total_stock_out}
                    </TableCell>
                    <TableCell className="text-right font-bold text-stone-900">
                      {item.current_quantity}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Low Stock Report */}
      <Card className="border-stone-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-base font-semibold font-serif text-stone-900">
              Low Stock Report
            </CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportCSV(lowStockBooks, 'low-stock-report')}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowStockBooks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-stone-500 py-8">
                    All books are well stocked
                  </TableCell>
                </TableRow>
              ) : (
                lowStockBooks.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-semibold text-stone-900">{book.title}</TableCell>
                    <TableCell className="text-stone-600">{book.author}</TableCell>
                    <TableCell className="text-stone-500">{book.genre}</TableCell>
                    <TableCell className="text-right">
                      <span className={
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ' +
                        (book.quantity === 0
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700')
                      }>
                        {book.quantity}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Books by Category */}
      <Card className="border-stone-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-stone-400" />
            <CardTitle className="text-base font-semibold font-serif text-stone-900">
              Books by Category
            </CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportCSV(booksByCategory, 'books-by-category')}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Total Books</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {booksByCategory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-stone-500 py-8">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                booksByCategory.map((item) => (
                  <TableRow key={item.category}>
                    <TableCell className="font-semibold text-stone-900">{item.category}</TableCell>
                    <TableCell className="text-right font-medium text-stone-900">
                      {item.total_books}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
})

export default ReportsContent