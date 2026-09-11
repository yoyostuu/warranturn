"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "default" | "outline" | "ghost" | "danger";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    
    const variants = {
      default: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]",
      outline: "border border-[var(--color-border-strong)] bg-transparent hover:bg-[var(--color-surface-soft)] text-[var(--color-text-main)]",
      ghost: "hover:bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-main)]",
      danger: "bg-[var(--color-failure)] text-white hover:opacity-90 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3 text-xs",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
