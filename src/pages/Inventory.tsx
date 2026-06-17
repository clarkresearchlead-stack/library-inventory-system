import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/stores/common/store'
import InventoryTable from '@/components/inventory/InventoryTable'
import PageLoader from '@/components/ui/page-loader'

const Inventory = observer(() => {
  const { inventoryStore, bookStore } = useStore()

  useEffect(() => {
    inventoryStore.fetchLogs()
    bookStore.fetchBooks()
  }, [])

  if (inventoryStore.observable.isLoading) return <PageLoader />

  return <InventoryTable />
})

export default Inventory