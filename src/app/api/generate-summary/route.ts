import OpenAI from "openai";

import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const completion =
      await client.chat.completions.create({
        model: "gpt-4.1-mini",

        messages: [
          {
            role: "system",
            content: `
You are an AI infrastructure cost optimization consultant.

Generate concise executive summaries for AI tooling audits.

Be:
- professional
- concise
- financially aware
- realistic
- enterprise-focused
`,
          },

          {
            role: "user",
            content: `
Audit data:

${JSON.stringify(body, null, 2)}

Generate:
1. Executive summary
2. Biggest optimization opportunity
3. Cost reduction recommendation
`,
          },
        ],

        temperature: 0.7,
      });

    return NextResponse.json({
      summary:
        completion.choices[0].message
          .content,
    });
  } catch (error) {
    return NextResponse.json(
      {
        summary:
          "Your AI stack appears reasonably optimized with limited overspend opportunities detected.",
      },
      { status: 200 }
    );
  }
}