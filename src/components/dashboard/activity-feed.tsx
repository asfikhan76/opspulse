"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { activityFeed } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle,
  Trophy,
  HardDrive,
  TrendingUp,
  FileText,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "alert-triangle": AlertTriangle,
  "check-circle": CheckCircle,
  trophy: Trophy,
  "hard-drive": HardDrive,
  "trending-up": TrendingUp,
  "file-text": FileText,
};

const typeColors: Record<string, string> = {
  alert: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  info: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Activity Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {activityFeed.map((item) => {
              const Icon = iconMap[item.icon] || FileText;
              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-3 transition-all duration-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/30",
                    typeColors[item.type]
                  )}
                >
                  <div className="mt-0.5">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 dark:text-slate-400">
                      {item.description}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 dark:text-slate-600">
                      {item.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
