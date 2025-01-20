import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from 'next/server';
import NodeCache from 'node-cache';
import rateLimit from 'express-rate-limit';
import retry from 'async-retry';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not set');
}

const genAI = new GoogleGenerativeAI(apiKey);
const cache = new NodeCache({ stdTTL: 3600 });
rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: 'Too many requests, please try again later.',
});

export async function POST(req: NextRequest) {
  console.log('Received POST request');
  try {
    const { prompt } = await req.json();
    console.log('Prompt received:', prompt);
    const cacheKey = `gemini:${prompt}`;
    const cachedResponse = cache.get(cacheKey);

    if (cachedResponse) {
      console.log('Cache hit for key:', cacheKey);
      return NextResponse.json({ response: cachedResponse }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    console.log('Cache miss for key:', cacheKey);
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash-8b" });

    const result = await retry(async () => {
      const response = await model.generateContent(prompt);
      if (!response || !response.response || !response.response.text) {
        throw new Error('Invalid response from API');
      }
      return response;
    }, {
      retries: 3,
      minTimeout: 1000,
      maxTimeout: 3000,
    });

    const responseText = result.content;
    console.log('Generated response:', responseText);
    cache.set(cacheKey, responseText);

    return NextResponse.json({ response: responseText }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error in Gemini API:', (error as Error).message);
    return NextResponse.json({ error: 'Failed to process request', details: (error as Error).message }, { status: 500, headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }});
  }
}

export async function OPTIONS() {
  console.log('Received OPTIONS request');
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}