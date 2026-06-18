import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { LoginForm } from '@/features/auth'
import { useStore } from '@/stores/root/store'

const LoginPage = observer(() => {
  const { accountStore } = useStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (accountStore.isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [accountStore.isAuthenticated, navigate])

  return <LoginForm />
})

export default LoginPage
