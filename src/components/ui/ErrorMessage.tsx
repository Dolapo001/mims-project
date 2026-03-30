import { AlertCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function ErrorMessage({ message, onRetry, className }: { message: string, onRetry?: () => void, className?: string }) {
  return (
    <div className={cn("bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col items-center gap-4 text-center animate-in slide-in-from-top-2 duration-300", className)}>
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-red-900">Prediction Failed</h4>
        <p className="text-xs text-red-700 max-w-xs">{message}</p>
      </div>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="text-xs font-bold text-red-900 bg-red-100 hover:bg-red-200 px-4 py-2 rounded-xl transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
