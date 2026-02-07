import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/gemini";
import { monthlyData, weeklyData, channelData, kpiData, performanceData, anomalyAlerts } from "@/lib/data";

export async function POST(req: NextRequest) {
  try {
    const { title, dateRange, sections } = await req.json();

    const dataContext = `
BUSINESS DATA FOR REPORT:

KPIs:
- Total Revenue: $284,592 (+12.5% MoM)
- Active Users: 24,891 (+8.2% MoM)
- Conversion Rate: 3.24% (-2.1% MoM)
- Avg Order Value: $68.40 (+5.7% MoM)

MONTHLY PERFORMANCE (Jan-Dec):
${JSON.stringify(monthlyData)}

WEEKLY PATTERNS:
${JSON.stringify(weeklyData)}

TRAFFIC CHANNELS:
${JSON.stringify(channelData)}

SYSTEM PERFORMANCE:
${JSON.stringify(performanceData)}

ACTIVE ANOMALIES:
${JSON.stringify(anomalyAlerts.filter(a => a.status !== 'resolved'))}
`;

    const sectionPrompts: Record<string, string> = {
      "executive-summary": "Write a concise executive summary (3-4 paragraphs) covering overall business health, key wins, and areas of concern.",
      "revenue": "Provide detailed revenue analysis including trends, growth rates, seasonal patterns, and revenue per channel breakdown.",
      "kpis": "Analyze each KPI in detail — what's driving the numbers, compare to targets, and identify risks.",
      "users": "Analyze user growth, engagement patterns, acquisition channels, and retention indicators.",
      "trends": "Identify key business trends — which metrics are accelerating, decelerating, or showing unusual patterns.",
      "recommendations": "Provide 5-7 specific, actionable recommendations based on the data. Each should have a clear action, expected impact, and priority level (High/Medium/Low).",
    };

    const selectedPrompts = (Array.isArray(sections) ? sections : Object.keys(sections || {}).filter(k => sections[k]))
      .filter((s: string) => sectionPrompts[s])
      .map((s: string) => `## ${s.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}\n${sectionPrompts[s]}`)
      .join("\n\n");

    const prompt = `You are a senior business analyst generating a professional report.

REPORT TITLE: ${title || "Business Performance Report"}
DATE RANGE: ${dateRange || "Last 30 days"}

${dataContext}

Generate the following report sections with rich analysis. Use specific numbers from the data.
Write in a professional, clear tone suitable for executive stakeholders.
Use markdown formatting (headers, bullet points, bold for emphasis).

${selectedPrompts}

Write the complete report content now:`;

    const reportContent = await generateText(prompt);
    
    return NextResponse.json({ 
      content: reportContent,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Report API error:", error);
    
    return NextResponse.json({
      content: `# ${req.body ? "Business Performance Report" : "Report"}\n\nUnable to generate AI report. Please ensure your GEMINI_API_KEY is configured in .env.local.\n\n## Quick Summary\n- Revenue: $284,592 (+12.5%)\n- Active Users: 24,891 (+8.2%)\n- Conversion Rate: 3.24% (-2.1%)\n- Avg Order Value: $68.40 (+5.7%)`,
      generatedAt: new Date().toISOString(),
    });
  }
}
