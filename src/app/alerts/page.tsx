"use client";

import { AnomalyAlerts } from "@/components/alerts/anomaly-alerts";
import { Badge } from "@/components/ui/badge";
import { Shield, Activity } from "lucide-react";

export default function AlertsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight dark:text-white">
            Anomaly Detection
          </h1>
          <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
            AI-powered monitoring and alerts for your metrics
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="default" className="gap-1.5">
            <Shield className="h-3 w-3" />
            Monitoring Active
          </Badge>
          <Badge variant="outline" className="gap-1.5">
            <Activity className="h-3 w-3" />
            Real-time
          </Badge>
        </div>
      </div>

      {/* Alerts Component */}
      <AnomalyAlerts />
    </div>
  );
}
