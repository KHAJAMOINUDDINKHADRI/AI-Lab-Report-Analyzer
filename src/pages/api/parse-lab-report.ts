import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Missing text" });
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
      return res.status(response.status).json({ error });
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "";
    let result: unknown;
    try {
      // Remove code block markers if present
      const cleaned = content.replace(/```json|```/g, "").trim();
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) {
        result = JSON.parse(match[0]);
      } else {
        return res
          .status(500)
          .json({ error: "Failed to parse AI response", raw: content });
      }
    } catch (e: unknown) {
      return res.status(500).json({
        error: "Failed to parse AI response",
        raw: content,
        parseError: e instanceof Error ? e.message : String(e),
      });
    }
    if (result && typeof result === "object" && !Array.isArray(result)) {
      return res.status(200).json({ success: true, ...result });
    } else {
      return res.status(200).json({ success: true, result });
    }
  } catch (error: unknown) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
