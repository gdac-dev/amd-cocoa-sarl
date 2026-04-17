import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = contactSchema.parse(body);

    // Save to database
    await prisma.contactMessage.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        message: validatedData.message,
      },
    });

    // Send email notification if SMTP is configured
    if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT || 587),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      // Email to Admin
      await transporter.sendMail({
        from: '"AMD Cocoa Sarl" <' + process.env.SMTP_USER + '>',
        to: "arsenedemenou@gmail.com",
        subject: `New AMD Cocoa Sarl Inquiry from ${validatedData.name}`,
        text: `You have a new message from the AMD Cocoa Sarl contact form:\n\nName: ${validatedData.name}\nEmail: ${validatedData.email}\nPhone: ${validatedData.phone || 'Not provided'}\n\nMessage:\n${validatedData.message}`,
      });

      // Email to User
      await transporter.sendMail({
        from: '"AMD Cocoa Sarl" <' + process.env.SMTP_USER + '>',
        to: validatedData.email,
        subject: `We've received your message! - AMD Cocoa Sarl`,
        html: `
          <div style="font-family: Arial, sans-serif; p-4 bg-[#fdfaf6]; color: #3b1f0a;">
            <h2 style="color: #d4a853;">Hello ${validatedData.name},</h2>
            <p>Thank you for reaching out to AMD Cocoa Sarl! We have carefully received your message.</p>
            <p>Our team is currently reviewing your inquiry and will get back to you directly at this email address within 24-48 hours.</p>
            <br/>
            <p><strong>Your Message Summary:</strong></p>
            <blockquote style="border-left: 4px solid #d4a853; padding-left: 10px; color: #7a5c3f;">
              ${validatedData.message}
            </blockquote>
            <br/>
            <p>Best regards,<br/><strong>The AMD Cocoa Sarl Team</strong></p>
          </div>
        `
      });
    }

    return NextResponse.json({ message: "success" });
  } catch (error: any) {
    console.error("Contact Form Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit" },
      { status: 400 }
    );
  }
}
