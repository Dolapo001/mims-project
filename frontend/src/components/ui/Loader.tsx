import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function Loader({ className, text = "Loading..." }: { className?: string, text?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 p-12", className)}>
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{text}</span>
    </div>
  )
}
