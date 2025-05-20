import { Quote } from "lucide-react"
import { cn } from "@/lib/utils"

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  className?: string
}

export function TestimonialCard({ quote, author, role, className }: TestimonialCardProps) {
  return (
    <div className={cn("relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm", className)}>
      <Quote className="mb-4 h-6 w-6 text-gray-300" />
      <p className="mb-6 text-gray-700">{quote}</p>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gray-100"></div>
        <div>
          <div className="font-medium">{author}</div>
          <div className="text-sm text-gray-500">{role}</div>
        </div>
      </div>
    </div>
  )
}
