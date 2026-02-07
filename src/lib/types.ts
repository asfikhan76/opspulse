export interface KPIData {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: string;
  trend: number[];
}

export interface ChartDataPoint {
  name: string;
  revenue: number;
  profit: number;
  users: number;
  orders: number;
  [key: string]: string | number;
}

export interface ActivityItem {
  id: string;
  type: "alert" | "success" | "warning" | "info";
  title: string;
  description: string;
  time: string;
  icon: string;
}

export interface AnomalyAlert {
  id: string;
  severity: "critical" | "warning" | "info";
  metric: string;
  message: string;
  value: number;
  expected: number;
  deviation: number;
  timestamp: string;
  status: "active" | "acknowledged" | "resolved";
}

export interface CSVData {
  headers: string[];
  rows: Record<string, string | number>[];
}

export interface QueryResult {
  query: string;
  response: string;
  chartType: "bar" | "line" | "pie" | "area" | "table";
  data: Record<string, string | number>[];
  timestamp: string;
}

export interface ReportConfig {
  title: string;
  dateRange: string;
  sections: string[];
  format: "pdf" | "csv" | "json";
}

export interface MetricCard {
  label: string;
  value: number;
  previousValue: number;
  format: "number" | "currency" | "percentage";
  color: string;
}
