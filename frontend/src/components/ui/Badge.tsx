import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utils/cn"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        primary:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        danger:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-border",
        neutral: "border-border bg-muted/60 text-muted-foreground",
        success:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        warning:
          "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
        info:
          "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.2 text-[10px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  hasDot?: boolean;
}

const dots = {
  default: "bg-white",
  primary: "bg-white",
  secondary: "bg-white",
  destructive: "bg-white",
  danger: "bg-white",
  outline: "bg-muted-foreground",
  neutral: "bg-muted-foreground",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  info: "bg-blue-500",
}

function Badge({ className, variant = "default", size = "default", hasDot = false, children, ...props }: BadgeProps) {
  const dotColor = variant ? dots[variant as keyof typeof dots] || "bg-primary" : "bg-primary";
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {hasDot && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColor)} />}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
