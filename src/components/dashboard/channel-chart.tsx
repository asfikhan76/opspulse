"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { channelData } from "@/lib/data";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: payload[0].payload.color }}
          />
          <span className="text-sm text-slate-900 font-medium dark:text-white">
            {payload[0].name}
          </span>
        </div>
        <p className="text-lg font-bold text-slate-900 mt-1 dark:text-white">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export function ChannelChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Traffic Sources</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <PieChart>
              <Pie
                data={channelData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {channelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Legend */}
        <div className="space-y-2 mt-4">
          {channelData.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-500 dark:text-slate-400">{item.name}</span>
              </div>
              <span className="font-medium text-slate-900 dark:text-white">{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
