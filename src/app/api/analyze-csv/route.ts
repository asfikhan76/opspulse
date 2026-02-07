import { NextRequest, NextResponse } from "next/server";
import { generateJSON } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { headers, rows, fileName } = await req.json();
    
    if (!headers || !rows) {
      return NextResponse.json({ error: "CSV data is required" }, { status: 400 });
    }

    // Send a sample of data to avoid token limits
    const sampleRows = rows.slice(0, 30);
    const numericColumns = headers.filter((h: string) =>
      sampleRows.some((row: Record<string, any>) => typeof row[h] === "number" && !isNaN(row[h]))
    );

    const prompt = `You are a data analyst. Analyze this CSV dataset and provide insights.

FILE: ${fileName || "uploaded.csv"}
COLUMNS: ${JSON.stringify(headers)}
NUMERIC COLUMNS: ${JSON.stringify(numericColumns)}
SAMPLE DATA (first ${sampleRows.length} rows):
${JSON.stringify(sampleRows)}
TOTAL ROWS: ${rows.length}

Respond with a JSON object with this EXACT structure:
{
  "summary": "A 2-3 sentence summary of what this dataset contains and its key characteristics",
  "insights": [
    "Insight 1 with specific numbers",
    "Insight 2 with specific numbers",
    "Insight 3 with specific numbers",
    "Insight 4 with specific numbers"
  ],
  "recommendations": [
    "Actionable recommendation 1",
    "Actionable recommendation 2",
    "Actionable recommendation 3"
  ],
  "anomalies": [
    "Any unusual patterns or outliers found"
  ],
  "suggestedChartType": "bar" | "line" | "area" | "pie",
  "suggestedXAxis": "best column for X axis",
  "suggestedYAxis": ["best column(s) for Y axis"]
}

RULES:
- Include specific numbers from the data in insights
- If there are date/time columns, recommend time-series charts
- Identify correlations between numeric columns
- Flag any outliers or anomalies
- Return ONLY valid JSON`;

    const result = await generateJSON(prompt);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("CSV Analysis API error:", error);
    
    return NextResponse.json({
      summary: "Analysis could not be completed at this time.",
      insights: ["Upload your data and ensure your API key is configured for AI-powered analysis."],
      recommendations: ["Try uploading a CSV with numeric columns for best results."],
      anomalies: [],
      suggestedChartType: "bar",
      suggestedXAxis: "",
      suggestedYAxis: [],
    });
  }
}
