"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Info, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ShinyButton } from "@/components/shiny-button";
import { IdeaChart } from "@/components/ideas/idea-chart";
import { useIdeasStore } from "@/components/ideas/use-ideas-store";

// Types
interface Idea {
  name: string;
  category: string;
  price: string;
  change: string;
  description: string;
  creator: string;
}

interface ModalHeaderProps {
  title: string;
  category: string;
  price: string;
  change: string;
  onClose: () => void;
}

interface TradingPanelProps {
  idea: Idea;
  onTrade: (type: "buy" | "sell", amount: string) => void;
}

interface TradeTypeSelectorProps {
  tradeType: "buy" | "sell";
  onTypeChange: (type: "buy" | "sell") => void;
}

interface AmountInputProps {
  amount: string;
  onAmountChange: (amount: string) => void;
}

interface TradeSummaryProps {
  totalCost: string;
}

interface IdeaAboutProps {
  idea: Idea;
}

// Header Component
const ModalHeader = ({
  title,
  category,
  price,
  change,
  onClose,
}: ModalHeaderProps) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
    <div className="flex-1 min-w-0">
      <h2 className="text-xl font-bold truncate">{title}</h2>
      <div className="text-sm text-gray-500">{category}</div>
    </div>
    <div className="flex items-center gap-4 ml-4">
      <div className="text-right">
        <div className="text-lg font-bold">{price}</div>
        <div className="text-sm font-medium text-black">{change}</div>
      </div>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

// Trading Panel Component
const TradingPanel = ({ idea, onTrade }: TradingPanelProps) => {
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("1");

  const totalCost = (
    Number.parseFloat(amount) * Number.parseFloat(idea.price.replace("$", ""))
  ).toFixed(2);

  return (
    <div className="h-full flex flex-col p-8">
      <h3 className="text-xl font-semibold mb-8">Trade {idea.name}</h3>
      <div className="space-y-8 flex-1">
        <TradeTypeSelector tradeType={tradeType} onTypeChange={setTradeType} />
        <AmountInput amount={amount} onAmountChange={setAmount} />
        <TradeSummary totalCost={totalCost} />
        <div className="mt-auto pt-8">
          <ShinyButton
            className="w-full py-4 text-lg font-medium"
            onClick={() => onTrade(tradeType, amount)}
          >
            {tradeType === "buy" ? "Buy" : "Sell"} {idea.name}
          </ShinyButton>
          <div className="text-center text-base text-gray-500 mt-4">
            You have 0 {idea.name} tokens in your portfolio
          </div>
        </div>
      </div>
    </div>
  );
};

// Trade Type Selector Component
const TradeTypeSelector = ({
  tradeType,
  onTypeChange,
}: TradeTypeSelectorProps) => (
  <div className="grid grid-cols-2 gap-4">
    <Button
      variant={tradeType === "buy" ? "default" : "outline"}
      onClick={() => onTypeChange("buy")}
      className="flex items-center justify-center gap-2 h-12 text-base"
    >
      <ArrowDown className="h-5 w-5" /> Buy
    </Button>
    <Button
      variant={tradeType === "sell" ? "default" : "outline"}
      onClick={() => onTypeChange("sell")}
      className="flex items-center justify-center gap-2 h-12 text-base"
    >
      <ArrowUp className="h-5 w-5" /> Sell
    </Button>
  </div>
);

// Amount Input Component
const AmountInput = ({ amount, onAmountChange }: AmountInputProps) => (
  <div>
    <label className="block text-base font-medium mb-2.5">Amount</label>
    <div className="relative">
      <Input
        type="number"
        value={amount}
        onChange={(e) => onAmountChange(e.target.value)}
        className="pr-16 h-12 text-base"
      />
      <Button
        variant="ghost"
        className="absolute inset-y-0 right-0 h-full rounded-l-none text-sm px-4 hover:bg-gray-100"
      >
        MAX
      </Button>
    </div>
  </div>
);

// Trade Summary Component
const TradeSummary = ({ totalCost }: TradeSummaryProps) => (
  <div className="space-y-5">
    <div>
      <label className="block text-base font-medium mb-2.5">Total Cost</label>
      <div className="rounded-lg border border-gray-200 p-5 text-right bg-white">
        <span className="text-xl font-semibold">${totalCost}</span>
      </div>
    </div>
    <div className="rounded-lg bg-white border border-gray-200 p-5">
      <div className="flex items-center justify-between text-base">
        <div className="flex items-center gap-2 text-gray-600">
          <span>Transaction Fee</span>
          <Info className="h-4 w-4 text-gray-400" />
        </div>
        <div className="font-medium">$1.25</div>
      </div>
    </div>
  </div>
);

// Main IdeaModal Component
export function IdeaModal() {
  const { selectedIdea, isModalOpen, closeModal } = useIdeasStore();

  if (!selectedIdea) return null;

  const handleTrade = (type: "buy" | "sell", amount: string) => {
    console.log(`Trading ${type} ${amount} of ${selectedIdea.name}`);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="w-[min(98vw,1800px)] h-[min(95vh,800px)] p-0 overflow-hidden bg-white">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white">
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl font-bold truncate">
                {selectedIdea.name}
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-base text-gray-500">
                  {selectedIdea.category}
                </span>
                <span className="text-base font-medium text-emerald-600">
                  {selectedIdea.change}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-8 ml-6">
              <div className="text-right">
                <div className="text-3xl font-bold">{selectedIdea.price}</div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeModal}
                className="h-10 w-10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 grid grid-cols-1 xl:grid-cols-[1fr,420px] min-h-0">
            {/* Left Content */}
            <div className="flex flex-col border-r border-gray-100">
              <Tabs defaultValue="chart" className="flex-1 flex flex-col">
                <TabsList className="px-8 py-3 border-b border-gray-100 bg-gray-50/50">
                  <TabsTrigger
                    value="chart"
                    className="flex-1 text-base px-8 data-[state=active]:bg-white"
                  >
                    Chart
                  </TabsTrigger>
                  <TabsTrigger
                    value="about"
                    className="flex-1 text-base px-8 data-[state=active]:bg-white"
                  >
                    About
                  </TabsTrigger>
                  <TabsTrigger
                    value="stats"
                    className="flex-1 text-base px-8 data-[state=active]:bg-white"
                  >
                    Stats
                  </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-hidden">
                  <TabsContent value="chart" className="h-full m-0">
                    <div className="h-full p-4">
                      <IdeaChart />
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="about"
                    className="h-full m-0 overflow-y-auto"
                  >
                    <div className="p-8">
                      <IdeaAbout idea={selectedIdea} />
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="stats"
                    className="h-full m-0 overflow-y-auto"
                  >
                    <div className="p-8">
                      <IdeaStats />
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            {/* Right Content - Trading Panel */}
            <div className="border-t xl:border-t-0 xl:border-l border-gray-100 bg-gray-50/30">
              <TradingPanel idea={selectedIdea} onTrade={handleTrade} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Additional Components
const IdeaAbout = ({ idea }: IdeaAboutProps) => (
  <div className="space-y-10">
    <div>
      <h3 className="text-xl font-semibold mb-5">Description</h3>
      <p className="text-gray-600 leading-relaxed text-lg">
        {idea.description}
      </p>
    </div>
    <div>
      <h3 className="text-xl font-semibold mb-5">Creator</h3>
      <div className="flex items-center gap-5 p-5 rounded-lg bg-gray-50 border border-gray-100">
        <div className="h-16 w-16 rounded-full bg-gray-200" />
        <div>
          <div className="font-medium text-lg">{idea.creator}</div>
          <div className="text-base text-gray-500 mt-1">Idea Creator</div>
        </div>
      </div>
    </div>
  </div>
);

const IdeaStats = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
    {[
      { label: "Market Cap", value: "$1,250,000" },
      { label: "24h Volume", value: "$125,430" },
      { label: "Holders", value: "1,245" },
      { label: "All-time High", value: "$145.20" },
    ].map((stat) => (
      <div
        key={stat.label}
        className="rounded-lg border border-gray-100 p-6 bg-white"
      >
        <div className="text-base text-gray-500 mb-2">{stat.label}</div>
        <div className="text-xl font-semibold">{stat.value}</div>
      </div>
    ))}
  </div>
);
