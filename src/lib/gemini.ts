import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY not set — AI features will use fallback responses");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export function getModel() {
  if (!genAI) return null;
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}

export async function generateText(prompt: string): Promise<string> {
  const model = getModel();
  if (!model) {
    return "AI model not configured. Please set GEMINI_API_KEY in .env.local";
  }
  
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error("Gemini API error:", error);
    throw new Error(error.message || "Failed to generate AI response");
  }
}

export async function generateJSON<T = any>(prompt: string): Promise<T> {
  const model = getModel();
  if (!model) {
    throw new Error("AI model not configured");
  }
  
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonStr = jsonMatch ? jsonMatch[1].trim() : text.trim();
    
    return JSON.parse(jsonStr) as T;
  } catch (error: any) {
    console.error("Gemini JSON error:", error);
    throw new Error(error.message || "Failed to generate AI response");
  }
}
