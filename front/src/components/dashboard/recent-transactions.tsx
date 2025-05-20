import { ArrowDown, ArrowUp } from "lucide-react"

import { cn } from "@/lib/utils"

const transactions = [
  {
    id: 1,
    type: "buy",
    idea: "Quantum AI",
    amount: "$1,250.00",
    date: "Today, 10:45 AM",
    status: "completed",
  },
  {
    id: 2,
    type: "sell",
    idea: "Sustainable Energy",
    amount: "$850.00",
    date: "Yesterday, 3:20 PM",
    status: "completed",
  },
  {
    id: 3,
    type: "buy",
    idea: "Blockchain Healthcare",
    amount: "$2,100.00",
    date: "May 18, 2023",
    status: "completed",
  },
  {
    id: 4,
    type: "buy",
    idea: "Space Mining",
    amount: "$3,500.00",
    date: "May 15, 2023",
    status: "completed",
  },
  {
    id: 5,
    type: "sell",
    idea: "Neural Interface",
    amount: "$1,800.00",
    date: "May 12, 2023",
    status: "completed",
  },
]

export function RecentTransactions() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 text-left text-sm font-medium text-gray-500">
            <th className="whitespace-nowrap px-4 py-2">Type</th>
            <th className="whitespace-nowrap px-4 py-2">Idea</th>
            <th className="whitespace-nowrap px-4 py-2">Amount</th>
            <th className="whitespace-nowrap px-4 py-2">Date</th>
            <th className="whitespace-nowrap px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-b border-gray-100 text-sm">
              <td className="whitespace-nowrap px-4 py-3">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full",
                      transaction.type === "buy" ? "bg-gray-100" : "bg-gray-100",
                    )}
                  >
                    {transaction.type === "buy" ? (
                      <ArrowDown className="h-4 w-4 text-black" />
                    ) : (
                      <ArrowUp className="h-4 w-4 text-black" />
                    )}
                  </div>
                  <span className="font-medium capitalize">{transaction.type}</span>
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-medium">{transaction.idea}</td>
              <td className="whitespace-nowrap px-4 py-3 font-medium">{transaction.amount}</td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-500">{transaction.date}</td>
              <td className="whitespace-nowrap px-4 py-3">
                <span
                  className={cn(
                    "inline-flex rounded-full px-2 py-1 text-xs font-medium",
                    transaction.status === "completed" ? "bg-gray-100 text-gray-800" : "",
                  )}
                >
                  {transaction.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
