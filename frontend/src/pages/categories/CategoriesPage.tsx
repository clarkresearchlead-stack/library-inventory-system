import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/stores/root/store'
import { CategoriesTable } from '@/features/categories'
import PageLoader from '@/shared/components/ui/page-loader'

const CategoriesPage = observer(() => {
  const { categoryStore } = useStore()

  useEffect(() => {
    categoryStore.fetchCategories()
  }, [categoryStore])

  if (categoryStore.observable.isLoading) return <PageLoader />

  return <CategoriesTable />
})

export default CategoriesPage
