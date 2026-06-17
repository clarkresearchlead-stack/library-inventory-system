import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/stores/common/store'
import BooksTable from '@/components/books/BooksTable'
import PageLoader from '@/components/ui/page-loader'

const Books = observer(() => {
  const { bookStore, categoryStore } = useStore()

  useEffect(() => {
    bookStore.fetchBooks()
    categoryStore.fetchCategories()
  }, [])

  if (bookStore.observable.isLoading) return <PageLoader />

  return <BooksTable />
})

export default Books