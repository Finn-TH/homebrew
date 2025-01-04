import { NextResponse } from "next/server";
import { getModel } from "@/lib/ai/gemini";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const model = getModel();
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("AI API Error:", error);
    return NextResponse.json(
      { error: "Failed to process AI request" },
      { status: 500 }
    );
  }
}
