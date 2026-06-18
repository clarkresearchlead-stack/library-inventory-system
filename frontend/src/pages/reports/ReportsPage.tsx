import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/stores/root/store'
import { ReportsContent } from '@/features/reports'
import PageLoader from '@/shared/components/ui/page-loader'

const ReportsPage = observer(() => {
  const { bookStore, categoryStore, inventoryStore } = useStore()

  useEffect(() => {
    bookStore.fetchBooks()
    categoryStore.fetchCategories()
    inventoryStore.fetchLogs()
  }, [bookStore, categoryStore, inventoryStore])

  if (bookStore.observable.isLoading) return <PageLoader />

  return <ReportsContent />
})

export default ReportsPage
