import { ArrowUpRight, BarChart3, TrendingUp, Wallet } from "lucide-react"
import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PortfolioChart } from "@/components/dashboard/portfolio-chart"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { TrendingIdeas } from "@/components/dashboard/trending-ideas"

export default function Dashboard() {
  return (
    <div className="flex flex-col">
      <DashboardHeader />

      <main className="flex-1 p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
              <Wallet className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$24,563.82</div>
              <p className="text-xs text-gray-500">+2.5% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ideas Owned</CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">17</div>
              <p className="text-xs text-gray-500">Across 8 categories</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Quantum AI</div>
              <p className="text-xs text-gray-500">+18.2% this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              <Wallet className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$5,240.00</div>
              <p className="text-xs text-gray-500">Ready to invest</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Portfolio Performance</CardTitle>
              <CardDescription>Your idea investments over time</CardDescription>
            </CardHeader>
            <CardContent>
              <PortfolioChart />
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Trending Ideas</CardTitle>
                <CardDescription>Most popular ideas this week</CardDescription>
              </div>
              <Link href="/ideas" className="flex items-center text-sm font-medium text-black">
                View all <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent>
              <TrendingIdeas />
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest idea trades</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentTransactions />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
