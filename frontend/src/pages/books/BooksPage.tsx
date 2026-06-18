import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/stores/root/store'
import { BooksTable } from '@/features/books'
import PageLoader from '@/shared/components/ui/page-loader'

const BooksPage = observer(() => {
  const { bookStore, categoryStore } = useStore()

  useEffect(() => {
    bookStore.fetchBooks()
    categoryStore.fetchCategories()
  }, [bookStore, categoryStore])

  if (bookStore.observable.isLoading) return <PageLoader />

  return <BooksTable />
})

export default BooksPage
