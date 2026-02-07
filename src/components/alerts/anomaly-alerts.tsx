"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { anomalyAlerts } from "@/lib/data";
import { AnomalyAlert } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Bell,
  BellOff,
  Eye,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  Zap,
} from "lucide-react";

const severityConfig = {
  critical: {
    icon: AlertCircle,
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
    textColor: "text-rose-400",
    badge: "danger" as const,
    pulseColor: "bg-rose-500",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    textColor: "text-amber-400",
    badge: "warning" as const,
    pulseColor: "bg-amber-500",
  },
  info: {
    icon: Info,
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
    textColor: "text-cyan-400",
    badge: "default" as const,
    pulseColor: "bg-cyan-500",
  },
};

const statusConfig = {
  active: { label: "Active", color: "text-rose-400", bg: "bg-rose-500/10" },
  acknowledged: {
    label: "Acknowledged",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  resolved: {
    label: "Resolved",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
};

export function AnomalyAlerts() {
  const [alerts, setAlerts] = useState<AnomalyAlert[]>(anomalyAlerts);
  const [filter, setFilter] = useState<"all" | "active" | "acknowledged" | "resolved">("all");

  const filteredAlerts =
    filter === "all" ? alerts : alerts.filter((a) => a.status === filter);

  const activeCount = alerts.filter((a) => a.status === "active").length;
  const acknowledgedCount = alerts.filter((a) => a.status === "acknowledged").length;
  const resolvedCount = alerts.filter((a) => a.status === "resolved").length;

  const updateStatus = (
    id: string,
    newStatus: "active" | "acknowledged" | "resolved"
  ) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-rose-500/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-rose-500/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-rose-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{activeCount}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Active Alerts</p>
            </div>
            {activeCount > 0 && (
              <div className="ml-auto h-3 w-3 rounded-full bg-rose-500 animate-pulse" />
            )}
          </CardContent>
        </Card>
        <Card className="border-amber-500/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Eye className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {acknowledgedCount}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Acknowledged</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-emerald-500/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{resolvedCount}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Resolved</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-violet-500/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {((resolvedCount / alerts.length) * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Resolution Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Tabs
          defaultValue="all"
          onValueChange={(v) => setFilter(v as any)}
        >
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="all">
              All ({alerts.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              <span className="h-2 w-2 rounded-full bg-rose-500 mr-1.5" />
              Active ({activeCount})
            </TabsTrigger>
            <TabsTrigger value="acknowledged">
              Acknowledged ({acknowledgedCount})
            </TabsTrigger>
            <TabsTrigger value="resolved">
              Resolved ({resolvedCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => alert('Alert configuration coming soon!')}>
            <Bell className="h-4 w-4 mr-1" />
            Configure
          </Button>
          <Button variant="outline" size="sm" onClick={() => alert('All alerts muted for 1 hour')}>
            <BellOff className="h-4 w-4 mr-1" />
            Mute All
          </Button>
        </div>
      </div>

      {/* Alert List */}
      <ScrollArea className="h-[calc(100vh-24rem)]">
        <div className="space-y-3">
          {filteredAlerts.map((alert) => {
            const config = severityConfig[alert.severity];
            const status = statusConfig[alert.status];
            const SeverityIcon = config.icon;
            const isPositive = alert.metric === "Revenue" || alert.metric === "Traffic Volume";

            return (
              <Card
                key={alert.id}
                className={cn(
                  "transition-all duration-200 hover:shadow-lg",
                  config.borderColor,
                  alert.status === "resolved" && "opacity-60"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                        config.bgColor
                      )}
                    >
                      <SeverityIcon className={cn("h-5 w-5", config.textColor)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                          {alert.metric}
                        </h4>
                        <Badge variant={config.badge}>
                          {alert.severity}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={cn(status.color, status.bg)}
                        >
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {alert.message}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Activity className="h-3 w-3" />
                          Value: {alert.value}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Zap className="h-3 w-3" />
                          Expected: {alert.expected}
                        </div>
                        <div
                          className={cn(
                            "flex items-center gap-1 text-xs",
                            isPositive ? "text-emerald-400" : "text-rose-400"
                          )}
                        >
                          {isPositive ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {alert.deviation}% deviation
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="h-3 w-3" />
                          {new Date(alert.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 shrink-0 flex-col sm:flex-row">
                      {alert.status === "active" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateStatus(alert.id, "acknowledged")
                          }
                        >
                          Acknowledge
                        </Button>
                      )}
                      {alert.status !== "resolved" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => updateStatus(alert.id, "resolved")}
                        >
                          <CheckCircle className="h-3.5 w-3.5 mr-1" />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
