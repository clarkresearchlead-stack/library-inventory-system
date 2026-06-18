import { runInAction } from 'mobx'
import { InventoryObservable } from './observable'
import { getInventoryLogs, stockIn, stockOut } from '@/api/inventory.api'
import type { StockPayload } from '@/models/inventory'
import type { BookStore } from '@/stores/modules/books/store'

export class InventoryStore {
  observable: InventoryObservable
  private bookStore: BookStore

  constructor(observable: InventoryObservable, bookStore: BookStore) {
    this.observable = observable
    this.bookStore = bookStore
  }

  async fetchLogs(silent = false) {
    if (!silent) {
      runInAction(() => { this.observable.isLoading = true })
    }
    try {
      const data = await getInventoryLogs()
      runInAction(() => { this.observable.logs = data })
    } catch {
      runInAction(() => { this.observable.error = 'Failed to fetch inventory logs' })
    } finally {
      if (!silent) {
        runInAction(() => { this.observable.isLoading = false })
      }
    }
  }

  async stockIn(bookId: number, payload: StockPayload) {
    await stockIn(bookId, payload)
    await this.refreshAfterStockChange(bookId, payload.quantity)
  }

  async stockOut(bookId: number, payload: StockPayload) {
    await stockOut(bookId, payload)
    await this.refreshAfterStockChange(bookId, -payload.quantity)
  }

  private async refreshAfterStockChange(bookId: number, quantityDelta: number) {
    this.bookStore.adjustBookQuantity(bookId, quantityDelta)
    await this.fetchLogs(true)
  }
}
