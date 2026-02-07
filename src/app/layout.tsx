import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar, SidebarProvider } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { AppShell } from "@/components/layout/app-shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpsPulse — AI-Powered Business Command Center",
  description:
    "Real-time operational intelligence dashboard with AI-powered analytics, natural language querying, anomaly detection, and automated reporting.",
  keywords: ["dashboard", "analytics", "AI", "business intelligence", "operations", "Gemini", "data ops"],
  authors: [{ name: "OpsPulse Team" }],
  openGraph: {
    title: "OpsPulse — AI-Powered Business Command Center",
    description: "Transform raw business data into actionable insights with AI. Natural language queries, smart CSV analysis, anomaly detection, and executive report generation.",
    type: "website",
    siteName: "OpsPulse",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpsPulse — AI-Powered Business Command Center",
    description: "Transform raw business data into actionable insights with AI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <SidebarProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <AppShell>
                <Header />
                <main className="flex-1 min-w-0 p-6">{children}</main>
              </AppShell>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
