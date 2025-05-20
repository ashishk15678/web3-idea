import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShinyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const ShinyButton = forwardRef<HTMLButtonElement, ShinyButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-full bg-black px-6 py-3 text-white shadow-md transition-all hover:shadow-lg",
          "after:absolute after:inset-0 after:z-10 after:bg-[linear-gradient(110deg,rgba(255,255,255,0),rgba(255,255,255,0.3),rgba(255,255,255,0))] after:bg-[length:200%_100%] after:animate-[shine_3s_ease-in-out_infinite]",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);
ShinyButton.displayName = "ShinyButton";
