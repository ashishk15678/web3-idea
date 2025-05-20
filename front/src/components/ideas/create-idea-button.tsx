"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateIdeaModal } from "./create-idea-modal";
import { useWalletStore } from "@/store/wallet-store";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function CreateIdeaButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isConnected } = useWalletStore();

  const handleClick = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    console.log("clicked");
    setIsModalOpen(true);
  };

  return (
    <>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed bottom-8 right-8 z-40"
        // onClick={handleClick}
      >
        <div className="group relative">
          <Button
            onClick={handleClick}
            size="lg"
            className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-transparent backdrop-blur-md border
             border-black/10 shadow-2xl shadow-green-500/80 transition-all duration-300 group-hover:w-[200px] group-hover:bg-zinc-100/20
             group-hover:border-black/20"
          >
            <Plus className="h-6 w-6 text-black transition-all duration-300 group-hover:rotate-90 group-hover:text-zinc-500" />
            <div className="group-hover:flex transition-all duration-300 font-bold hidden text-zinc-500 relative">
              Create Idea
            </div>
          </Button>
        </div>
      </motion.div>

      <CreateIdeaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          toast.success("Idea created successfully!");
        }}
      />
    </>
  );
}
