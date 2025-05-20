"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">IdeaX</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-black">
            Home
          </Link>
          <Link href="/ideas" className="text-sm font-medium text-gray-600 hover:text-black">
            Ideas
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-black">
            Dashboard
          </Link>
          <Link href="#" className="text-sm font-medium text-gray-600 hover:text-black">
            About
          </Link>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <ConnectWalletButton variant="outline" className="rounded-full" />
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "container mx-auto overflow-hidden transition-all duration-300 md:hidden",
          isMenuOpen ? "max-h-64" : "max-h-0",
        )}
      >
        <div className="flex flex-col gap-4 px-4 pb-6">
          <Link
            href="/"
            className="py-2 text-sm font-medium text-gray-600 hover:text-black"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/ideas"
            className="py-2 text-sm font-medium text-gray-600 hover:text-black"
            onClick={() => setIsMenuOpen(false)}
          >
            Ideas
          </Link>
          <Link
            href="/dashboard"
            className="py-2 text-sm font-medium text-gray-600 hover:text-black"
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="#"
            className="py-2 text-sm font-medium text-gray-600 hover:text-black"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <ConnectWalletButton className="w-full rounded-full" />
        </div>
      </div>
    </header>
  )
}
