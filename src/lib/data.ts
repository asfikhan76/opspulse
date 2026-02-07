import { KPIData, ChartDataPoint, ActivityItem, AnomalyAlert } from "./types";

export const kpiData: KPIData[] = [
  {
    title: "Total Revenue",
    value: "$284,592",
    change: 12.5,
    changeLabel: "vs last month",
    icon: "dollar-sign",
    trend: [40, 55, 45, 60, 75, 65, 80, 90, 85, 95, 100, 110],
  },
  {
    title: "Active Users",
    value: "24,891",
    change: 8.2,
    changeLabel: "vs last month",
    icon: "users",
    trend: [200, 220, 250, 240, 280, 310, 290, 320, 350, 340, 380, 400],
  },
  {
    title: "Conversion Rate",
    value: "3.24%",
    change: -2.1,
    changeLabel: "vs last month",
    icon: "target",
    trend: [3.1, 3.4, 3.2, 3.5, 3.3, 3.6, 3.4, 3.2, 3.1, 3.3, 3.2, 3.24],
  },
  {
    title: "Avg. Order Value",
    value: "$68.40",
    change: 5.7,
    changeLabel: "vs last month",
    icon: "shopping-cart",
    trend: [55, 58, 60, 62, 59, 63, 65, 61, 64, 66, 67, 68.4],
  },
];

export const monthlyData: ChartDataPoint[] = [
  { name: "Jan", revenue: 186000, profit: 42000, users: 18200, orders: 2800 },
  { name: "Feb", revenue: 205000, profit: 48000, users: 19100, orders: 3100 },
  { name: "Mar", revenue: 237000, profit: 55000, users: 20500, orders: 3600 },
  { name: "Apr", revenue: 215000, profit: 46000, users: 19800, orders: 3200 },
  { name: "May", revenue: 252000, profit: 62000, users: 21200, orders: 3800 },
  { name: "Jun", revenue: 268000, profit: 58000, users: 22400, orders: 4100 },
  { name: "Jul", revenue: 245000, profit: 52000, users: 21800, orders: 3700 },
  { name: "Aug", revenue: 278000, profit: 65000, users: 23100, orders: 4300 },
  { name: "Sep", revenue: 292000, profit: 72000, users: 24200, orders: 4600 },
  { name: "Oct", revenue: 275000, profit: 60000, users: 23500, orders: 4200 },
  { name: "Nov", revenue: 310000, profit: 78000, users: 25400, orders: 4900 },
  { name: "Dec", revenue: 284592, profit: 68000, users: 24891, orders: 4500 },
];

export const weeklyData: ChartDataPoint[] = [
  { name: "Mon", revenue: 42000, profit: 9800, users: 3400, orders: 680 },
  { name: "Tue", revenue: 38000, profit: 8500, users: 3100, orders: 620 },
  { name: "Wed", revenue: 45000, profit: 10200, users: 3600, orders: 720 },
  { name: "Thu", revenue: 51000, profit: 12000, users: 4100, orders: 820 },
  { name: "Fri", revenue: 48000, profit: 11200, users: 3800, orders: 760 },
  { name: "Sat", revenue: 35000, profit: 7800, users: 2800, orders: 560 },
  { name: "Sun", revenue: 28000, profit: 6200, users: 2200, orders: 440 },
];

export const channelData = [
  { name: "Direct", value: 35, color: "#06b6d4" },
  { name: "Organic Search", value: 28, color: "#8b5cf6" },
  { name: "Social Media", value: 18, color: "#10b981" },
  { name: "Email", value: 12, color: "#f59e0b" },
  { name: "Referral", value: 7, color: "#f43f5e" },
];

export const performanceData = [
  { name: "Page Load", current: 1.2, target: 1.5, unit: "s" },
  { name: "API Response", current: 245, target: 300, unit: "ms" },
  { name: "Error Rate", current: 0.12, target: 0.5, unit: "%" },
  { name: "Uptime", current: 99.98, target: 99.9, unit: "%" },
  { name: "Throughput", current: 1250, target: 1000, unit: "req/s" },
];

export const activityFeed: ActivityItem[] = [
  {
    id: "1",
    type: "alert",
    title: "Spike in API errors",
    description: "Error rate increased to 2.3% in the last 15 minutes",
    time: "2 min ago",
    icon: "alert-triangle",
  },
  {
    id: "2",
    type: "success",
    title: "Deployment successful",
    description: "v2.4.1 deployed to production",
    time: "15 min ago",
    icon: "check-circle",
  },
  {
    id: "3",
    type: "info",
    title: "New milestone reached",
    description: "Monthly active users exceeded 25,000",
    time: "1 hr ago",
    icon: "trophy",
  },
  {
    id: "4",
    type: "warning",
    title: "Storage usage high",
    description: "Database storage at 82% capacity",
    time: "2 hrs ago",
    icon: "hard-drive",
  },
  {
    id: "5",
    type: "success",
    title: "Revenue target hit",
    description: "Q4 revenue target achieved ahead of schedule",
    time: "3 hrs ago",
    icon: "trending-up",
  },
  {
    id: "6",
    type: "info",
    title: "Report generated",
    description: "Weekly performance report ready for review",
    time: "5 hrs ago",
    icon: "file-text",
  },
];

export const anomalyAlerts: AnomalyAlert[] = [
  {
    id: "a1",
    severity: "critical",
    metric: "Error Rate",
    message: "Error rate spiked to 2.3%, significantly above the 0.5% threshold",
    value: 2.3,
    expected: 0.12,
    deviation: 1816,
    timestamp: "2026-02-07T14:32:00Z",
    status: "active",
  },
  {
    id: "a2",
    severity: "warning",
    metric: "Response Time",
    message: "Average API response time increased to 480ms, above the 300ms SLA",
    value: 480,
    expected: 245,
    deviation: 96,
    timestamp: "2026-02-07T13:15:00Z",
    status: "active",
  },
  {
    id: "a3",
    severity: "warning",
    metric: "Memory Usage",
    message: "Server memory usage at 89%, approaching critical threshold",
    value: 89,
    expected: 65,
    deviation: 37,
    timestamp: "2026-02-07T12:45:00Z",
    status: "acknowledged",
  },
  {
    id: "a4",
    severity: "info",
    metric: "Traffic Volume",
    message: "Unusual traffic spike detected — 340% above normal for this time window",
    value: 4200,
    expected: 1250,
    deviation: 236,
    timestamp: "2026-02-07T11:00:00Z",
    status: "acknowledged",
  },
  {
    id: "a5",
    severity: "critical",
    metric: "Database Connections",
    message: "Connection pool utilization at 95%, risk of connection exhaustion",
    value: 95,
    expected: 60,
    deviation: 58,
    timestamp: "2026-02-07T10:20:00Z",
    status: "resolved",
  },
  {
    id: "a6",
    severity: "info",
    metric: "Revenue",
    message: "Daily revenue 28% higher than projected — positive anomaly detected",
    value: 12800,
    expected: 10000,
    deviation: 28,
    timestamp: "2026-02-07T09:00:00Z",
    status: "resolved",
  },
];

export const sampleCSVData = `Date,Revenue,Orders,Customers,Avg_Order_Value,Region
2026-01-01,12500,185,142,67.57,North
2026-01-02,11800,172,131,68.60,North
2026-01-03,13200,198,155,66.67,South
2026-01-04,14100,210,168,67.14,South
2026-01-05,10900,162,124,67.28,East
2026-01-06,15600,232,189,67.24,West
2026-01-07,11200,168,130,66.67,North
2026-01-08,13800,205,162,67.32,South
2026-01-09,12100,180,138,67.22,East
2026-01-10,16200,241,195,67.22,West
2026-01-11,14500,216,172,67.13,North
2026-01-12,13100,195,150,67.18,South
2026-01-13,11700,174,134,67.24,East
2026-01-14,15900,237,192,67.09,West
2026-01-15,12800,190,148,67.37,North`;

export const nlQuerySuggestions = [
  "Show me revenue trends for the last 12 months",
  "What are the top performing regions?",
  "Compare orders vs revenue by month",
  "Show user growth over time",
  "What's the conversion rate trend?",
  "Break down revenue by channel",
  "Show me the weekly sales pattern",
  "What day of the week has the most orders?",
];

export const nlQueryResponses: Record<string, { 
  response: string; 
  chartType: "bar" | "line" | "pie" | "area";
  data: Record<string, string | number>[];
}> = {
  revenue: {
    response: "Here's the revenue trend over the last 12 months. Revenue has grown 53% year-over-year, with the strongest growth in Q4.",
    chartType: "area",
    data: monthlyData.map(d => ({ name: d.name, value: d.revenue })),
  },
  region: {
    response: "Revenue breakdown by region shows West leading with 32% of total revenue, followed by South (28%), North (22%), and East (18%).",
    chartType: "pie",
    data: [
      { name: "West", value: 91068 },
      { name: "South", value: 79686 },
      { name: "North", value: 62610 },
      { name: "East", value: 51228 },
    ],
  },
  orders: {
    response: "Monthly orders have been steadily increasing, with a 60% growth from January to December. November saw the peak at 4,900 orders.",
    chartType: "bar",
    data: monthlyData.map(d => ({ name: d.name, orders: d.orders, revenue: d.revenue })),
  },
  users: {
    response: "Active user base grew from 18,200 in January to 24,891 in December — a 37% increase. Growth accelerated in Q3 and Q4.",
    chartType: "line",
    data: monthlyData.map(d => ({ name: d.name, value: d.users })),
  },
  conversion: {
    response: "Conversion rate has been relatively stable around 3.2-3.5%. Current rate is 3.24%, slightly below the 3.5% target.",
    chartType: "line",
    data: [
      { name: "Jan", value: 3.1 }, { name: "Feb", value: 3.4 }, { name: "Mar", value: 3.2 },
      { name: "Apr", value: 3.5 }, { name: "May", value: 3.3 }, { name: "Jun", value: 3.6 },
      { name: "Jul", value: 3.4 }, { name: "Aug", value: 3.2 }, { name: "Sep", value: 3.1 },
      { name: "Oct", value: 3.3 }, { name: "Nov", value: 3.2 }, { name: "Dec", value: 3.24 },
    ],
  },
  channel: {
    response: "Direct traffic drives 35% of revenue, followed by Organic Search (28%). Social media contributes 18% and is the fastest-growing channel.",
    chartType: "pie",
    data: channelData.map(d => ({ name: d.name, value: d.value })),
  },
  weekly: {
    response: "Thursday is the strongest day for sales with $51K average revenue. Weekend days see a 30-40% drop compared to weekdays.",
    chartType: "bar",
    data: weeklyData.map(d => ({ name: d.name, value: d.revenue })),
  },
  day: {
    response: "Thursday leads with an average of 820 orders per day. Sunday is the quietest day with 440 orders on average.",
    chartType: "bar",
    data: weeklyData.map(d => ({ name: d.name, value: d.orders })),
  },
};
