"use client";

import React, { useState, useCallback } from "react";
import Papa from "papaparse";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Upload,
  FileSpreadsheet,
  BarChart3,
  TrendingUp,
  Table,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  PieChart as PieChartIcon,
  Loader2,
  Brain,
  Lightbulb,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const chartColors = ["#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#f43f5e", "#ec4899"];

interface ParsedData {
  headers: string[];
  rows: Record<string, any>[];
  numericColumns: string[];
  categoricalColumns: string[];
  fileName: string;
  rowCount: number;
}

interface AIAnalysis {
  summary: string;
  insights: string[];
  recommendations: string[];
  anomalies: string[];
  suggestedChartType: string;
  suggestedXAxis: string;
  suggestedYAxis: string[];
}

export function CSVUpload() {
  const [data, setData] = useState<ParsedData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedXAxis, setSelectedXAxis] = useState("");
  const [selectedYAxis, setSelectedYAxis] = useState<string[]>([]);
  const [chartType, setChartType] = useState<"bar" | "line" | "area" | "pie">("bar");
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const processFile = useCallback((file: File) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || [];
        const rows = results.data as Record<string, any>[];

        const numericColumns = headers.filter((h) =>
          rows.some(
            (row) => typeof row[h] === "number" && !isNaN(row[h])
          )
        );
        const categoricalColumns = headers.filter(
          (h) => !numericColumns.includes(h)
        );

        const parsed: ParsedData = {
          headers,
          rows,
          numericColumns,
          categoricalColumns,
          fileName: file.name,
          rowCount: rows.length,
        };

        setData(parsed);
        // Auto-select axis
        if (categoricalColumns.length > 0) setSelectedXAxis(categoricalColumns[0]);
        else if (headers.length > 0) setSelectedXAxis(headers[0]);
        if (numericColumns.length > 0)
          setSelectedYAxis([numericColumns[0]]);

        // Trigger AI analysis
        analyzeWithAI(parsed);
      },
    });
  }, []);

  const analyzeWithAI = async (parsed: ParsedData) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/analyze-csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headers: parsed.headers,
          rows: parsed.rows,
          fileName: parsed.fileName,
        }),
      });
      const result = await res.json();
      setAiAnalysis(result);

      // Apply AI suggestions if available
      if (result.suggestedChartType) {
        const ct = result.suggestedChartType as "bar" | "line" | "area" | "pie";
        if (["bar", "line", "area", "pie"].includes(ct)) setChartType(ct);
      }
      if (result.suggestedXAxis && parsed.headers.includes(result.suggestedXAxis)) {
        setSelectedXAxis(result.suggestedXAxis);
      }
      if (result.suggestedYAxis?.length > 0) {
        const validYAxis = result.suggestedYAxis.filter((y: string) => parsed.numericColumns.includes(y));
        if (validYAxis.length > 0) setSelectedYAxis(validYAxis);
      }
    } catch (error) {
      console.error("AI analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && (file.name.endsWith(".csv") || file.type === "text/csv")) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const toggleYAxis = (col: string) => {
    setSelectedYAxis((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const chartData = data
    ? data.rows.map((row) => {
        const point: Record<string, any> = { name: String(row[selectedXAxis] || "") };
        selectedYAxis.forEach((col) => {
          point[col] = Number(row[col]) || 0;
        });
        return point;
      })
    : [];

  // For pie chart, aggregate by category
  const pieData = data
    ? (() => {
        const agg: Record<string, number> = {};
        data.rows.forEach((row) => {
          const key = String(row[selectedXAxis] || "Other");
          const val = Number(row[selectedYAxis[0]] || 0);
          agg[key] = (agg[key] || 0) + val;
        });
        return Object.entries(agg).map(([name, value]) => ({ name, value }));
      })()
    : [];

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      {!data && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-16 transition-all duration-300",
            isDragging
              ? "border-cyan-500 bg-cyan-500/5 scale-[1.02]"
              : "border-slate-300 bg-slate-50/50 hover:border-slate-400 hover:bg-slate-100/50 dark:border-slate-700 dark:bg-slate-900/30 dark:hover:border-slate-600 dark:hover:bg-slate-900/50"
          )}
        >
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
            <Upload className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2 dark:text-white">
            Upload your data
          </h3>
          <p className="text-sm text-slate-500 mb-6 text-center max-w-md dark:text-slate-400">
            Drag and drop a CSV file here, or click to browse. Your data will be
            instantly visualized with auto-detected charts.
          </p>
          <label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="hidden"
            />
            <Button variant="gradient" className="cursor-pointer" asChild>
              <span>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Browse Files
              </span>
            </Button>
          </label>
          <div className="flex items-center gap-4 mt-6">
            <Badge variant="outline">
              <CheckCircle className="h-3 w-3 mr-1 text-emerald-400" />
              CSV format
            </Badge>
            <Badge variant="outline">
              <Sparkles className="h-3 w-3 mr-1 text-cyan-400" />
              Auto-detect columns
            </Badge>
          </div>
        </div>
      )}

      {/* Data loaded */}
      {data && (
        <>
          {/* File info bar */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {data.fileName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {data.rowCount} rows · {data.headers.length} columns ·{" "}
                  {data.numericColumns.length} numeric
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => {
                if (!data) return;
                const csvContent = [
                  data.headers.join(','),
                  ...data.rows.map(r => data.headers.map(h => {
                    const val = String(r[h] ?? '');
                    return val.includes(',') ? `"${val}"` : val;
                  }).join(','))
                ].join('\n');
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = data.fileName || 'export.csv';
                a.click();
                URL.revokeObjectURL(url);
              }}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setData(null);
                  setSelectedXAxis("");
                  setSelectedYAxis([]);
                  setAiAnalysis(null);
                }}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>

          {/* AI Analysis Panel */}
          {(isAnalyzing || aiAnalysis) && (
            <Card className="border-cyan-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Brain className="h-4 w-4 text-cyan-400" />
                  AI Analysis
                  {isAnalyzing && <Loader2 className="h-3 w-3 animate-spin text-cyan-400" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isAnalyzing && !aiAnalysis && (
                  <div className="flex items-center gap-3 py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Analyzing your dataset with AI...
                    </span>
                  </div>
                )}
                {aiAnalysis && (
                  <div className="space-y-4">
                    {/* Summary */}
                    <p className="text-sm text-slate-600 dark:text-slate-300">{aiAnalysis.summary}</p>
                    
                    {/* Insights */}
                    {aiAnalysis.insights?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 dark:text-slate-400">
                          Key Insights
                        </h4>
                        <div className="space-y-1.5">
                          {aiAnalysis.insights.map((insight, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs">
                              <Lightbulb className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                              <span className="text-slate-600 dark:text-slate-300">{insight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Recommendations */}
                    {aiAnalysis.recommendations?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 dark:text-slate-400">
                          Recommendations
                        </h4>
                        <div className="space-y-1.5">
                          {aiAnalysis.recommendations.map((rec, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs">
                              <Zap className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                              <span className="text-slate-600 dark:text-slate-300">{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Anomalies */}
                    {aiAnalysis.anomalies?.length > 0 && aiAnalysis.anomalies[0] && (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 dark:text-slate-400">
                          Anomalies Detected
                        </h4>
                        <div className="space-y-1.5">
                          {aiAnalysis.anomalies.map((anomaly, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs">
                              <AlertCircle className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5" />
                              <span className="text-slate-600 dark:text-slate-300">{anomaly}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Controls */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-sm">Chart Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Chart Type */}
                <div>
                  <label className="text-xs text-slate-500 mb-2 block dark:text-slate-400">
                    Chart Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { type: "bar" as const, icon: BarChart3, label: "Bar" },
                      { type: "line" as const, icon: TrendingUp, label: "Line" },
                      { type: "area" as const, icon: TrendingUp, label: "Area" },
                      { type: "pie" as const, icon: PieChartIcon, label: "Pie" },
                    ].map((ct) => (
                      <button
                        key={ct.type}
                        onClick={() => setChartType(ct.type)}
                        className={cn(
                          "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all cursor-pointer",
                          chartType === ct.type
                            ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                            : "border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                        )}
                      >
                        <ct.icon className="h-3.5 w-3.5" />
                        {ct.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* X Axis */}
                <div>
                  <label className="text-xs text-slate-500 mb-2 block dark:text-slate-400">
                    X-Axis (Category)
                  </label>
                  <div className="space-y-1">
                    {data.headers.map((col) => (
                      <button
                        key={col}
                        onClick={() => setSelectedXAxis(col)}
                        className={cn(
                          "w-full text-left rounded-lg px-3 py-1.5 text-xs transition-all cursor-pointer",
                          selectedXAxis === col
                            ? "bg-cyan-500/10 text-cyan-400"
                            : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                        )}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Y Axis */}
                <div>
                  <label className="text-xs text-slate-500 mb-2 block dark:text-slate-400">
                    Y-Axis (Values)
                  </label>
                  <div className="space-y-1">
                    {data.numericColumns.map((col) => (
                      <button
                        key={col}
                        onClick={() => toggleYAxis(col)}
                        className={cn(
                          "w-full text-left rounded-lg px-3 py-1.5 text-xs transition-all cursor-pointer",
                          selectedYAxis.includes(col)
                            ? "bg-violet-500/10 text-violet-400"
                            : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                        )}
                      >
                        {selectedYAxis.includes(col) && (
                          <CheckCircle className="h-3 w-3 inline mr-1" />
                        )}
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Visualization */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  Auto-Generated Visualization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="chart">
                  <TabsList>
                    <TabsTrigger value="chart">
                      <BarChart3 className="h-3.5 w-3.5 mr-1" />
                      Chart
                    </TabsTrigger>
                    <TabsTrigger value="table">
                      <Table className="h-3.5 w-3.5 mr-1" />
                      Table
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="chart">
                    <div className="h-[400px] mt-4">
                      {chartType === "bar" && (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                            <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} angle={-25} textAnchor="end" height={60} />
                            <YAxis stroke="#475569" fontSize={11} tickLine={false} />
                            <Tooltip
                            />
                            <Legend wrapperStyle={{ fontSize: "12px" }} />
                            {selectedYAxis.map((col, i) => (
                              <Bar key={col} dataKey={col} fill={chartColors[i % chartColors.length]} radius={[4, 4, 0, 0]} />
                            ))}
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                      {chartType === "line" && (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                            <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} angle={-25} textAnchor="end" height={60} />
                            <YAxis stroke="#475569" fontSize={11} tickLine={false} />
                            <Tooltip
                            />
                            <Legend wrapperStyle={{ fontSize: "12px" }} />
                            {selectedYAxis.map((col, i) => (
                              <Line key={col} type="monotone" dataKey={col} stroke={chartColors[i % chartColors.length]} strokeWidth={2} dot={{ r: 3 }} />
                            ))}
                          </LineChart>
                        </ResponsiveContainer>
                      )}
                      {chartType === "area" && (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <defs>
                              {selectedYAxis.map((col, i) => (
                                <linearGradient key={col} id={`grad-${col}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={chartColors[i % chartColors.length]} stopOpacity={0.3} />
                                  <stop offset="95%" stopColor={chartColors[i % chartColors.length]} stopOpacity={0} />
                                </linearGradient>
                              ))}
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                            <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} angle={-25} textAnchor="end" height={60} />
                            <YAxis stroke="#475569" fontSize={11} tickLine={false} />
                            <Tooltip
                            />
                            <Legend wrapperStyle={{ fontSize: "12px" }} />
                            {selectedYAxis.map((col, i) => (
                              <Area key={col} type="monotone" dataKey={col} stroke={chartColors[i % chartColors.length]} fill={`url(#grad-${col})`} strokeWidth={2} />
                            ))}
                          </AreaChart>
                        </ResponsiveContainer>
                      )}
                      {chartType === "pie" && (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={120}
                              paddingAngle={3}
                              dataKey="value"
                              stroke="none"
                              label={({ name, percent }: any) =>
                                `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
                              }
                              labelLine={{ stroke: "#475569" }}
                            >
                              {pieData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                              ))}
                            </Pie>
                            <Tooltip
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="table">
                    <ScrollArea className="h-[400px] mt-4">
                      <div className="rounded-lg border border-slate-200 overflow-x-auto overflow-hidden dark:border-slate-800">
                        <table className="w-full text-sm min-w-[600px]">
                          <thead>
                            <tr className="border-b border-slate-200 bg-slate-100/50 dark:border-slate-800 dark:bg-slate-800/50">
                              {data.headers.map((h) => (
                                <th
                                  key={h}
                                  className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {data.rows.slice(0, 50).map((row, i) => (
                              <tr
                                key={i}
                                className="border-b border-slate-100 hover:bg-slate-50 transition-colors dark:border-slate-800/50 dark:hover:bg-slate-800/30"
                              >
                                {data.headers.map((h) => (
                                  <td
                                    key={h}
                                    className="px-4 py-2.5 text-slate-600 dark:text-slate-300"
                                  >
                                    {String(row[h] ?? "")}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {data.rows.length > 50 && (
                        <p className="text-xs text-slate-500 text-center mt-2">
                          Showing first 50 of {data.rows.length} rows
                        </p>
                      )}
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {data.numericColumns.slice(0, 4).map((col) => {
              const values = data.rows
                .map((r) => Number(r[col]))
                .filter((v) => !isNaN(v));
              const sum = values.reduce((a, b) => a + b, 0);
              const avg = sum / values.length;
              const max = Math.max(...values);
              const min = Math.min(...values);

              return (
                <Card key={col}>
                  <CardContent className="p-4">
                    <p className="text-xs text-slate-500 mb-1 dark:text-slate-400">{col}</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {avg.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      avg · min {min.toLocaleString()} · max{" "}
                      {max.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
