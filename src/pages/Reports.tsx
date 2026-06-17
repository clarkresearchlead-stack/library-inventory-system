import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/stores/common/store'
import ReportsContent from '@/components/reports/ReportsContent'
import PageLoader from '@/components/ui/page-loader'

const Reports = observer(() => {
  const { bookStore, categoryStore, inventoryStore } = useStore()

  useEffect(() => {
    bookStore.fetchBooks()
    categoryStore.fetchCategories()
    inventoryStore.fetchLogs()
  }, [])

  if (bookStore.observable.isLoading) return <PageLoader />

  return <ReportsContent />
})

export default Reports