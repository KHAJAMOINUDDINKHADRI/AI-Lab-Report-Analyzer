import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { userInfo, testData } = req.body;
    if (!userInfo || !testData) {
      return res.status(400).json({ error: "Missing userInfo or testData" });
    }

    const prompt = `Given the following patient information and lab test results, provide a concise, friendly, and actionable health recommendation or summary for the patient. If any values are out of range, mention them and suggest what to discuss with a doctor. Respond in markdown.\n\nPatient Information:\n${JSON.stringify(
      userInfo,
      null,
      2
    )}\n\nTest Results:\n${JSON.stringify(testData, null, 2)}\n`;

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
      return res.status(response.status).json({ error });
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "";
    return res.status(200).json({ recommendation: content });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Unknown error" });
  }
}
