import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/stores/common/store'
import CategoriesTable from '@/components/categories/CategoriesTable'
import PageLoader from '@/components/ui/page-loader'

const Categories = observer(() => {
  const { categoryStore } = useStore()

  useEffect(() => {
    categoryStore.fetchCategories()
  }, [])

  if (categoryStore.observable.isLoading) return <PageLoader />

  return <CategoriesTable />
})

export default Categories