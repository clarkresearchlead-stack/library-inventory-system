import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import store, { StoreProvider } from '@/stores/root/store'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider value={store}>
      <App />
    </StoreProvider>
  </StrictMode>
)
