"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Briefcase, CreditCard, Home, Lightbulb, LogOut, Settings, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "My Ideas", href: "/dashboard/my-ideas", icon: Lightbulb },
  { name: "Portfolio", href: "/dashboard/portfolio", icon: Briefcase },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Transactions", href: "/dashboard/transactions", icon: CreditCard },
  { name: "Team", href: "/dashboard/team", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center border-b border-gray-200 px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">IdeaX</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive ? "bg-gray-100 text-black" : "text-gray-600 hover:bg-gray-50 hover:text-black",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-gray-200 p-4">
        <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-black">
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
