import { runInAction } from 'mobx'
import { InventoryObservable } from './observable'
import { getInventoryLogs, stockIn, stockOut } from '@/api/inventory.api'
import type { StockPayload } from '@/models/inventory'

export class InventoryStore {
  observable: InventoryObservable

  constructor(observable: InventoryObservable) {
    this.observable = observable
  }

  async fetchLogs() {
    runInAction(() => { this.observable.isLoading = true })
    try {
      const data = await getInventoryLogs()
      runInAction(() => { this.observable.logs = data })
    } catch {
      runInAction(() => { this.observable.error = 'Failed to fetch inventory logs' })
    } finally {
      runInAction(() => { this.observable.isLoading = false })
    }
  }

  async stockIn(bookId: number, payload: StockPayload) {
    await stockIn(bookId, payload)
    await this.fetchLogs()
  }

  async stockOut(bookId: number, payload: StockPayload) {
    await stockOut(bookId, payload)
    await this.fetchLogs()
  }
}