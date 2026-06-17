import { AccountObservable } from '@/stores/data/account/observable'
import { AccountStore } from '@/stores/data/account/store'
import { CategoryObservable } from '@/stores/data/categories/observable'
import { CategoryStore } from '@/stores/data/categories/store'
import { BookObservable } from '@/stores/data/books/observable'
import { BookStore } from '@/stores/data/books/store'
import { InventoryObservable } from '@/stores/data/inventory/observable'
import { InventoryStore } from '@/stores/data/inventory/store'

export class RootStore {
  accountObservable: AccountObservable
  accountStore: AccountStore
  categoryObservable: CategoryObservable
  categoryStore: CategoryStore
  bookObservable: BookObservable
  bookStore: BookStore
  inventoryObservable: InventoryObservable
  inventoryStore: InventoryStore

  constructor() {
    this.accountObservable = new AccountObservable()
    this.accountStore = new AccountStore(this.accountObservable)
    this.accountStore.loadFromStorage()
    this.categoryObservable = new CategoryObservable()
    this.categoryStore = new CategoryStore(this.categoryObservable)
    this.bookObservable = new BookObservable()
    this.bookStore = new BookStore(this.bookObservable)
    this.inventoryObservable = new InventoryObservable()
    this.inventoryStore = new InventoryStore(this.inventoryObservable)
  }
}