import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const categories = [
  { id: "all", name: "All Categories" },
  { id: "technology", name: "Technology" },
  { id: "healthcare", name: "Healthcare" },
  { id: "environment", name: "Environment" },
  { id: "finance", name: "Finance" },
  { id: "education", name: "Education" },
  { id: "entertainment", name: "Entertainment" },
  { id: "aerospace", name: "Aerospace" },
]

const priceRanges = [
  { id: "all", name: "All Prices" },
  { id: "under-50", name: "Under $50" },
  { id: "50-100", name: "$50 - $100" },
  { id: "100-250", name: "$100 - $250" },
  { id: "250-500", name: "250 - $500" },
  { id: "over-500", name: "Over $500" },
]

export function IdeasFilters() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="ghost"
              className={cn("w-full justify-start", category.id === "all" ? "bg-gray-100" : "")}
            >
              {category.id === "all" && <Check className="mr-2 h-4 w-4" />}
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-3 text-sm font-semibold">Price Range</h3>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <Button
              key={range.id}
              variant="ghost"
              className={cn("w-full justify-start", range.id === "all" ? "bg-gray-100" : "")}
            >
              {range.id === "all" && <Check className="mr-2 h-4 w-4" />}
              {range.name}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-3 text-sm font-semibold">Growth Potential</h3>
        <div className="space-y-2">
          {["All", "High", "Medium", "Low"].map((potential) => (
            <Button
              key={potential}
              variant="ghost"
              className={cn("w-full justify-start", potential === "All" ? "bg-gray-100" : "")}
            >
              {potential === "All" && <Check className="mr-2 h-4 w-4" />}
              {potential}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
