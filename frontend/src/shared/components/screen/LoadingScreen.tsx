import { Skeleton } from '@/shared/components/ui/skeleton'

export const TableSkeleton = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[60px] ml-auto" />
        </div>
      ))}
    </div>
  )
}

export const CardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-lg border p-6 space-y-3">
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-8 w-[60px]" />
          <Skeleton className="h-3 w-[140px]" />
        </div>
      ))}
    </div>
  )
}

export const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mx-auto" />
        <p className="text-stone-500 text-sm">Loading...</p>
      </div>
    </div>
  )
}