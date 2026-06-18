import { makeAutoObservable } from 'mobx'
import type { Category } from '@/models/category'

export class CategoryObservable {
  categories: Category[] = []
  isLoading: boolean = false
  error: string | null = null

  constructor() {
    makeAutoObservable(this)
  }
}