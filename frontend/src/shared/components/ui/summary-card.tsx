import type { LucideIcon } from 'lucide-react'

interface SummaryCardProps {
  title: string
  value: string | number
  icon?: LucideIcon
  description?: string
  variant?: 'default' | 'warning'
}

export function SummaryCard({ title, value, icon: Icon, description, variant = 'default' }: SummaryCardProps) {
  const isWarning = variant === 'warning'
  return (
    <div
      className={`relative flex flex-col justify-between rounded-lg border p-6 transition-colors ${
        isWarning
          ? 'border-amber-300 bg-amber-50 hover:border-amber-400'
          : 'border-stone-200 bg-white hover:border-stone-300'
      }`}
    >
      {Icon && (
        <div className="absolute right-6 top-6">
          <Icon className={`h-5 w-5 ${isWarning ? 'text-amber-500' : 'text-stone-400'}`} />
        </div>
      )}
      <div className="space-y-1">
        <p className={`text-sm font-medium ${isWarning ? 'text-amber-700' : 'text-stone-500'}`}>{title}</p>
        <p className={`text-3xl font-semibold ${isWarning ? 'text-amber-900' : 'text-stone-900'}`}>{value}</p>
      </div>
      {description && (
        <p className={`mt-4 text-xs ${isWarning ? 'text-amber-700' : 'text-stone-500'}`}>{description}</p>
      )}
    </div>
  )
}