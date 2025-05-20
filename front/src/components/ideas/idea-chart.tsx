"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export function IdeaChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [timeframe, setTimeframe] = useState<
    "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL"
  >("1M");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Generate random data based on timeframe
    const dataPoints =
      timeframe === "1D"
        ? 24
        : timeframe === "1W"
        ? 7
        : timeframe === "1M"
        ? 30
        : timeframe === "3M"
        ? 90
        : timeframe === "1Y"
        ? 12
        : 5;

    // Chart data - generate more realistic looking data
    const data = [];
    let baseValue = 50 + Math.random() * 50;

    for (let i = 0; i < dataPoints; i++) {
      // Create some volatility but with an upward trend
      const volatility = Math.random() * 10 - 3;
      baseValue = Math.max(10, baseValue + volatility + (i / dataPoints) * 10);
      data.push({ x: i, y: baseValue });
    }

    // Chart dimensions
    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Scale data to fit chart
    const maxY = Math.max(...data.map((d) => d.y)) * 1.1; // Add 10% padding
    const minY = Math.min(...data.map((d) => d.y)) * 0.9; // Subtract 10% padding
    const scaleY = chartHeight / (maxY - minY);
    const scaleX = chartWidth / (data.length - 1);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = "#f1f1f1";
    ctx.lineWidth = 1;

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + chartHeight - (i / 5) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Y-axis labels
      const labelValue = minY + (i / 5) * (maxY - minY);
      ctx.fillStyle = "#888";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(`$${labelValue.toFixed(2)}`, padding.left - 5, y + 3);
    }

    // Vertical grid lines
    const xLabels =
      timeframe === "1D"
        ? ["12am", "6am", "12pm", "6pm", "12am"]
        : timeframe === "1W"
        ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        : timeframe === "1M"
        ? ["Week 1", "Week 2", "Week 3", "Week 4"]
        : timeframe === "3M"
        ? ["Jan", "Feb", "Mar"]
        : timeframe === "1Y"
        ? ["Jan", "Mar", "May", "Jul", "Sep", "Nov"]
        : ["2020", "2021", "2022", "2023", "2024"];

    for (let i = 0; i < xLabels.length; i++) {
      const x = padding.left + (i / (xLabels.length - 1)) * chartWidth;

      // Vertical grid line
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();

      // X-axis label
      ctx.fillStyle = "#888";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(xLabels[i], x, height - padding.bottom + 15);
    }

    // Draw line
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((point, i) => {
      const x = padding.left + point.x * scaleX;
      const y = padding.top + chartHeight - (point.y - minY) * scaleY;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw gradient area under the line
    const gradient = ctx.createLinearGradient(
      0,
      padding.top,
      0,
      height - padding.bottom
    );
    gradient.addColorStop(0, "rgba(0, 0, 0, 0.1)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();

    // Start from the bottom left
    ctx.moveTo(padding.left, height - padding.bottom);

    // Draw to the first point
    ctx.lineTo(
      padding.left,
      padding.top + chartHeight - (data[0].y - minY) * scaleY
    );

    // Draw the line again
    data.forEach((point, i) => {
      const x = padding.left + point.x * scaleX;
      const y = padding.top + chartHeight - (point.y - minY) * scaleY;
      ctx.lineTo(x, y);
    });

    // Close the path to the bottom right
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.closePath();
    ctx.fill();

    // Draw points at specific intervals
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;

    // Only draw points at specific intervals to avoid overcrowding
    const interval = Math.max(1, Math.floor(data.length / 10));

    data.forEach((point, i) => {
      if (i % interval === 0 || i === data.length - 1) {
        const x = padding.left + point.x * scaleX;
        const y = padding.top + chartHeight - (point.y - minY) * scaleY;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    });
  }, [timeframe]);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-bold">Price History</div>
        <div className="flex items-center gap-1">
          {(["1D", "1W", "1M", "3M", "1Y", "ALL"] as const).map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeframe(tf)}
              className="h-7 text-xs px-2"
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex-1">
        <canvas
          ref={canvasRef}
          className="h-full w-full"
          style={{ width: "80%", height: "80%" }}
        />
      </div>
    </div>
  );
}
