"use client";

import { ArrowUpRight, Bookmark, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShinyButton } from "@/components/shiny-button";
import { useIdeasStore } from "@/components/ideas/use-ideas-store";

const ideas = [
  {
    id: 1,
    name: "Quantum AI",
    description:
      "A revolutionary approach to quantum computing that leverages artificial intelligence to optimize quantum algorithms.",
    category: "Technology",
    price: "$125.00",
    change: "+18.2%",
    creator: "Dr. Sarah Chen",
  },
  {
    id: 2,
    name: "Sustainable Energy Grid",
    description:
      "A decentralized energy grid that uses blockchain to enable peer-to-peer energy trading and optimize renewable energy distribution.",
    category: "Environment",
    price: "$85.00",
    change: "+12.5%",
    creator: "Green Future Labs",
  },
  {
    id: 3,
    name: "Blockchain Healthcare",
    description:
      "A secure healthcare data management system that gives patients control over their medical records while enabling seamless sharing with providers.",
    category: "Healthcare",
    price: "$210.00",
    change: "+10.8%",
    creator: "MedChain Innovations",
  },
  {
    id: 4,
    name: "Space Mining",
    description:
      "A novel approach to asteroid mining using autonomous robots and in-space manufacturing to extract valuable resources.",
    category: "Aerospace",
    price: "$350.00",
    change: "+9.3%",
    creator: "Stellar Resources Inc.",
  },
  {
    id: 5,
    name: "Neural Interface",
    description:
      "A non-invasive brain-computer interface that allows direct communication between the human brain and digital devices.",
    category: "Technology",
    price: "$180.00",
    change: "+15.7%",
    creator: "NeuroLink Technologies",
  },
  {
    id: 6,
    name: "Vertical Farming System",
    description:
      "An AI-powered vertical farming system that optimizes growing conditions and reduces water usage by 90%.",
    category: "Agriculture",
    price: "$95.00",
    change: "+8.2%",
    creator: "Urban Harvest",
  },
];

export function IdeasGrid() {
  const { selectIdea } = useIdeasStore();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {ideas.map((idea) => (
        <Card
          key={idea.id}
          className="overflow-hidden transition-all hover:shadow-md"
        >
          <CardContent className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-bold">{idea.name}</h3>
              <div className="text-sm font-medium">{idea.price}</div>
            </div>
            <div className="mb-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs inline-block">
              {idea.category}
            </div>
            <p className="mb-4 text-sm text-gray-600 line-clamp-3">
              {idea.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">By {idea.creator}</div>
              <div className="text-sm font-medium text-black">
                {idea.change}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t border-gray-100 p-4">
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            <ShinyButton onClick={() => selectIdea(idea)}>
              Trade <ArrowUpRight className="ml-1 h-3 w-3" />
            </ShinyButton>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
