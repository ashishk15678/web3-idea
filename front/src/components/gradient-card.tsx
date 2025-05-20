import { type LucideIcon, Shield, Lightbulb, RefreshCw } from "lucide-react"

import { cn } from "@/lib/utils"

interface GradientCardProps {
  title: string
  description: string
  icon: string
  className?: string
}

export function GradientCard({ title, description, icon, className }: GradientCardProps) {
  const getIcon = (): LucideIcon => {
    switch (icon) {
      case "shield":
        return Shield
      case "lightbulb":
        return Lightbulb
      case "refresh-cw":
        return RefreshCw
      default:
        return Shield
    }
  }

  const Icon = getIcon()

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md",
        className,
      )}
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(240,240,240,0.8),rgba(255,255,255,0))] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-gray-200">
        <Icon className="h-6 w-6 text-black" />
      </div>

      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
