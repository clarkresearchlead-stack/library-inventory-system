import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Plus, Search, Pencil, Trash2, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useStore } from '@/stores/common/store'
import { observer } from 'mobx-react-lite'
import type { Category } from '@/models/category'

const CategoriesTable = observer(() => {
  const { categoryStore } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [categoryName, setCategoryName] = useState('')

  const filteredCategories = useMemo(() => {
    const cats = categoryStore.observable.categories
    if (!searchQuery.trim()) return cats
    return cats.filter((cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [categoryStore.observable.categories, searchQuery])

  const handleOpenAdd = () => {
    setCategoryName('')
    setIsAddOpen(true)
  }

  const handleOpenEdit = (category: Category) => {
    setCurrentCategory(category)
    setCategoryName(category.name)
    setIsEditOpen(true)
  }

  const handleOpenDelete = (category: Category) => {
    setCurrentCategory(category)
    setIsDeleteOpen(true)
  }

  const handleSaveAdd = async () => {
    if (!categoryName.trim()) return
    try {
      await categoryStore.createCategory({ name: categoryName.trim() })
      toast.success('Category added successfully!')
      setIsAddOpen(false)
    } catch {
      toast.error('Failed to add category')
    }
  }

  const handleSaveEdit = async () => {
    if (!categoryName.trim() || !currentCategory) return
    try {
      await categoryStore.updateCategory(currentCategory.id, { name: categoryName.trim() })
      toast.success('Category updated successfully!')
      setIsEditOpen(false)
    } catch {
      toast.error('Failed to update category')
    }
  }

  const handleConfirmDelete = async () => {
    if (!currentCategory) return
    try {
      await categoryStore.deleteCategory(currentCategory.id)
      toast.success('Category deleted successfully!')
      setIsDeleteOpen(false)
    } catch {
      toast.error('Failed to delete category')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-stone-900">Categories</h1>
          <p className="text-stone-500 mt-1">Manage library book classifications</p>
        </div>
        <Button onClick={handleOpenAdd} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Card className="border-stone-200 shadow-sm">
        <CardContent className="p-0">
          <div className="p-4 border-b border-stone-200">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {categoryStore.observable.categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="bg-stone-100 p-4 rounded-full mb-4">
                <FolderOpen className="h-8 w-8 text-stone-400" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-1">No categories yet</h3>
              <p className="text-stone-500 mb-6 max-w-sm">Get started by creating your first category.</p>
              <Button onClick={handleOpenAdd}>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="bg-stone-100 p-4 rounded-full mb-4">
                <Search className="h-8 w-8 text-stone-400" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-1">No results found</h3>
              <p className="text-stone-500 max-w-sm">No categories match "{searchQuery}".</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium text-stone-500">{category.id}</TableCell>
                    <TableCell className="font-semibold text-stone-900">{category.name}</TableCell>
                    <TableCell className="text-stone-500">
                      {format(new Date(category.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(category)}>
                          <Pencil className="h-4 w-4 text-stone-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDelete(category)}
                          className="hover:text-red-600 hover:bg-red-50"
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

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>Create a new category for the library collection.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Label htmlFor="add-name">Name</Label>
            <Input
              id="add-name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g. Science Fiction"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveAdd} disabled={!categoryName.trim()}>Save Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update the name of this category.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g. Science Fiction"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={!categoryName.trim()}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{currentCategory?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Delete Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
})

export default CategoriesTable