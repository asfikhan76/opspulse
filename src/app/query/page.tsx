"use client";

import { NLQueryInterface } from "@/components/query/nl-query-interface";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Database } from "lucide-react";

export default function QueryPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight dark:text-white">
            AI Query
          </h1>
          <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
            Ask questions about your data in natural language
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="default" className="gap-1.5">
            <Sparkles className="h-3 w-3" />
            AI Powered
          </Badge>
          <Badge variant="outline" className="gap-1.5">
            <Database className="h-3 w-3" />
            Connected
          </Badge>
        </div>
      </div>

      {/* Query Interface */}
      <NLQueryInterface />
    </div>
  );
}
