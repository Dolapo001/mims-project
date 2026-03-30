import { cn } from "@/lib/utils"

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-slate-200 animate-pulse rounded-md", className)} />
  )
}

export function PredictionSkeleton() {
  return (
    <div className="space-y-10 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
      {/* Badge Skeleton */}
      <Skeleton className="w-40 h-6 rounded-full" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-4">
          <Skeleton className="w-24 h-3" />
          <Skeleton className="w-64 h-12" />
        </div>
        
        {/* Confidence Card Skeleton */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 min-w-[240px] space-y-4">
          <div className="flex justify-between">
            <Skeleton className="w-20 h-3" />
            <Skeleton className="w-10 h-6" />
          </div>
          <Skeleton className="w-full h-2.5 rounded-full" />
        </div>
      </div>

      {/* Rankings Skeleton */}
      <div className="pt-8 border-t border-slate-100 space-y-6">
        <Skeleton className="w-32 h-4" />
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="w-32 h-12 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
