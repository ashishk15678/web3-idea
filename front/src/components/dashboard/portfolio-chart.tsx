"use client"

import { useEffect, useRef } from "react"

export function PortfolioChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Chart data
    const data = [
      { x: 0, y: 50 },
      { x: 1, y: 45 },
      { x: 2, y: 60 },
      { x: 3, y: 55 },
      { x: 4, y: 70 },
      { x: 5, y: 65 },
      { x: 6, y: 80 },
      { x: 7, y: 75 },
      { x: 8, y: 90 },
      { x: 9, y: 85 },
      { x: 10, y: 100 },
      { x: 11, y: 95 },
    ]

    // Chart dimensions
    const width = rect.width
    const height = rect.height
    const padding = 20
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Scale data to fit chart
    const maxY = Math.max(...data.map((d) => d.y))
    const minY = Math.min(...data.map((d) => d.y))
    const scaleY = chartHeight / (maxY - minY)
    const scaleX = chartWidth / (data.length - 1)

    // Draw grid lines
    ctx.strokeStyle = "#f1f1f1"
    ctx.lineWidth = 1

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + chartHeight - (i / 5) * chartHeight
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    // Draw line
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2
    ctx.beginPath()

    data.forEach((point, i) => {
      const x = padding + point.x * scaleX
      const y = padding + chartHeight - (point.y - minY) * scaleY

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw gradient area under the line
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding)
    gradient.addColorStop(0, "rgba(0, 0, 0, 0.1)")
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

    ctx.fillStyle = gradient
    ctx.beginPath()

    // Start from the bottom left
    ctx.moveTo(padding, height - padding)

    // Draw to the first point
    ctx.lineTo(padding, padding + chartHeight - (data[0].y - minY) * scaleY)

    // Draw the line again
    data.forEach((point, i) => {
      const x = padding + point.x * scaleX
      const y = padding + chartHeight - (point.y - minY) * scaleY
      ctx.lineTo(x, y)
    })

    // Close the path to the bottom right
    ctx.lineTo(width - padding, height - padding)
    ctx.closePath()
    ctx.fill()

    // Draw points
    ctx.fillStyle = "#fff"
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2

    data.forEach((point) => {
      const x = padding + point.x * scaleX
      const y = padding + chartHeight - (point.y - minY) * scaleY

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    })

    // Draw x-axis labels
    ctx.fillStyle = "#888"
    ctx.font = "10px sans-serif"
    ctx.textAlign = "center"

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    data.forEach((point, i) => {
      if (i % 2 === 0) {
        // Show every other month to avoid crowding
        const x = padding + point.x * scaleX
        const y = height - padding + 15
        ctx.fillText(months[i], x, y)
      }
    })
  }, [])

  return (
    <div className="h-[300px] w-full">
      <canvas ref={canvasRef} className="h-full w-full" style={{ width: "100%", height: "100%" }} />
    </div>
  )
}
