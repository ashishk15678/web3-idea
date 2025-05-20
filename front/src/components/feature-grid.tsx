import { Shield, Lightbulb, RefreshCw, TrendingUp, Lock, Zap } from "lucide-react"

export function FeatureGrid() {
  const features = [
    {
      icon: Shield,
      title: "Secure Transactions",
      description: "Every trade is secured by blockchain technology, ensuring transparency and immutability.",
    },
    {
      icon: Lightbulb,
      title: "Innovative Ideas",
      description: "Access a marketplace of vetted, high-potential ideas from innovators worldwide.",
    },
    {
      icon: RefreshCw,
      title: "Seamless Trading",
      description: "Our intuitive platform makes trading intellectual property as easy as trading stocks.",
    },
    {
      icon: TrendingUp,
      title: "Growth Potential",
      description: "Invest early in concepts with exponential growth potential before they hit the mainstream.",
    },
    {
      icon: Lock,
      title: "IP Protection",
      description: "Creators' intellectual property is protected through smart contracts and encryption.",
    },
    {
      icon: Zap,
      title: "Instant Settlement",
      description: "All trades are settled instantly with no intermediaries or waiting periods.",
    },
  ]

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {features.map((feature, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
        >
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(240,240,240,0.8),rgba(255,255,255,0))] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-gray-200">
            <feature.icon className="h-6 w-6 text-black" />
          </div>

          <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
          <p className="text-gray-600">{feature.description}</p>
        </div>
      ))}
    </div>
  )
}
