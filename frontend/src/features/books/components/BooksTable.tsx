import { useMemo, useState } from 'react'
import { Plus, Search, Pencil, Trash2, BookOpen } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Label } from '@/shared/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { toast } from 'sonner'
import { useStore } from '@/stores/root/store'
import { observer } from 'mobx-react-lite'
import { getApiErrorMessage } from '@/shared/utils/api-error'
import type { Book, BookPayload } from '@/models/book'
import type { Category } from '@/models/category'

const DEFAULT_FORM_STATE: BookPayload = {
  title: '',
  author: '',
  category_id: 1,
  genre: '',
  isbn: '',
  publication_year: new Date().getFullYear(),
  quantity: 1,
}

type BookFormFieldsProps = {
  idPrefix: string
  formData: BookPayload
  categories: Category[]
  autoFocus?: boolean
  isbnError?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

function BookFormFields({ idPrefix, formData, categories, autoFocus, isbnError, onChange }: BookFormFieldsProps) {
  const fieldId = (name: string) => `${idPrefix}-${name}`

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor={fieldId('title')}>Title</Label>
        <Input
          id={fieldId('title')}
          name="title"
          value={formData.title}
          onChange={onChange}
          placeholder="e.g. The Great Gatsby"
          autoFocus={autoFocus}
          autoComplete="off"
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor={fieldId('author')}>Author</Label>
        <Input
          id={fieldId('author')}
          name="author"
          value={formData.author}
          onChange={onChange}
          placeholder="e.g. F. Scott Fitzgerald"
          autoComplete="off"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={fieldId('category_id')}>Category</Label>
        <select
          id={fieldId('category_id')}
          name="category_id"
          value={formData.category_id}
          onChange={onChange}
          className="flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 transition-colors"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor={fieldId('genre')}>Genre</Label>
        <Input
          id={fieldId('genre')}
          name="genre"
          value={formData.genre}
          onChange={onChange}
          placeholder="e.g. Classic"
          autoComplete="off"
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor={fieldId('isbn')}>ISBN</Label>
        <Input
          id={fieldId('isbn')}
          name="isbn"
          value={formData.isbn}
          onChange={onChange}
          placeholder="e.g. 978-0743273565"
          autoComplete="off"
          className={isbnError ? 'border-red-500 focus-visible:ring-red-500' : ''}
        />
        {isbnError && (
          <p className="text-sm text-red-500 font-medium">{isbnError}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor={fieldId('publication_year')}>Publication Year</Label>
        <Input
          id={fieldId('publication_year')}
          name="publication_year"
          type="number"
          value={formData.publication_year}
          onChange={onChange}
          placeholder="e.g. 1925"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={fieldId('quantity')}>Quantity</Label>
        <Input
          id={fieldId('quantity')}
          name="quantity"
          type="number"
          min="0"
          value={formData.quantity}
          onChange={onChange}
          placeholder="e.g. 3"
        />
      </div>
    </div>
  )
}

const BooksTable = observer(() => {
  const { bookStore, categoryStore } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [currentBook, setCurrentBook] = useState<Book | null>(null)
  const [formData, setFormData] = useState(DEFAULT_FORM_STATE)
  const [isSaving, setIsSaving] = useState(false)

  const normalizedIsbn = formData.isbn.trim()
  const isbnConflict = normalizedIsbn
    ? bookStore.observable.books.some(
        (book) => book.isbn === normalizedIsbn && book.id !== currentBook?.id
      )
    : false
  const isbnError = isbnConflict ? 'A book with this ISBN already exists.' : undefined

  const filteredBooks = useMemo(() => {
    const books = bookStore.observable.books
    if (!searchQuery.trim()) return books
    const query = searchQuery.toLowerCase()
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.isbn.includes(query)
    )
  }, [bookStore.observable.books, searchQuery])

  const handleOpenAdd = () => {
    setFormData(DEFAULT_FORM_STATE)
    setIsAddOpen(true)
  }

  const handleOpenEdit = (book: Book) => {
    setCurrentBook(book)
    setFormData({
      title: book.title,
      author: book.author,
      category_id: book.category_id,
      genre: book.genre,
      isbn: book.isbn,
      publication_year: book.publication_year,
      quantity: book.quantity,
    })
    setIsEditOpen(true)
  }

  const handleOpenDelete = (book: Book) => {
    setCurrentBook(book)
    setIsDeleteOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'publication_year' || name === 'quantity' || name === 'category_id'
        ? parseInt(value) || 0
        : value,
    }))
  }

  const isFormValid =
    formData.title.trim() &&
    formData.author.trim() &&
    formData.genre.trim() &&
    formData.isbn.trim() &&
    formData.publication_year > 0 &&
    formData.quantity >= 0 &&
    !isbnConflict

  const handleSaveAdd = async () => {
    if (!isFormValid || isSaving) return
    setIsSaving(true)
    try {
      await bookStore.createBook(formData)
      toast.success('Book added successfully!')
      setIsAddOpen(false)
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to add book'))
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveEdit = async () => {
    if (!isFormValid || !currentBook || isSaving) return
    setIsSaving(true)
    try {
      await bookStore.updateBook(currentBook.id, formData)
      toast.success('Book updated successfully!')
      setIsEditOpen(false)
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to update book'))
    } finally {
      setIsSaving(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!currentBook || isSaving) return
    setIsSaving(true)
    try {
      await bookStore.deleteBook(currentBook.id)
      toast.success('Book deleted successfully!')
      setIsDeleteOpen(false)
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to delete book'))
    } finally {
      setIsSaving(false)
    }
  }

  const categories = categoryStore.observable.categories

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-stone-900">Books</h1>
          <p className="text-stone-500 mt-1">Manage the library book inventory</p>
        </div>
        <Button onClick={handleOpenAdd} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Book
        </Button>
      </div>

      {/* Table Card */}
      <Card className="border-stone-200 shadow-sm">
        <CardContent className="p-0">
          <div className="p-4 border-b border-stone-200">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <Input
                placeholder="Search by title, author, or ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {bookStore.observable.books.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="bg-stone-100 p-4 rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-stone-400" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-1">No books yet</h3>
              <p className="text-stone-500 mb-6 max-w-sm">Get started by adding your first book.</p>
              <Button onClick={handleOpenAdd}>
                <Plus className="mr-2 h-4 w-4" />
                Add Book
              </Button>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="bg-stone-100 p-4 rounded-full mb-4">
                <Search className="h-8 w-8 text-stone-400" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-1">No results found</h3>
              <p className="text-stone-500 max-w-sm">No books match "{searchQuery}".</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead className="text-right">Year</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBooks.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-medium text-stone-500 text-xs">{book.id}</TableCell>
                    <TableCell className="font-semibold text-stone-900">{book.title}</TableCell>
                    <TableCell className="text-stone-600">{book.author}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-800">
                        {book.category?.name || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell className="text-stone-500">{book.genre}</TableCell>
                    <TableCell className="text-stone-500 text-sm font-mono">{book.isbn}</TableCell>
                    <TableCell className="text-right text-stone-500">{book.publication_year}</TableCell>
                    <TableCell className="text-right font-medium">{book.quantity}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(book)} className="h-8 w-8">
                          <Pencil className="h-4 w-4 text-stone-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDelete(book)}
                          className="h-8 w-8 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 text-stone-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Book</DialogTitle>
            <DialogDescription>Add a new book to the library inventory.</DialogDescription>
          </DialogHeader>
          <BookFormFields
            idPrefix="add-book"
            formData={formData}
            categories={categories}
            autoFocus
            isbnError={isbnError}
            onChange={handleInputChange}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)} disabled={isSaving}>Cancel</Button>
            <Button onClick={handleSaveAdd} disabled={!isFormValid || isSaving}>
              {isSaving ? 'Saving...' : 'Save Book'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
            <DialogDescription>Update the details for this book.</DialogDescription>
          </DialogHeader>
          <BookFormFields
            idPrefix="edit-book"
            formData={formData}
            categories={categories}
            isbnError={isbnError}
            onChange={handleInputChange}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={isSaving}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={!isFormValid || isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Book</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{currentBook?.title}" by {currentBook?.author}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Delete Book</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
})

export default BooksTable