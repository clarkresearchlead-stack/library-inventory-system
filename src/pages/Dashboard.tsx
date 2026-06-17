import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/stores/common/store'
import DashboardContent from '@/components/dashboard/DashboardContent'
import PageLoader from '@/components/ui/page-loader'

const Dashboard = observer(() => {
  const { bookStore, categoryStore, inventoryStore } = useStore()

  useEffect(() => {
    bookStore.fetchBooks()
    categoryStore.fetchCategories()
    inventoryStore.fetchLogs()
  }, [])

  if (bookStore.observable.isLoading) return <PageLoader />

  return <DashboardContent />
})

export default Dashboard