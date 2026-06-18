import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Eye, EyeOff, Loader2, Library } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Button } from '@/shared/components/ui/button'
import { useStore } from '@/stores/root/store'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { observer } from 'mobx-react-lite'

const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export const LoginForm = observer(function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const { accountStore } = useStore()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await accountStore.login(data)
      toast.success('Signed in successfully!')
      navigate('/dashboard', { replace: true })
    } catch {
      toast.error(accountStore.observable.error || 'Invalid username or password')
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-stone-50 p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <Card className="border-stone-200 shadow-md">
          <CardHeader className="space-y-3 text-center pb-8">
            <div className="mx-auto bg-stone-100 p-3 rounded-full w-fit mb-2">
              <Library className="w-8 h-8 text-stone-900" />
            </div>
            <CardTitle className="font-serif text-2xl font-bold text-stone-900">
              Library Inventory
            </CardTitle>
            <CardDescription className="text-stone-500 text-base">
              Sign in to manage the collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-stone-700">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  className={errors.username ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  disabled={isSubmitting || accountStore.observable.isLoading}
                  {...register('username')}
                />
                {errors.username && (
                  <p className="text-sm text-red-500 font-medium">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-stone-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className={`pr-10 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    disabled={isSubmitting || accountStore.observable.isLoading}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    disabled={isSubmitting || accountStore.observable.isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 font-medium">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {accountStore.observable.error && (
                <p className="text-sm text-red-500 font-medium text-center">
                  {accountStore.observable.error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full mt-6 h-11 text-base font-medium"
                disabled={isSubmitting || accountStore.observable.isLoading}
              >
                {isSubmitting || accountStore.observable.isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
})
