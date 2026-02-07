"use client";

import { CSVUpload } from "@/components/upload/csv-upload";
import { Badge } from "@/components/ui/badge";
import { Upload, Sparkles } from "lucide-react";

export default function UploadPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight dark:text-white">
            Data Upload
          </h1>
          <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
            Upload CSV files and get instant visualizations
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="default" className="gap-1.5">
            <Sparkles className="h-3 w-3" />
            Auto-Detect Columns
          </Badge>
          <Badge variant="outline" className="gap-1.5">
            <Upload className="h-3 w-3" />
            CSV Support
          </Badge>
        </div>
      </div>

      {/* Upload Component */}
      <CSVUpload />
    </div>
  );
}
