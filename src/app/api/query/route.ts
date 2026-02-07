import { NextRequest, NextResponse } from "next/server";
import { generateJSON } from "@/lib/gemini";
import { monthlyData, weeklyData, channelData, kpiData, performanceData } from "@/lib/data";

const businessContext = `
You are an AI business analyst for OpsPulse, an AI-powered Business Command Center.
You have access to the following business data:

MONTHLY DATA (Jan-Dec):
${JSON.stringify(monthlyData)}

WEEKLY DATA (Mon-Sun):
${JSON.stringify(weeklyData)}

CHANNEL/TRAFFIC DATA:
${JSON.stringify(channelData)}

KPI DATA:
${JSON.stringify(kpiData)}

PERFORMANCE METRICS:
${JSON.stringify(performanceData)}
`;

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const prompt = `${businessContext}

The user asked: "${query}"

Analyze the data and respond with a JSON object with this EXACT structure:
{
  "response": "Your detailed analysis text (2-4 sentences with specific numbers and insights)",
  "chartType": "bar" | "line" | "pie" | "area",
  "data": [{"name": "Label", "value": 123}, ...],
  "insight": "One key actionable insight from this data"
}

IMPORTANT RULES:
- Choose the best chartType for the question (pie for distribution/breakdown, area/line for trends, bar for comparisons)
- The "data" array must have "name" as string and one or more numeric fields
- For pie charts, use "value" as the numeric field
- For other charts, you can use "value" or descriptive names like "revenue", "orders" etc
- Keep data array to 5-15 items maximum
- Include specific numbers in your response text
- If the question is vague or unrelated, still provide a helpful business insight from the available data
- Return ONLY valid JSON, no extra text`;

    const result = await generateJSON(prompt);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Query API error:", error);
    
    // Fallback response if AI fails
    return NextResponse.json({
      response: "I encountered an issue processing your query. Here's a summary of recent performance instead.",
      chartType: "area",
      data: monthlyData.map(d => ({ name: d.name, value: d.revenue })),
      insight: "Revenue has been trending upward with a 53% year-over-year growth.",
    });
  }
}
