import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (query) {
      await prisma.chatbotLog.create({
        data: {
          query,
          isAnswered: false,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to log query" }, { status: 500 });
  }
}
