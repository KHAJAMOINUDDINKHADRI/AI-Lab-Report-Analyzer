import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;
    if (!text) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    const prompt = `Given the following lab report text, extract:
1. The user's personal information (such as name, age, date of birth, report date, etc.) as an array of {label, value}.
2. The test results as an array of {parameter, value, unit, range}. Only include valid test rows (ignore section headers or unrelated info).

Lab report text:
"""
${text}
"""

Respond in JSON with this structure:
{
  "userInfo": [ { "label": "Name", "value": "John Doe" }, ... ],
  "testData": [ { "parameter": "Fasting Blood Glucose", "value": "92", "unit": "mg/dL", "range": "70-100 mg/dL" }, ... ]
}`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
          "X-Title": "Data Alchemist",
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL || "deepseek/deepseek-chat-v3-0324:free",
          messages: [
            {
              role: "system",
              content: "You are a helpful medical data extraction assistant.",
            },
            { role: "user", content: prompt },
          ],
          max_tokens: Number(process.env.AI_MAX_TOKENS) || 4000,
          temperature: Number(process.env.AI_TEMPERATURE) || 0.3,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error }, { status: response.status });
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "";
    // Try to parse the JSON from the model's response
    let result: unknown;
    try {
      result = JSON.parse(content);
    } catch {
      // Try to extract JSON from the response if it's surrounded by text
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        result = JSON.parse(match[0]);
      } else {
        return NextResponse.json(
          { error: "Failed to parse AI response" },
          { status: 500 }
        );
      }
    }
    if (result && typeof result === "object" && !Array.isArray(result)) {
      return NextResponse.json({ success: true, ...result });
    } else {
      return NextResponse.json({ success: true, result });
    }
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}