"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Bell, Moon, Sun, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSidebar } from "@/components/layout/sidebar";

export function Header() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { setMobileOpen } = useSidebar();
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchValue.trim()) {
      router.push(`/query?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue("");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-xl px-6 dark:border-slate-800 dark:bg-slate-950/80">
      {/* Left side: mobile menu + search */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5 text-slate-500" />
        </Button>
        <div className="relative hidden sm:block w-48 md:w-64 lg:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            placeholder="Search metrics, reports, data..."
            className="pl-10 bg-slate-50 border-slate-200 dark:bg-slate-900/50 dark:border-slate-800"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Live indicator */}
        <div className="hidden sm:flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-emerald-400">Live</span>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative" onClick={() => router.push('/alerts')}>
          <Bell className="h-5 w-5 text-slate-400" />
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
            3
          </span>
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-slate-400" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-slate-400" />
        </Button>

        {/* User */}
        <div className="flex items-center gap-3 rounded-lg bg-slate-100 px-3 py-1.5 dark:bg-slate-800/50">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
            <span className="text-sm font-bold text-white">A</span>
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-medium text-slate-900 dark:text-white">Admin</span>
            <Badge variant="default" className="text-[10px] px-1.5 py-0">Pro</Badge>
          </div>
        </div>
      </div>
    </header>
  );
}
