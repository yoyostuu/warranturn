import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "destructive" | "ghost"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-[var(--color-primary)] text-white shadow hover:bg-[var(--color-primary-hover)]",
    secondary: "border-transparent bg-[var(--color-surface-soft)] text-[var(--color-text-main)] hover:bg-[var(--color-surface-elevated)]",
    outline: "text-[var(--color-text-main)] border border-[var(--color-border-strong)]",
    success: "border-transparent bg-[var(--color-success)] text-white shadow hover:opacity-90",
    warning: "border-transparent bg-[var(--color-warning)] text-white shadow hover:opacity-90",
    destructive: "border-transparent bg-[var(--color-failure)] text-white shadow hover:opacity-90",
    ghost: "border-transparent bg-transparent text-[var(--color-text-secondary)]",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
