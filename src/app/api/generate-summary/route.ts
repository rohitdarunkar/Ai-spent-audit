import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      recommendations,
      totalSavings,
      annualSavings,
    } = body;

    const prompt = `
You are an AI FinOps consultant.

Analyze this AI software spend audit and provide:
- an executive summary
- biggest waste areas
- optimization advice
- recommended next actions

Data:
${JSON.stringify(
  {
    recommendations,
    totalSavings,
    annualSavings,
  },
  null,
  2
)}
`;

    const response =
      await client.chat.completions.create({
        model: "gpt-4.1-mini",

        messages: [
          {
            role: "system",
            content:
              "You are an expert SaaS cost optimization consultant.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.7,
      });

    const summary =
      response.choices[0].message.content;

    return NextResponse.json({
      summary,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to generate summary",
      },
      {
        status: 500,
      }
    );
  }
}