import axios from 'axios'
import STORAGE_NAMES from './storage'
import { dispatchAuthSessionExpired } from './auth-events'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
})

function isLoginRequest(url?: string) {
  return url?.includes('/auth/login') ?? false
}

http.interceptors.request.use((config) => {
  if (!isLoginRequest(config.url)) {
    const token = localStorage.getItem(STORAGE_NAMES.TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url as string | undefined

    if (error.response?.status === 401 && !isLoginRequest(requestUrl)) {
      localStorage.removeItem(STORAGE_NAMES.TOKEN)
      localStorage.removeItem(STORAGE_NAMES.USER)
      dispatchAuthSessionExpired()

      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default http
