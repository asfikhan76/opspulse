"use client";

import React from "react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { monthlyData, weeklyData, channelData } from "@/lib/data";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-medium text-slate-900 mb-2 dark:text-white">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-500 dark:text-slate-400">{entry.name}:</span>
            <span className="font-medium text-slate-900 dark:text-white">
              {typeof entry.value === "number" && entry.value > 1000
                ? `$${(entry.value / 1000).toFixed(0)}K`
                : entry.value?.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight dark:text-white">
            Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
            Deep dive into your business metrics
          </p>
        </div>
        <Badge variant="outline">Last 12 months</Badge>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total Revenue",
            value: "$2.95M",
            change: 18.2,
            icon: DollarSign,
            color: "cyan",
          },
          {
            label: "Total Orders",
            value: "46,800",
            change: 24.5,
            icon: BarChart3,
            color: "violet",
          },
          {
            label: "Total Users",
            value: "253K",
            change: 36.7,
            icon: Users,
            color: "emerald",
          },
          {
            label: "Growth Rate",
            value: "12.5%",
            change: 3.2,
            icon: TrendingUp,
            color: "amber",
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div
                  className={`h-9 w-9 rounded-lg bg-${stat.color}-500/10 flex items-center justify-center`}
                >
                  <stat.icon className={`h-5 w-5 text-${stat.color}-400`} />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-medium ${
                    stat.change >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {stat.change >= 0 ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {stat.change}%
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3 dark:text-slate-400">{stat.label}</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue vs Profit Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Revenue vs Profit Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="area">
            <TabsList>
              <TabsTrigger value="area">Area</TabsTrigger>
              <TabsTrigger value="bar">Bar</TabsTrigger>
              <TabsTrigger value="line">Line</TabsTrigger>
            </TabsList>
            <TabsContent value="area">
              <div className="h-[350px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="aRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="aProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="aOrders" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={12} tickLine={false} tickFormatter={(v) => `$${v / 1000}K`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: "12px", color: "#94a3b8" }} />
                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#06b6d4" fill="url(#aRevenue)" strokeWidth={2} />
                    <Area type="monotone" dataKey="profit" name="Profit" stroke="#8b5cf6" fill="url(#aProfit)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="bar">
              <div className="h-[350px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={12} tickLine={false} tickFormatter={(v) => `$${v / 1000}K`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar dataKey="revenue" name="Revenue" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="profit" name="Profit" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="line">
              <div className="h-[350px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={12} tickLine={false} tickFormatter={(v) => `$${v / 1000}K`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="profit" name="Profit" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="orders" name="Orders" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Second row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">User Growth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                  <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={12} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="users" name="Active Users" stroke="#10b981" fill="url(#userGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Weekly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                  <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={12} tickLine={false} tickFormatter={(v) => `$${v / 1000}K`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Bar dataKey="revenue" name="Revenue" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit" name="Profit" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
