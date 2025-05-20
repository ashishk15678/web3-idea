import Link from "next/link"

const trendingIdeas = [
  {
    id: 1,
    name: "Quantum AI",
    category: "Technology",
    price: "$125.00",
    change: "+18.2%",
  },
  {
    id: 2,
    name: "Sustainable Energy",
    category: "Environment",
    price: "$85.00",
    change: "+12.5%",
  },
  {
    id: 3,
    name: "Blockchain Healthcare",
    category: "Healthcare",
    price: "$210.00",
    change: "+10.8%",
  },
  {
    id: 4,
    name: "Space Mining",
    category: "Aerospace",
    price: "$350.00",
    change: "+9.3%",
  },
]

export function TrendingIdeas() {
  return (
    <div className="space-y-4">
      {trendingIdeas.map((idea) => (
        <Link
          key={idea.id}
          href={`/ideas/${idea.id}`}
          className="flex items-center justify-between rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50"
        >
          <div>
            <h3 className="font-medium">{idea.name}</h3>
            <p className="text-sm text-gray-500">{idea.category}</p>
          </div>
          <div className="text-right">
            <p className="font-medium">{idea.price}</p>
            <p className="text-sm font-medium text-black">{idea.change}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
