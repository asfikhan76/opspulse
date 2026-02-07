"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { performanceData } from "@/lib/data";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle } from "lucide-react";

export function PerformanceMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">System Performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {performanceData.map((metric) => {
          const percentage = Math.min(
            (metric.current / metric.target) * 100,
            100
          );
          const isGood =
            metric.name === "Error Rate"
              ? metric.current <= metric.target
              : metric.name === "Page Load" || metric.name === "API Response"
              ? metric.current <= metric.target
              : metric.current >= metric.target;

          return (
            <div key={metric.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {isGood ? (
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-400" />
                  )}
                  <span className="text-slate-600 dark:text-slate-300">{metric.name}</span>
                </div>
                <span className="font-medium text-slate-900 dark:text-white">
                  {metric.current}
                  {metric.unit}
                </span>
              </div>
              <Progress
                value={percentage}
                indicatorClassName={cn(
                  isGood ? "bg-emerald-500" : "bg-amber-500"
                )}
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>Current: {metric.current}{metric.unit}</span>
                <span>Target: {metric.target}{metric.unit}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
