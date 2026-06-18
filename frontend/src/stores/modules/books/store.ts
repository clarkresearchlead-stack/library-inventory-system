import { runInAction } from 'mobx'
import { BookObservable } from './observable'
import { getBooks, createBook, updateBook, deleteBook } from '@/api/books.api'
import type { BookPayload } from '@/models/book'

export class BookStore {
  observable: BookObservable

  constructor(observable: BookObservable) {
    this.observable = observable
  }

  async fetchBooks() {
    runInAction(() => { this.observable.isLoading = true })
    try {
      const data = await getBooks()
      runInAction(() => { this.observable.books = data })
    } catch {
      runInAction(() => { this.observable.error = 'Failed to fetch books' })
    } finally {
      runInAction(() => { this.observable.isLoading = false })
    }
  }

  async createBook(payload: BookPayload) {
    const data = await createBook(payload)
    runInAction(() => { this.observable.books.unshift(data) })
  }

  async updateBook(id: number, payload: BookPayload) {
    const data = await updateBook(id, payload)
    runInAction(() => {
      const index = this.observable.books.findIndex((b) => b.id === id)
      if (index !== -1) this.observable.books[index] = data
    })
  }

  async deleteBook(id: number) {
    await deleteBook(id)
    runInAction(() => {
      this.observable.books = this.observable.books.filter((b) => b.id !== id)
    })
  }

  adjustBookQuantity(id: number, delta: number) {
    runInAction(() => {
      const index = this.observable.books.findIndex((b) => b.id === id)
      if (index === -1) return

      const book = this.observable.books[index]
      this.observable.books[index] = {
        ...book,
        quantity: Math.max(0, book.quantity + delta),
      }
    })
  }
}