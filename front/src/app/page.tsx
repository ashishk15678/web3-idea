import Link from "next/link";
import { ArrowRight, CheckCircle2, Space } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConnectWalletButton } from "@/components/connect-wallet-button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SpotlightEffect } from "@/components/spotlight-effect";
import { LogoCloud } from "@/components/logo-cloud";
import { FeatureSection } from "@/components/feature-section";
import { TestimonialSection } from "@/components/testimonial-section";
import { SpaceBackground } from "@/components/background/space-background";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        {/* Hero Section - Clerk-style with Spotlight */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8f9fa,#ffffff,#f8f9fa)]"></div>
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(240,240,240,0.6),transparent)]"></div>
          </div>

          <SpotlightEffect className="z-10" />

          <div className="container relative z-20 mx-auto px-4 border-zinc-100 border-2 py-20 rounded-[80px]">
            <SpaceBackground />
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm">
                <span className="mr-1 rounded-full bg-black px-1.5 py-0.5 text-[10px] font-medium text-white">
                  NEW
                </span>
                <span className="text-gray-600">
                  Introducing IdeaX Trading Platform
                </span>
              </div>

              <h1 className="mb-6 text-4xl font-bold tracking-tight text-black md:text-6xl">
                The Web3 Platform for Trading Intellectual Capital
              </h1>

              <p className="mb-10 text-lg text-gray-600 md:text-xl">
                IdeaX is the first decentralized marketplace that lets you
                invest in ideas before they become reality. Trade intellectual
                property like never before.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full px-8 py-6 text-base font-medium"
                >
                  <Link href="/ideas">
                    Explore Ideas <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <ConnectWalletButton
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 py-6 text-base font-medium"
                />
              </div>

              <div className="mt-10 flex items-center justify-center gap-2 text-sm text-gray-500">
                <CheckCircle2 className="h-4 w-4 text-black" />
                <span>No credit card required</span>
                <span className="mx-2">•</span>
                <CheckCircle2 className="h-4 w-4 text-black" />
                <span>Secure blockchain transactions</span>
              </div>
            </div>
          </div>
        </section>

        {/* Logo Cloud - Like Clerk */}
        <section className="border-y border-gray-100 bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <p className="mb-8 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
              Trusted by innovators worldwide
            </p>
            <LogoCloud />
          </div>
        </section>

        {/* Feature Section 1 - Like Clerk */}
        <FeatureSection
          title="Discover and Trade Innovative Ideas"
          description="Our platform connects idea creators with investors in a secure, transparent marketplace powered by blockchain technology."
          features={[
            "Access to exclusive intellectual property",
            "Secure blockchain transactions",
            "Real-time market data and analytics",
            "Direct connection with idea creators",
          ]}
          image="/image.png"
          imageSide="right"
        />

        {/* Feature Section 2 - Like Clerk */}
        <FeatureSection
          title="Build Your Intellectual Portfolio"
          description="Diversify your investments with early-stage ideas across multiple industries and track your portfolio's performance in real-time."
          features={[
            "Portfolio analytics and performance tracking",
            "Customizable watchlists and alerts",
            "Detailed idea metrics and projections",
            "Historical performance data",
          ]}
          imageSide="left"
          className="bg-gray-50"
        />

        {/* Feature Section 3 - Like Clerk */}
        <FeatureSection
          title="Monetize Your Intellectual Capital"
          description="For creators, IdeaX provides a platform to monetize your ideas before they even reach development, connecting you with investors worldwide."
          features={[
            "Simple idea submission process",
            "Intellectual property protection",
            "Direct investor communication",
            "Transparent revenue sharing",
          ]}
          imageSide="right"
        />

        {/* Testimonials - Like Clerk */}
        <TestimonialSection />

        {/* CTA Section - Like Clerk */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-black md:text-4xl">
                Ready to start trading on the future?
              </h2>
              <p className="mb-10 text-lg text-gray-600">
                Join thousands of traders and innovators on our platform today
                and be part of the intellectual capital revolution.
              </p>
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 py-6 text-base font-medium"
              >
                <Link href="/ideas">
                  Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
