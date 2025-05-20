"use client";

import { useState, useEffect } from "react";
import {
  X,
  TrendingUp,
  Tag,
  DollarSign,
  Calendar,
  BarChart2,
  Sparkles,
  Check,
} from "lucide-react";
import { useWalletStore } from "@/store/wallet-store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

// Predefined categories
const CATEGORIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Energy",
  "Consumer Goods",
  "Real Estate",
  "Entertainment",
  "Education",
  "Transportation",
  "Agriculture",
];

interface CreateIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface CreateIdeaFormData {
  title: string;
  description: string;
  category: string;
  initialPrice: number;
  targetPrice: number;
  timeframe: string;
  riskLevel: number;
  marketSize: string;
  competitiveAdvantage: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const STEPS = [
  { id: 1, title: "Basic Information", icon: Sparkles },
  { id: 2, title: "Market Details", icon: DollarSign },
  { id: 3, title: "Review & Submit", icon: Check },
];

export function CreateIdeaModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateIdeaModalProps) {
  const { address } = useWalletStore();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [formData, setFormData] = useState<CreateIdeaFormData>({
    title: "",
    description: "",
    category: "",
    initialPrice: 10,
    targetPrice: 100,
    timeframe: "1y",
    riskLevel: 5,
    marketSize: "",
    competitiveAdvantage: "",
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: "",
        description: "",
        category: "",
        initialPrice: 10,
        targetPrice: 100,
        timeframe: "1y",
        riskLevel: 5,
        marketSize: "",
        competitiveAdvantage: "",
      });
      setCurrentStep(1);
    }
  }, [isOpen]);

  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  const validateStep = (step: number): boolean => {
    const errors: ValidationErrors = {};

    switch (step) {
      case 1:
        if (!formData.title.trim()) {
          errors.title = "Title is required";
        } else if (formData.title.length < 3) {
          errors.title = "Title must be at least 3 characters";
        } else if (formData.title.length > 100) {
          errors.title = "Title must be less than 100 characters";
        }

        if (!formData.category) {
          errors.category = "Category is required";
        }

        if (!formData.description.trim()) {
          errors.description = "Description is required";
        } else if (formData.description.length < 10) {
          errors.description = "Description must be at least 10 characters";
        } else if (formData.description.length > 1000) {
          errors.description = "Description must be less than 1000 characters";
        }
        break;

      case 2:
        if (formData.initialPrice <= 0) {
          errors.initialPrice = "Initial price must be greater than 0";
        }

        if (formData.targetPrice <= formData.initialPrice) {
          errors.targetPrice =
            "Target price must be greater than initial price";
        }

        if (!formData.timeframe) {
          errors.timeframe = "Timeframe is required";
        }

        if (formData.riskLevel < 1 || formData.riskLevel > 10) {
          errors.riskLevel = "Risk level must be between 1 and 10";
        }

        if (!formData.marketSize) {
          errors.marketSize = "Market size is required";
        }

        if (!formData.competitiveAdvantage.trim()) {
          errors.competitiveAdvantage = "Competitive advantage is required";
        } else if (formData.competitiveAdvantage.length < 10) {
          errors.competitiveAdvantage =
            "Competitive advantage must be at least 10 characters";
        } else if (formData.competitiveAdvantage.length > 500) {
          errors.competitiveAdvantage =
            "Competitive advantage must be less than 500 characters";
        }
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Clear validation errors when going back
      setValidationErrors({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    // Validate all steps before submitting
    if (!validateStep(1) || !validateStep(2)) {
      toast.error("Please fix all validation errors before submitting");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8080/ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          creator_id: address,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const newIdea = await response.json();
      toast.success("Idea created successfully!");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to create idea:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create idea"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="Enter a clear, concise title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className={`h-10 text-sm ${
                    validationErrors.title ? "border-red-500" : ""
                  }`}
                />
                {validationErrors.title && (
                  <p className="text-sm text-red-500">
                    {validationErrors.title}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger
                    className={`h-10 text-sm ${
                      validationErrors.category ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem
                        key={category}
                        value={category}
                        className="text-sm"
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.category && (
                  <p className="text-sm text-red-500">
                    {validationErrors.category}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your idea in detail..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className={`min-h-[120px] text-sm resize-none ${
                    validationErrors.description ? "border-red-500" : ""
                  }`}
                />
                {validationErrors.description && (
                  <p className="text-sm text-red-500">
                    {validationErrors.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Initial Price
                </Label>
                <Input
                  type="number"
                  value={formData.initialPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      initialPrice: parseFloat(e.target.value),
                    })
                  }
                  min={0.01}
                  step={0.01}
                  className={`h-10 text-sm ${
                    validationErrors.initialPrice ? "border-red-500" : ""
                  }`}
                />
                {validationErrors.initialPrice && (
                  <p className="text-sm text-red-500">
                    {validationErrors.initialPrice}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Target Price
                </Label>
                <Input
                  type="number"
                  value={formData.targetPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      targetPrice: parseFloat(e.target.value),
                    })
                  }
                  min={formData.initialPrice}
                  step={0.01}
                  className={`h-10 text-sm ${
                    validationErrors.targetPrice ? "border-red-500" : ""
                  }`}
                />
                {validationErrors.targetPrice && (
                  <p className="text-sm text-red-500">
                    {validationErrors.targetPrice}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Timeframe
              </Label>
              <Select
                value={formData.timeframe}
                onValueChange={(value) =>
                  setFormData({ ...formData, timeframe: value })
                }
              >
                <SelectTrigger
                  className={`h-10 text-sm ${
                    validationErrors.timeframe ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3m" className="text-sm">
                    3 Months
                  </SelectItem>
                  <SelectItem value="6m" className="text-sm">
                    6 Months
                  </SelectItem>
                  <SelectItem value="1y" className="text-sm">
                    1 Year
                  </SelectItem>
                  <SelectItem value="2y" className="text-sm">
                    2 Years
                  </SelectItem>
                  <SelectItem value="5y" className="text-sm">
                    5 Years
                  </SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.timeframe && (
                <p className="text-sm text-red-500">
                  {validationErrors.timeframe}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Risk Level
              </Label>
              <div className="px-2 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <Slider
                  value={[formData.riskLevel]}
                  onValueChange={([value]) =>
                    setFormData({ ...formData, riskLevel: value })
                  }
                  min={1}
                  max={10}
                  step={1}
                  className={`py-4 ${
                    validationErrors.riskLevel ? "border-red-500" : ""
                  }`}
                />
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-2">
                  <span>Low Risk</span>
                  <span>High Risk</span>
                </div>
              </div>
              {validationErrors.riskLevel && (
                <p className="text-sm text-red-500">
                  {validationErrors.riskLevel}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Market Size
              </Label>
              <Select
                value={formData.marketSize}
                onValueChange={(value) =>
                  setFormData({ ...formData, marketSize: value })
                }
              >
                <SelectTrigger
                  className={`h-10 text-sm ${
                    validationErrors.marketSize ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Select market size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small" className="text-sm">
                    Small (1M - 10M)
                  </SelectItem>
                  <SelectItem value="medium" className="text-sm">
                    Medium (10M - 100M)
                  </SelectItem>
                  <SelectItem value="large" className="text-sm">
                    Large (100M - 1B)
                  </SelectItem>
                  <SelectItem value="xlarge" className="text-sm">
                    Extra Large ({">"}1B)
                  </SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.marketSize && (
                <p className="text-sm text-red-500">
                  {validationErrors.marketSize}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Competitive Advantage
              </Label>
              <Textarea
                placeholder="What makes your idea unique?"
                value={formData.competitiveAdvantage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    competitiveAdvantage: e.target.value,
                  })
                }
                className={`min-h-[100px] text-sm resize-none ${
                  validationErrors.competitiveAdvantage ? "border-red-500" : ""
                }`}
              />
              {validationErrors.competitiveAdvantage && (
                <p className="text-sm text-red-500">
                  {validationErrors.competitiveAdvantage}
                </p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Review Your Idea
              </h3>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Title</p>
                    <p className="font-medium">{formData.title}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Category</p>
                    <p className="font-medium">{formData.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Initial Price
                    </p>
                    <p className="font-medium">${formData.initialPrice}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Target Price
                    </p>
                    <p className="font-medium">${formData.targetPrice}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Timeframe
                    </p>
                    <p className="font-medium">{formData.timeframe}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Risk Level
                    </p>
                    <p className="font-medium">{formData.riskLevel}/10</p>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400 mb-2">
                    Description
                  </p>
                  <p className="whitespace-pre-wrap">{formData.description}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400 mb-2">
                    Competitive Advantage
                  </p>
                  <p className="whitespace-pre-wrap">
                    {formData.competitiveAdvantage}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-0 bg-white dark:bg-gray-900">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <DialogHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Create New Idea
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                {/* <X className="h-4 w-4" /> */}
              </Button>
            </div>

            {/* Progress Steps */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                {STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = currentStep > step.id;
                  const isCurrent = currentStep === step.id;

                  return (
                    <div key={step.id} className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                          isCompleted
                            ? "bg-primary border-primary text-white"
                            : isCurrent
                            ? "border-primary text-primary"
                            : "border-gray-300 dark:border-gray-600 text-gray-400"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                      </div>
                      <span
                        className={`ml-2 text-sm font-medium ${
                          isCurrent
                            ? "text-primary"
                            : isCompleted
                            ? "text-gray-900 dark:text-gray-100"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {step.title}
                      </span>
                      {index < STEPS.length - 1 && (
                        <div className="w-16 h-[2px] mx-4 bg-gray-200 dark:bg-gray-700" />
                      )}
                    </div>
                  );
                })}
              </div>
              <Progress value={progress} className="h-1" />
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between pt-6 mt-6 border-t border-gray-200 dark:border-gray-800">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1 || isLoading}
              className="h-9 px-4 text-sm"
            >
              Back
            </Button>
            {currentStep < STEPS.length ? (
              <Button
                type="button"
                onClick={handleNext}
                className="h-9 px-4 text-sm bg-primary hover:bg-primary/90"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading}
                className="h-9 px-4 text-sm bg-primary hover:bg-primary/90"
              >
                {isLoading ? "Creating..." : "Create Idea"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
