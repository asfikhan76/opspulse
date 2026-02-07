"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  DollarSign,
  Users,
  Target,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { KPIData } from "@/lib/types";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "dollar-sign": DollarSign,
  users: Users,
  target: Target,
  "shopping-cart": ShoppingCart,
};

interface KPICardProps {
  data: KPIData;
  index: number;
}

const gradients = [
  "from-cyan-500/20 to-cyan-500/5",
  "from-violet-500/20 to-violet-500/5",
  "from-emerald-500/20 to-emerald-500/5",
  "from-amber-500/20 to-amber-500/5",
];

const iconColors = [
  "bg-cyan-500/10 text-cyan-400",
  "bg-violet-500/10 text-violet-400",
  "bg-emerald-500/10 text-emerald-400",
  "bg-amber-500/10 text-amber-400",
];

const borderColors = [
  "border-cyan-500/20",
  "border-violet-500/20",
  "border-emerald-500/20",
  "border-amber-500/20",
];

export function KPICard({ data, index }: KPICardProps) {
  const Icon = iconMap[data.icon] || DollarSign;
  const isPositive = data.change >= 0;
  const colorIdx = index % 4;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-gradient-to-br p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
        gradients[colorIdx],
        borderColors[colorIdx],
        "bg-white/80 dark:bg-slate-900/50"
      )}
    >
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/5 blur-2xl group-hover:bg-white/10 transition-all duration-500" />
      
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className={cn("rounded-lg p-2.5", iconColors[colorIdx])}>
            <Icon className="h-5 w-5" />
          </div>
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
              isPositive
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-rose-500/10 text-rose-400"
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {isPositive ? "+" : ""}
            {data.change}%
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">{data.title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1 tracking-tight dark:text-white">
            {data.value}
          </p>
          <p className="text-xs text-slate-500 mt-1">{data.changeLabel}</p>
        </div>

        {/* Mini sparkline */}
        <div className="mt-4 flex items-end gap-[2px] h-8">
          {data.trend.map((value, i) => {
            const max = Math.max(...data.trend);
            const height = (value / max) * 100;
            return (
              <div
                key={i}
                className={cn(
                  "flex-1 rounded-sm transition-all duration-300",
                  i === data.trend.length - 1
                    ? iconColors[colorIdx].split(" ")[0].replace("bg-", "bg-").replace("/10", "")
                    : "bg-slate-200/50 dark:bg-slate-700/50"
                )}
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
