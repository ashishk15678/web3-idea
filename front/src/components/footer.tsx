import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold">IdeaX</h3>
            <p className="text-sm text-gray-600">
              The premier platform for trading intellectual capital in the Web3 space.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/ideas" className="text-gray-600 hover:text-black">
                  Browse Ideas
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-black">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-black">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-black">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-gray-600 hover:text-black">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-black">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-black">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-black">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-gray-600 hover:text-black">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-black">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-black">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-100 pt-6 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} IdeaX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
