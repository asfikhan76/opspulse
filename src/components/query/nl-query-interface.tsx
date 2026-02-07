"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { nlQuerySuggestions, nlQueryResponses } from "@/lib/data";
import {
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  MessageSquare,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  chartType?: "bar" | "line" | "pie" | "area";
  chartData?: Record<string, string | number>[];
  timestamp: string;
}

const pieColors = ["#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#f43f5e"];

function ChartRenderer({
  type,
  data,
}: {
  type: string;
  data: Record<string, string | number>[];
}) {
  const numericKeys = Object.keys(data[0] || {}).filter((k) => k !== "name");

  if (type === "pie") {
    return (
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
            ))}
          </Pie>
          <Tooltip
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (type === "bar") {
    return (
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
          <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} />
          <YAxis stroke="#475569" fontSize={12} tickLine={false} />
          <Tooltip
          />
          {numericKeys.map((key, i) => (
            <Bar
              key={key}
              dataKey={key}
              fill={pieColors[i % pieColors.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === "line") {
    return (
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
          <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} />
          <YAxis stroke="#475569" fontSize={12} tickLine={false} />
          <Tooltip
          />
          {numericKeys.map((key, i) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={pieColors[i % pieColors.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }

  // area (default)
  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="queryAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
        <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} />
        <YAxis stroke="#475569" fontSize={12} tickLine={false} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey={numericKeys[0] || "value"}
          stroke="#06b6d4"
          fill="url(#queryAreaGrad)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function matchQuery(query: string): {
  response: string;
  chartType: "bar" | "line" | "pie" | "area";
  data: Record<string, string | number>[];
} | null {
  const q = query.toLowerCase();
  if ((q.includes("revenue") || q.includes("sales")) && q.includes("trend"))
    return nlQueryResponses.revenue;
  if (q.includes("region") || q.includes("top performing"))
    return nlQueryResponses.region;
  if (q.includes("order") && (q.includes("revenue") || q.includes("compare")))
    return nlQueryResponses.orders;
  if (q.includes("user") || q.includes("growth"))
    return nlQueryResponses.users;
  if (q.includes("conversion"))
    return nlQueryResponses.conversion;
  if (q.includes("channel") || q.includes("source") || q.includes("traffic"))
    return nlQueryResponses.channel;
  if (q.includes("weekly") || q.includes("week"))
    return nlQueryResponses.weekly;
  if (q.includes("day"))
    return nlQueryResponses.day;
  if (q.includes("order") || q.includes("orders"))
    return nlQueryResponses.orders;
  if (q.includes("revenue") || q.includes("sales"))
    return nlQueryResponses.revenue;
  return nlQueryResponses.revenue;
}

export function NLQueryInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (query: string) => {
    if (!query.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      
      const result = await res.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: result.response + (result.insight ? `\n\n💡 **Insight:** ${result.insight}` : ""),
        chartType: result.chartType,
        chartData: result.data,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      // Fallback to local matching if API fails
      const result = matchQuery(query);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: result?.response || "I analyzed your query and here are the results.",
        chartType: result?.chartType,
        chartData: result?.data,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(input);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-auto px-2 space-y-4 pb-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2 dark:text-white">
              Ask anything about your data
            </h3>
            <p className="text-sm text-slate-500 max-w-md mb-6 dark:text-slate-400">
              Use natural language to query your metrics, generate charts, and
              discover insights. Try one of the suggestions below.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl">
              {nlQuerySuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSubmit(suggestion)}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white/50 px-4 py-3 text-left text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300 transition-all duration-200 cursor-pointer dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white dark:hover:border-slate-700"
                >
                  <Lightbulb className="h-4 w-4 text-amber-400 shrink-0" />
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.role === "assistant" && (
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center shrink-0 mt-1">
                <Bot className="h-4 w-4 text-white" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-xl p-4",
                message.role === "user"
                  ? "bg-cyan-600 text-white"
                  : "bg-slate-100 border border-slate-200 dark:bg-slate-800/50 dark:border-slate-700"
              )}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              {message.chartData && message.chartType && (
                <Card className="mt-3 bg-white/80 border-slate-200 dark:bg-slate-900/80 dark:border-slate-700">
                  <CardContent className="p-4">
                    <ChartRenderer
                      type={message.chartType}
                      data={message.chartData}
                    />
                  </CardContent>
                </Card>
              )}
              <p className="text-[10px] mt-2 opacity-50">{message.timestamp}</p>
            </div>
            {message.role === "user" && (
              <div className="h-8 w-8 rounded-lg bg-slate-200 flex items-center justify-center shrink-0 mt-1 dark:bg-slate-700">
                <User className="h-4 w-4 text-slate-500 dark:text-slate-300" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 dark:bg-slate-800/50 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Analyzing your data...
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 pt-4 mt-auto dark:border-slate-800">
        <div className="flex items-end gap-3">
          <div className="relative flex-1">
            <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your data... (e.g., 'Show me revenue trends')"
              className="flex w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 resize-none min-h-[48px] max-h-[120px] dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500"
              rows={1}
            />
          </div>
          <Button
            onClick={() => handleSubmit(input)}
            disabled={!input.trim() || isLoading}
            variant="gradient"
            size="icon"
            className="h-12 w-12 rounded-xl"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="text-[10px]">
            <Sparkles className="h-3 w-3 mr-1" /> AI-Powered
          </Badge>
          <span className="text-[10px] text-slate-600">
            Press Enter to send, Shift+Enter for new line
          </span>
        </div>
      </div>
    </div>
  );
}
