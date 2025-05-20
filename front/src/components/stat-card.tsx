import { cn } from "@/lib/utils"

interface StatCardProps {
  value: string
  label: string
  className?: string
}

export function StatCard({ value, label, className }: StatCardProps) {
  return (
    <div
      className={cn("flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm", className)}
    >
      <div className="text-3xl font-bold">{value}</div>
      <div className="mt-2 text-sm text-gray-500">{label}</div>
    </div>
  )
}
