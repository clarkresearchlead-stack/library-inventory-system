import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { ArrowDownToLine, ArrowUpFromLine, ClipboardList, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useStore } from '@/stores/common/store'
import { observer } from 'mobx-react-lite'
import type { TransactionType } from '@/models/inventory'

const LOW_STOCK_THRESHOLD = 5

const selectClasses = 'flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 transition-colors'

const InventoryTable = observer(() => {
  const { inventoryStore, bookStore } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<TransactionType>('stock_in')
  const [formBookId, setFormBookId] = useState('')
  const [formQuantity, setFormQuantity] = useState('')
  const [formRemarks, setFormRemarks] = useState('')

  const lowStockBooks = useMemo(
    () => bookStore.observable.books.filter((b) => b.quantity <= LOW_STOCK_THRESHOLD),
    [bookStore.observable.books]
  )

  const sortedLogs = useMemo(
    () => [...inventoryStore.observable.logs].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ),
    [inventoryStore.observable.logs]
  )

  const handleOpenModal = (type: TransactionType) => {
    setModalType(type)
    setFormBookId(String(bookStore.observable.books[0]?.id ?? ''))
    setFormQuantity('')
    setFormRemarks('')
    setIsModalOpen(true)
  }

  const parsedQuantity = parseInt(formQuantity, 10)
  const selectedBook = bookStore.observable.books.find((b) => String(b.id) === formBookId)

  const isFormValid =
    !!formBookId &&
    !isNaN(parsedQuantity) &&
    parsedQuantity > 0 &&
    (modalType === 'stock_in' ||
      (selectedBook ? parsedQuantity <= selectedBook.quantity : false))

  const handleSave = async () => {
    if (!isFormValid || !selectedBook) return
    try {
      const payload = { quantity: parsedQuantity, remarks: formRemarks.trim() || '—' }
      if (modalType === 'stock_in') {
        await inventoryStore.stockIn(selectedBook.id, payload)
        toast.success('Stock in recorded successfully!')
      } else {
        await inventoryStore.stockOut(selectedBook.id, payload)
        toast.success('Stock out recorded successfully!')
      }
      setIsModalOpen(false)
    } catch {
      toast.error('Failed to record transaction')
    }
  }

  const isStockIn = modalType === 'stock_in'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-stone-900">Inventory</h1>
          <p className="text-stone-500 mt-1">Track stock movements across the collection</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={() => handleOpenModal('stock_in')}>
            <ArrowDownToLine className="mr-2 h-4 w-4" />
            Stock In
          </Button>
          <Button variant="outline" onClick={() => handleOpenModal('stock_out')}>
            <ArrowUpFromLine className="mr-2 h-4 w-4" />
            Stock Out
          </Button>
        </div>
      </div>

      {/* Low Stock Section */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-semibold font-serif text-stone-900">Low Stock</h2>
          <span className="text-sm text-stone-500">(quantity ≤ {LOW_STOCK_THRESHOLD})</span>
        </div>
        {lowStockBooks.length === 0 ? (
          <Card className="border-stone-200 shadow-sm">
            <CardContent className="py-8 text-center text-stone-500">
              All books are well stocked.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockBooks.map((book) => (
              <Card key={book.id} className="border-stone-200 shadow-sm border-l-4 border-l-amber-400">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-semibold text-stone-900 truncate">{book.title}</p>
                    <p className="text-sm text-stone-500">In stock</p>
                  </div>
                  <span className={
                    'ml-3 shrink-0 inline-flex items-center justify-center rounded-full h-10 w-10 text-sm font-bold ' +
                    (book.quantity === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700')
                  }>
                    {book.quantity}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Inventory Logs */}
      <section>
        <h2 className="text-lg font-semibold font-serif text-stone-900 mb-3">Transaction Logs</h2>
        <Card className="border-stone-200 shadow-sm">
          <CardContent className="p-0">
            {sortedLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="bg-stone-100 p-4 rounded-full mb-4">
                  <ClipboardList className="h-8 w-8 text-stone-400" />
                </div>
                <h3 className="text-lg font-semibold text-stone-900 mb-1">No inventory logs yet</h3>
                <p className="text-stone-500 mb-6 max-w-sm">Record a stock-in or stock-out transaction to start tracking.</p>
                <Button onClick={() => handleOpenModal('stock_in')}>
                  <ArrowDownToLine className="mr-2 h-4 w-4" />
                  Stock In
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Book Title</TableHead>
                    <TableHead>Transaction</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium text-stone-500 text-xs">{log.id}</TableCell>
                      <TableCell className="font-semibold text-stone-900">{log.book_title}</TableCell>
                      <TableCell>
                        <span className={
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ' +
                          (log.transaction_type === 'stock_in' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')
                        }>
                          {log.transaction_type === 'stock_in' ? 'Stock In' : 'Stock Out'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium text-stone-900">
                        {log.transaction_type === 'stock_in' ? '+' : '−'}{log.quantity}
                      </TableCell>
                      <TableCell className="text-stone-500 max-w-[220px] truncate">{log.remarks}</TableCell>
                      <TableCell className="text-stone-500">
                        {format(new Date(log.created_at), 'MMM d, yyyy')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Stock In/Out Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isStockIn ? 'Stock In' : 'Stock Out'}</DialogTitle>
            <DialogDescription>
              {isStockIn ? "Add units to a book's inventory." : "Remove units from a book's inventory."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="book">Book</Label>
              <select
                id="book"
                value={formBookId}
                onChange={(e) => setFormBookId(e.target.value)}
                className={selectClasses}
              >
                {bookStore.observable.books.map((book) => (
                  <option key={book.id} value={String(book.id)}>
                    {book.title} (in stock: {book.quantity})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formQuantity}
                onChange={(e) => setFormQuantity(e.target.value)}
                placeholder="e.g. 5"
              />
              {!isStockIn && selectedBook && parsedQuantity > selectedBook.quantity && (
                <p className="text-sm text-red-500 font-medium">
                  Cannot remove more than {selectedBook.quantity} in stock.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Input
                id="remarks"
                value={formRemarks}
                onChange={(e) => setFormRemarks(e.target.value)}
                placeholder="Optional notes about this transaction"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!isFormValid}>
              {isStockIn ? 'Confirm Stock In' : 'Confirm Stock Out'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
})

export default InventoryTable