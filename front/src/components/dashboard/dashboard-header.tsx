import { Bell, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        <h1 className="text-xl font-bold">Dashboard</h1>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input placeholder="Search..." className="w-64 rounded-full border-gray-200 pl-9" />
          </div>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-black"></span>
          </Button>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gray-200"></div>
            <span className="hidden text-sm font-medium md:block">John Doe</span>
          </div>
        </div>
      </div>
    </header>
  )
}
