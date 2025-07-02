import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userInfo, testData } = body;
    if (!userInfo || !testData) {
      return NextResponse.json(
        { error: "Missing userInfo or testData" },
        { status: 400 }
      );
    }

    const prompt = `Given the following patient information and lab test results, provide a concise, friendly, and actionable health recommendation or summary for the patient. If any values are out of range, mention them and suggest what to discuss with a doctor. Respond in markdown.

Patient Information:
${JSON.stringify(userInfo, null, 2)}

Test Results:
${JSON.stringify(testData, null, 2)}
`;

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
              content: "You are a helpful medical data assistant.",
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
    return NextResponse.json({ recommendation: content });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
