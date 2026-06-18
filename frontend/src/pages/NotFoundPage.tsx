import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-stone-50">
      <div className="text-center space-y-4">
        <h1 className="text-8xl font-bold font-serif text-stone-900">404</h1>
        <h2 className="text-2xl font-semibold text-stone-700">Page Not Found</h2>
        <p className="text-stone-500 max-w-sm">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  )
}

export default NotFoundPage
