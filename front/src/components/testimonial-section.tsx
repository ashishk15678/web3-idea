import { cn } from "@/lib/utils"

interface TestimonialProps {
  quote: string
  author: string
  role: string
  className?: string
}

function Testimonial({ quote, author, role, className }: TestimonialProps) {
  return (
    <div className={cn("flex flex-col rounded-2xl bg-white p-8 shadow-sm", className)}>
      <div className="mb-4 text-4xl">"</div>
      <p className="mb-6 flex-1 text-lg text-gray-700">{quote}</p>
      <div>
        <div className="font-medium text-black">{author}</div>
        <div className="text-sm text-gray-500">{role}</div>
      </div>
    </div>
  )
}

export function TestimonialSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-black">What our users say</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Join thousands of traders and innovators who are already using IdeaX to trade intellectual capital.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Testimonial
            quote="IdeaX has completely transformed how I invest in innovation. The platform is intuitive and the returns have been exceptional."
            author="Alex Morgan"
            role="Angel Investor"
          />
          <Testimonial
            quote="As a creator, I've found a way to monetize my concepts before they even reach development. This is revolutionary."
            author="Sarah Chen"
            role="Tech Entrepreneur"
            className="md:translate-y-8"
          />
          <Testimonial
            quote="The transparency and security of blockchain combined with the excitement of trading ideas makes this platform unique."
            author="Michael Rodriguez"
            role="Portfolio Manager"
          />
        </div>
      </div>
    </section>
  )
}
