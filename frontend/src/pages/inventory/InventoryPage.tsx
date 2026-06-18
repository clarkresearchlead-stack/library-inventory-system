import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/stores/root/store'
import { InventoryTable } from '@/features/inventory'
import PageLoader from '@/shared/components/ui/page-loader'

const InventoryPage = observer(() => {
  const { inventoryStore, bookStore } = useStore()

  useEffect(() => {
    inventoryStore.fetchLogs()
    bookStore.fetchBooks()
  }, [inventoryStore, bookStore])

  if (inventoryStore.observable.isLoading) return <PageLoader />

  return <InventoryTable />
})

export default InventoryPage
