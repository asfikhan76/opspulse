"use client";

import { ReportGenerator } from "@/components/reports/report-generator";
import { Badge } from "@/components/ui/badge";
import { FileText, Sparkles } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight dark:text-white">
            Report Generator
          </h1>
          <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
            Generate comprehensive business reports with AI insights
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="default" className="gap-1.5">
            <Sparkles className="h-3 w-3" />
            AI-Generated
          </Badge>
          <Badge variant="outline" className="gap-1.5">
            <FileText className="h-3 w-3" />
            PDF Export
          </Badge>
        </div>
      </div>

      {/* Report Generator */}
      <ReportGenerator />
    </div>
  );
}
