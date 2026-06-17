import { makeAutoObservable } from 'mobx'
import type { Book } from '@/models/book'

export class BookObservable {
  books: Book[] = []
  isLoading: boolean = false
  error: string | null = null

  constructor() {
    makeAutoObservable(this)
  }
}