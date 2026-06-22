import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are the AMD Cocoa intelligent assistant chatbot. You work for AMD Cocoa Sarl, a premium cocoa company headquartered in Cameroon specializing in raw cocoa beans, cocoa butter, cocoa powder, and artisanal chocolate products.

Key facts about AMD Cocoa:
- We source 100% organic cocoa from heritage farms in Cameroon
- We are Fair Trade certified and partner directly with farming cooperatives
- Products: raw cocoa beans, cocoa butter, cocoa powder, cocoa nibs, artisanal chocolate bars
- Currency: FCFA (XAF)
- Local delivery in Cameroon: 2-5 business days (Standard), 24-48 hours (Express)
- International shipping via Douala port with climate-controlled logistics
- Payment methods: Mobile Money (MTN/Orange), Cash on Delivery, Bank Transfer
- Partners: Chococam, NEO Industry, SIC Cacaos (backed by Barry Callebaut)
- Returns: Not accepted on unsealed batches due to perishable nature; damaged orders get free replacements if reported within 48 hours with photos
- Wholesale/B2B ordering is supported with structured invoicing
- Contact: WhatsApp at +237 653 522 435

Guidelines:
- Be friendly, professional, and concise
- Answer in the same language the user writes in (French or English)
- Keep responses under 150 words
- If you don't know something specific about AMD Cocoa, say so honestly and suggest contacting support
- Never make up prices or product details
- You can help with: product info, shipping, payments, returns, wholesale inquiries, general cocoa knowledge`;

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "AI service not configured", fallback: true },
        { status: 503 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Build conversation history for context
    const chatHistory = (history || []).map((msg: { role: string; text: string }) => ({
      role: msg.role === "bot" ? "model" : "user",
      parts: [{ text: msg.text }],
    }));

    const chat = model.startChat({
      history: chatHistory,
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error("[CHAT API] Error:", error.message);
    return NextResponse.json(
      { error: "Failed to generate response", fallback: true },
      { status: 500 }
    );
  }
}
