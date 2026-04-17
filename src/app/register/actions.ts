"use server";

import { prisma } from "@/lib/prisma";
import { send2FACode } from "@/lib/email";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function registerUser(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const isSeller = formData.get("isSeller") === "on";
  const shopName = formData.get("shopName") as string;
  const recaptchaToken = formData.get("g-recaptcha-response") as string;

  if (!recaptchaToken) {
    return { error: "Please complete the reCAPTCHA." };
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: "User already exists with this email." };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Generate a 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 15);

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        isSeller,
        shopName: isSeller ? shopName : null,
        isApproved: false,
        isEmailVerified: false,
        twoFactorEnabled: false,
        twoFactorCode: code,
        twoFactorCodeExpires: expires,
      },
    });

    await send2FACode(email, code);

  } catch (error) {
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Error creating user:", error);
    return { error: "Internal server error." };
  }

  // Redirect to email verification page with the email in the URL
  redirect(`/verify-account?email=${encodeURIComponent(email)}`);
}
