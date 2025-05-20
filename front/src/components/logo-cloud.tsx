export function LogoCloud() {
  // Create abstract logo placeholders with text
  const logos = [
    { name: "InnovateCorp" },
    { name: "TechVentures" },
    { name: "FutureWorks" },
    { name: "BlockchainX" },
    { name: "IdeasLab" },
    { name: "Web3Capital" },
  ]

  return (
    <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
      {logos.map((logo) => (
        <div key={logo.name} className="flex items-center justify-center">
          <div className="text-lg font-bold text-gray-400">{logo.name}</div>
        </div>
      ))}
    </div>
  )
}
