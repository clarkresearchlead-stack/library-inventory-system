import { AccountObservable } from '@/stores/modules/account/observable'
import { AccountStore } from '@/stores/modules/account/store'
import { CategoryObservable } from '@/stores/modules/categories/observable'
import { CategoryStore } from '@/stores/modules/categories/store'
import { BookObservable } from '@/stores/modules/books/observable'
import { BookStore } from '@/stores/modules/books/store'
import { InventoryObservable } from '@/stores/modules/inventory/observable'
import { InventoryStore } from '@/stores/modules/inventory/store'
import { AUTH_SESSION_EXPIRED_EVENT } from '@/shared/utils/auth-events'

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
    this.inventoryStore = new InventoryStore(this.inventoryObservable, this.bookStore)

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, () => {
      this.accountStore.clearAuth()
    })
  }
}