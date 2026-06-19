interface InventoryStatus {
  status: string
  count: number
  percentage: number
  color: string
}

interface InventoryChartProps {
  statuses: InventoryStatus[]
}

export function InventoryChart({ statuses }: InventoryChartProps) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6 transition-colors hover:border-stone-300">
      <h3 className="mb-6 text-lg font-semibold text-stone-900">Inventory Status</h3>

      <div className="space-y-6">
        <div className="flex h-8 gap-1 overflow-hidden rounded-lg bg-stone-100">
          {statuses.map((status) => (
            <div
              key={status.status}
              className="rounded transition-all duration-300"
              style={{ backgroundColor: status.color, width: `${status.percentage}%` }}
              title={`${status.status}: ${status.count}`}
            />
          ))}
        </div>

        <div className="space-y-3">
          {statuses.map((status) => (
            <div key={status.status} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: status.color }} />
                <span className="text-sm font-medium text-stone-900">{status.status}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-stone-900">{status.count}</span>
                <span className="text-stone-500">({status.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}