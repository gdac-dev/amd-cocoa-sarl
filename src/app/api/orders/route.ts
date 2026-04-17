import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, customerPhone, customerAddr, customerCity, customerEmail, totalPrice, paymentMethod, items } = body;

    const order = await prisma.order.create({
      data: {
        customerName,
        customerPhone,
        customerAddr,
        customerCity,
        customerEmail,
        totalPrice,
        paymentMethod,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            productName: item.name,
            price: item.price,
            quantity: item.quantity
          }))
        }
      }
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error: any) {
    console.error("Order Creation Error", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
