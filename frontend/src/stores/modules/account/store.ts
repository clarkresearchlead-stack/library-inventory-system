import { runInAction } from 'mobx'
import { AccountObservable } from './observable'
import { LoginCredentials } from '@/models/user'
import { login } from '@/api/auth.api'
import STORAGE_NAMES from '@/shared/utils/storage'
import axios from 'axios'

export class AccountStore {
  observable: AccountObservable

  constructor(observable: AccountObservable) {
    this.observable = observable
  }

  clearAuth() {
    runInAction(() => {
      this.observable.token = null
      this.observable.user = null
    })
    localStorage.removeItem(STORAGE_NAMES.TOKEN)
    localStorage.removeItem(STORAGE_NAMES.USER)
  }

  async login(credentials: LoginCredentials) {
    runInAction(() => {
      this.observable.isLoading = true
      this.observable.error = null
    })

    try {
      const response = await login(credentials)
      runInAction(() => {
        this.observable.token = response.token
        this.observable.user = response.user
      })
      localStorage.setItem(STORAGE_NAMES.TOKEN, response.token)
      localStorage.setItem(STORAGE_NAMES.USER, JSON.stringify(response.user))
    } catch (error: unknown) {
      this.clearAuth()
      runInAction(() => {
        if (axios.isAxiosError(error)) {
          this.observable.error = error.response?.data?.message || 'Login failed'
        } else {
          this.observable.error = 'Login failed'
        }
      })
      throw error
    } finally {
      runInAction(() => {
        this.observable.isLoading = false
      })
    }
  }

  logout() {
    this.clearAuth()
    runInAction(() => {
      this.observable.error = null
    })
  }

  loadFromStorage() {
    const token = localStorage.getItem(STORAGE_NAMES.TOKEN)
    const user = localStorage.getItem(STORAGE_NAMES.USER)
    if (token && user) {
      runInAction(() => {
        this.observable.token = token
        this.observable.user = JSON.parse(user)
      })
    }
  }

  get isAuthenticated() {
    return !!this.observable.token
  }
}
