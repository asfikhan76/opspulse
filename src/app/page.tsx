"use client";

import { KPICard } from "@/components/dashboard/kpi-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { ChannelChart } from "@/components/dashboard/channel-chart";
import { PerformanceMetrics } from "@/components/dashboard/performance-metrics";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { kpiData } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Clock } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
            Real-time business intelligence overview
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="gap-1.5">
            <Clock className="h-3 w-3" />
            Updated just now
          </Badge>
          <Badge variant="default" className="gap-1.5">
            <Sparkles className="h-3 w-3" />
            AI Insights Active
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {kpiData.map((kpi, index) => (
          <KPICard key={kpi.title} data={kpi} index={index} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 min-w-0">
          <RevenueChart />
        </div>
        <div className="min-w-0">
          <ChannelChart />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceMetrics />
        <ActivityFeed />
      </div>
    </div>
  );
}
