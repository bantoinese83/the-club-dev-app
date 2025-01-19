import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not set');
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    // Use the correct model name directly
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const result = await model.generateContent(prompt);
    const response = result.response.text;

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in Gemini API:', (error as Error).message);
    return NextResponse.json({ error: 'Failed to process request', details: (error as Error).message }, { status: 500 });
  }
}