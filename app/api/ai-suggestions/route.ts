import {
  CategoryExpense,
  StatsData,
  Suggestion,
} from "@/types/types";
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  try {
    const { stats }: { stats: StatsData } = await req.json();

    // Build summary for AI
    const summary = `
    Total expenses: ₦${stats.total}
    This month: ₦${stats.monthly}
    Average daily spending: ₦${stats.average}
    Budget left: ₦${stats.budgetLeft}
    Category breakdown: ${stats.categories
      .map((c: CategoryExpense) => `${c.name}: ₦${c.amount}`)
      .join(", ")}
    `;

    // Call Gemini API
    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
            {
              parts: [
                {
                  text: `
                    You are a friendly budgeting assistant.
                    Based on this spending summary, give 2-3 short, helpful tips
                    for the user to manage their money better.
                    Respond in plain text, each suggestion separated by "||".
                    \n\n${summary}
                  `,
                },
              ],
            },
          ],
  });
//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`
// ,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           contents: [
//             {
//               parts: [
//                 {
//                   text: `
//                     You are a friendly budgeting assistant.
//                     Based on this spending summary, give 2-3 short, helpful tips
//                     for the user to manage their money better.
//                     Respond in plain text, each suggestion separated by "||".
//                     \n\n${summary}
//                   `,
//                 },
//               ],
//             },
//           ],
//         }),
//       }
//     );

    //     const response = await fetch(
    //   `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
    //   {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       contents: [
    //         {
    //           parts: [
    //             {
    //               text: `
    //                 You are a friendly budgeting assistant.
    //                 Based on this spending summary, give 2-3 short, helpful tips
    //                 for the user to manage their money better.
    //                 Respond in plain text, each suggestion separated by "||".
    //                 \n\n${summary}
    //               `,
    //             },
    //           ],
    //         },
    //       ],
    //     }),
    //   }
    // );

    // const data = await response.json();

    // console.log("🔍 Gemini raw response:", JSON.stringify(data, null, 2));

    const text = await response.text ?? "";

    console.log("🔍 Gemini raw response:", JSON.stringify(text, null, 2));

  

// Guard clause if there's no AI response
if (!text) {
  console.warn("⚠️ Gemini returned no text output.");
  return NextResponse.json({ suggestions: [] });
}


    // Safely extract the AI's text
    // const text: string =
    //   data?.candidates?.[0]?.content?.parts?.[0]?.text?.toString() ??
    //   "";

    // const text: string =
    //   data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    //   data?.candidates?.[0]?.output_text ??
    //   data?.text ??
    //   "";

    // Split and format AI suggestions
    const suggestions: Suggestion[] = text
      .split("||")
      .map((s: string) => s.trim())
      .filter((s: string) => Boolean(s))
      .map(
        (s: string): Suggestion => ({
          title: s.includes(":")
            ? s.split(":")[0].trim()
            : "Suggestion",
          message: s.includes(":")
            ? s.split(":").slice(1).join(":").trim()
            : s.trim(),
        })
      );

    console.log("✅ AI Suggestions generated:", suggestions);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("❌ AI Suggestion Error:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}
