import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface FeatureSectionProps {
  title: string;
  description: string;
  features: string[];
  imageSide: "left" | "right";
  className?: string;
  image?: string;
}

export function FeatureSection({
  title,
  description,
  features,
  imageSide,
  className,
  image,
}: FeatureSectionProps) {
  return (
    <section className={cn("py-24", className)}>
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Feature Image/Placeholder */}
          <div
            className={cn(
              "order-1",
              imageSide === "left" ? "md:order-1" : "md:order-2"
            )}
          >
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-sm">
              <div className="flex h-full w-full items-center justify-center">
                <div className="space-y- ">
                  {/* <div className="h-4 w-3/4 rounded-full bg-gray-300"></div>
                  <div className="h-4 w-full rounded-full bg-gray-300"></div>
                  <div className="h-4 w-2/3 rounded-full bg-gray-300"></div>
                  <div className="h-20 w-full rounded-xl bg-gray-300"></div>
                  <div className="flex gap-4"> */}
                  {image && (
                    <Image
                      src={image}
                      width={700}
                      height={700}
                      className="rounded-2xl overflow-hidden"
                      alt="Feature Image"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Feature Content */}
          <div
            className={cn(
              "order-2",
              imageSide === "left" ? "md:order-2" : "md:order-1"
            )}
          >
            <div className="max-w-lg">
              <h2 className="mb-4 text-3xl font-bold text-black">{title}</h2>
              <p className="mb-8 text-lg text-gray-600">{description}</p>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-3 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-white">
                      <Check className="h-3 w-3" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
