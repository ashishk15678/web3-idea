"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface SpotlightEffectProps {
  className?: string
}

export function SpotlightEffect({ className }: SpotlightEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setPosition({ x, y })
    setOpacity(1)
  }

  const handleMouseLeave = () => {
    setOpacity(0)
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener("mousemove", handleMouseMove as any)
    container.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      container.removeEventListener("mousemove", handleMouseMove as any)
      container.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <div ref={containerRef} className={cn("absolute inset-0 overflow-hidden", className)}>
      <div
        className="pointer-events-none absolute -inset-px z-10 transition duration-300"
        style={{
          background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(240, 240, 240, 0.4), transparent 40%)`,
          opacity,
        }}
      />
    </div>
  )
}
