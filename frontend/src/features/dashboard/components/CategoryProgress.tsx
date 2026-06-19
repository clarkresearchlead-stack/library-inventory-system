interface CategoryProgressProps {
  categories: {
    name: string
    count: number
  }[]
}

export function CategoryProgress({ categories }: CategoryProgressProps) {
  const maxCount = Math.max(...categories.map((c) => c.count), 1)

  return (
    <div className="space-y-6">
      {categories.length === 0 ? (
        <p className="text-sm text-stone-500">No categories yet</p>
      ) : (
        categories.map((category) => {
          const percentage = (category.count / maxCount) * 100
          return (
            <div key={category.name}>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-stone-900">{category.name}</p>
                <span className="text-sm font-semibold text-stone-500">{category.count}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
                <div
                  className="h-full rounded-full bg-stone-900 transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}