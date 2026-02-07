"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
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
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { monthlyData, kpiData } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  FileText,
  Download,
  Calendar,
  CheckSquare,
  Clock,
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Loader2,
  CheckCircle,
  Sparkles,
  FileDown,
} from "lucide-react";

interface GeneratedReport {
  id: string;
  title: string;
  dateRange: string;
  generatedAt: string;
  status: "generating" | "ready";
  sections: string[];
  progress: number;
  content?: string;
}

export function ReportGenerator() {
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [title, setTitle] = useState("");
  const [dateRange, setDateRange] = useState("last-30");
  const [selectedSections, setSelectedSections] = useState<string[]>([
    "executive-summary",
    "revenue",
    "kpis",
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeReportContent, setActiveReportContent] = useState<string | null>(null);

  const sections = [
    { id: "executive-summary", label: "Executive Summary", icon: FileText },
    { id: "revenue", label: "Revenue Analysis", icon: DollarSign },
    { id: "kpis", label: "KPI Overview", icon: BarChart3 },
    { id: "users", label: "User Analytics", icon: Users },
    { id: "trends", label: "Trend Analysis", icon: TrendingUp },
    { id: "recommendations", label: "AI Recommendations", icon: Sparkles },
  ];

  const dateRanges = [
    { id: "last-7", label: "Last 7 days" },
    { id: "last-30", label: "Last 30 days" },
    { id: "last-90", label: "Last 90 days" },
    { id: "last-365", label: "Last 12 months" },
  ];

  const toggleSection = (id: string) => {
    setSelectedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const generateReport = async () => {
    setIsGenerating(true);
    const reportId = Date.now().toString();
    const reportTitle = title || "Business Performance Report";
    const reportDateRange = dateRanges.find((d) => d.id === dateRange)?.label || "Last 30 days";
    
    const report: GeneratedReport = {
      id: reportId,
      title: reportTitle,
      dateRange: reportDateRange,
      generatedAt: new Date().toLocaleString(),
      status: "generating",
      sections: selectedSections,
      progress: 0,
    };

    setReports((prev) => [report, ...prev]);

    // Show progress while AI generates
    const progressInterval = setInterval(() => {
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId && r.status === "generating"
            ? { ...r, progress: Math.min(r.progress + 5, 90) }
            : r
        )
      );
    }, 400);

    try {
      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: reportTitle,
          dateRange: reportDateRange,
          sections: selectedSections,
        }),
      });
      
      const result = await res.json();
      
      clearInterval(progressInterval);
      
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? { ...r, progress: 100, status: "ready", content: result.content }
            : r
        )
      );
      setActiveReportContent(result.content);
    } catch (error) {
      clearInterval(progressInterval);
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? { ...r, progress: 100, status: "ready", content: "Failed to generate report. Please check your API key configuration." }
            : r
        )
      );
    }
    
    setIsGenerating(false);
    setTitle("");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-cyan-400" />
              Report Config
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Title */}
            <div>
              <label className="text-xs text-slate-500 mb-2 block dark:text-slate-400">
                Report Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Business Performance Report"
              />
            </div>

            {/* Date Range */}
            <div>
              <label className="text-xs text-slate-500 mb-2 block dark:text-slate-400">
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                {dateRanges.map((dr) => (
                  <button
                    key={dr.id}
                    onClick={() => setDateRange(dr.id)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-xs font-medium transition-all cursor-pointer",
                      dateRange === dr.id
                        ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                        : "border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                    )}
                  >
                    <Calendar className="h-3 w-3 inline mr-1" />
                    {dr.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sections */}
            <div>
              <label className="text-xs text-slate-500 mb-2 block dark:text-slate-400">
                Include Sections
              </label>
              <div className="space-y-1.5">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => toggleSection(s.id)}
                    className={cn(
                      "w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-all cursor-pointer",
                      selectedSections.includes(s.id)
                        ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                        : "text-slate-500 hover:bg-slate-100 border border-transparent dark:text-slate-400 dark:hover:bg-slate-800"
                    )}
                  >
                    <CheckSquare
                      className={cn(
                        "h-3.5 w-3.5",
                        selectedSections.includes(s.id)
                          ? "text-violet-400"
                          : "text-slate-600"
                      )}
                    />
                    <s.icon className="h-3.5 w-3.5" />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={generateReport}
              disabled={isGenerating || selectedSections.length === 0}
              variant="gradient"
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Report
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Report Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Preview Header */}
              <div className="rounded-xl border border-slate-200 bg-slate-100/50 p-6 dark:border-slate-800 dark:bg-slate-800/30">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="default">
                    <Sparkles className="h-3 w-3 mr-1" /> AI-Generated
                  </Badge>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-2 dark:text-white">
                  {title || "Business Performance Report"}
                </h2>
                <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
                  {dateRanges.find((d) => d.id === dateRange)?.label} •{" "}
                  {selectedSections.length} sections
                </p>
              </div>

              {/* AI Generated Content */}
              {activeReportContent ? (
                <ScrollArea className="h-[500px]">
                  <div className="prose prose-sm dark:prose-invert max-w-none pr-4">
                    <div className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {activeReportContent.split('\n').map((line, i) => {
                        if (line.startsWith('# ')) return <h2 key={i} className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2">{line.slice(2)}</h2>;
                        if (line.startsWith('## ')) return <h3 key={i} className="text-base font-semibold text-slate-800 dark:text-slate-200 mt-3 mb-2">{line.slice(3)}</h3>;
                        if (line.startsWith('### ')) return <h4 key={i} className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-2 mb-1">{line.slice(4)}</h4>;
                        if (line.startsWith('- ') || line.startsWith('* ')) return <div key={i} className="flex items-start gap-2 ml-2 my-0.5"><span className="text-cyan-400 mt-1">•</span><span>{line.slice(2)}</span></div>;
                        if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-semibold my-1">{line.slice(2, -2)}</p>;
                        if (line.trim() === '') return <div key={i} className="h-2" />;
                        return <p key={i} className="my-0.5">{line}</p>;
                      })}
                    </div>
                  </div>
                </ScrollArea>
              ) : (
                <>
                  {/* Static KPIs Preview when no AI content */}
                  {selectedSections.includes("kpis") && (
                <div>
                  <h3 className="text-sm font-medium text-slate-600 mb-3 dark:text-slate-300">
                    Key Performance Indicators
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {kpiData.map((kpi, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-slate-200 bg-slate-100/50 p-3 dark:border-slate-800 dark:bg-slate-800/30"
                      >
                        <p className="text-xs text-slate-500 dark:text-slate-400">{kpi.title}</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{kpi.value}</p>
                        <Badge
                          variant={kpi.change >= 0 ? "success" : "danger"}
                          className="mt-1"
                        >
                          {kpi.change >= 0 ? "+" : ""}
                          {kpi.change}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chart Preview */}
              {selectedSections.includes("revenue") && (
                <div>
                  <h3 className="text-sm font-medium text-slate-600 mb-3 dark:text-slate-300">
                    Revenue Trend
                  </h3>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyData}>
                        <defs>
                          <linearGradient id="reportGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                        <XAxis
                          dataKey="name"
                          stroke="#475569"
                          fontSize={11}
                          tickLine={false}
                        />
                        <YAxis
                          stroke="#475569"
                          fontSize={11}
                          tickLine={false}
                          tickFormatter={(v) => `$${v / 1000}K`}
                        />
                        <Tooltip
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#06b6d4"
                          fill="url(#reportGrad)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {selectedSections.includes("recommendations") && (
                <div>
                  <h3 className="text-sm font-medium text-slate-600 mb-3 dark:text-slate-300">
                    AI Recommendations
                  </h3>
                  <div className="space-y-2">
                    {[
                      "Focus marketing spend on Thursday-Friday when conversion rates are highest",
                      "Investigate the conversion rate dip — currently 2.1% below target",
                      "Scale social media campaigns — fastest growing channel at 18% revenue share",
                      "Monitor database connection pool — approaching capacity limits",
                    ].map((rec, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-100/30 p-3 dark:border-slate-800 dark:bg-slate-800/20"
                      >
                        <Sparkles className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-600 dark:text-slate-300">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generated Reports */}
      {reports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Generated Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-lg border border-slate-200 bg-slate-100/30 p-4 dark:border-slate-800 dark:bg-slate-800/20"
                >
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center",
                      report.status === "ready"
                        ? "bg-emerald-500/10"
                        : "bg-cyan-500/10"
                    )}
                  >
                    {report.status === "ready" ? (
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <Loader2 className="h-5 w-5 text-cyan-400 animate-spin" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {report.title}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {report.dateRange}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {report.generatedAt}
                      </span>
                    </div>
                    {report.status === "generating" && (
                      <Progress
                        value={report.progress}
                        className="mt-2 h-1.5"
                      />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Badge
                      variant={
                        report.status === "ready" ? "success" : "default"
                      }
                    >
                      {report.status === "ready" ? "Ready" : `${report.progress}%`}
                    </Badge>
                    {report.status === "ready" && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setActiveReportContent(report.content || null)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => {
                          const content = report.content || `# ${report.title}\n\nGenerated: ${report.generatedAt}`;
                          const blob = new Blob([content], { type: 'text/markdown' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${report.title.replace(/\s+/g, '_')}.md`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}>
                          <FileDown className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
