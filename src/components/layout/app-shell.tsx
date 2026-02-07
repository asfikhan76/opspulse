"use client";

import { useSidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <div
      className={cn(
        "flex flex-1 flex-col min-w-0 overflow-hidden transition-all duration-300",
        collapsed ? "lg:ml-[72px]" : "lg:ml-64"
      )}
    >
      {children}
    </div>
  );
}
