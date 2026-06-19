import { ArrowUp, ArrowDown, Clock } from 'lucide-react'

interface Activity {
  id: number
  type: 'in' | 'out'
  bookTitle: string
  quantity: number
  timestamp: string
}

interface RecentActivityProps {
  activities: Activity[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6 transition-colors hover:border-stone-300">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-stone-900">Recent Activity</h3>
        <Clock className="h-5 w-5 text-stone-400" />
      </div>
      <div className="space-y-3">
        {activities.length === 0 ? (
          <p className="text-sm text-stone-500">No recent activities</p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-3 rounded-lg bg-stone-50 p-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  activity.type === 'in' ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                {activity.type === 'in' ? (
                  <ArrowUp className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-stone-900">{activity.bookTitle}</p>
                <p className="text-xs text-stone-500">{activity.timestamp}</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-stone-900/5 px-2.5 py-1 text-xs font-semibold text-stone-900">
                {activity.type === 'in' ? '+' : '-'}{activity.quantity}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}