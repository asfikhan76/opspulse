import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-cyan-500/10 text-cyan-400",
        success: "border-transparent bg-emerald-500/10 text-emerald-400",
        warning: "border-transparent bg-amber-500/10 text-amber-400",
        danger: "border-transparent bg-rose-500/10 text-rose-400",
        info: "border-transparent bg-violet-500/10 text-violet-400",
        outline: "border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
