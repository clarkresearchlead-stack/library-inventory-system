import { makeAutoObservable } from 'mobx'
import type { InventoryLog } from '@/models/inventory'

export class InventoryObservable {
  logs: InventoryLog[] = []
  isLoading: boolean = false
  error: string | null = null

  constructor() {
    makeAutoObservable(this)
  }
}