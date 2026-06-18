import { runInAction } from 'mobx'
import { CategoryObservable } from './observable'
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/api/categories.api'
import type { CategoryPayload } from '@/models/category'

export class CategoryStore {
  observable: CategoryObservable

  constructor(observable: CategoryObservable) {
    this.observable = observable
  }

  async fetchCategories() {
    runInAction(() => { this.observable.isLoading = true })
    try {
      const data = await getCategories()
      runInAction(() => { this.observable.categories = data })
    } catch {
      runInAction(() => { this.observable.error = 'Failed to fetch categories' })
    } finally {
      runInAction(() => { this.observable.isLoading = false })
    }
  }

  async createCategory(payload: CategoryPayload) {
    const data = await createCategory(payload)
    runInAction(() => { this.observable.categories.unshift(data) })
  }

  async updateCategory(id: number, payload: CategoryPayload) {
    const data = await updateCategory(id, payload)
    runInAction(() => {
      const index = this.observable.categories.findIndex((c) => c.id === id)
      if (index !== -1) this.observable.categories[index] = data
    })
  }

  async deleteCategory(id: number) {
    await deleteCategory(id)
    runInAction(() => {
      this.observable.categories = this.observable.categories.filter((c) => c.id !== id)
    })
  }
}