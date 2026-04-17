"use server";

import { prisma } from "@/lib/prisma";
import { send2FACode } from "@/lib/email";

export async function verifyAccountCode(prevState: any, formData: FormData) {
  const email = (formData.get("email") as string)?.trim();
  const code = (formData.get("code") as string)?.trim();

  console.log(`[VERIFY] Attempt — email: "${email}", code: "${code}"`);

  if (!email || !code) {
    return { error: "Missing email or code." };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { error: "Account not found. Please register again." };
  }

  if (user.isEmailVerified) {
    // Already verified — just tell them to login
    return { alreadyVerified: true };
  }

  if (!user.twoFactorCode || !user.twoFactorCodeExpires) {
    return { error: "No active code found. Please request a new one." };
  }

  if (user.twoFactorCodeExpires < new Date()) {
    return { error: "Code has expired. Please request a new one." };
  }

  if (user.twoFactorCode !== code) {
    return { error: "Incorrect code. Please try again." };
  }

  // ✅ Code is valid — mark as verified and clear the code
  await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      twoFactorCode: null,
      twoFactorCodeExpires: null,
    },
  });

  console.log(`[VERIFY] ✓ Account verified for ${email}`);

  // Return success with redirect info — client will handle navigation
  return { success: true, isSeller: user.isSeller };
}

export async function resendVerificationCode(prevState: any, formData: FormData) {
  const email = (formData.get("email") as string)?.trim();

  console.log(`[RESEND] Request for email: "${email}"`);

  if (!email) {
    return { error: "Email address is missing. Please go back and register again." };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { error: "No account found with this email." };
  }

  // If already verified, no need to resend — redirect to login
  if (user.isEmailVerified) {
    return { alreadyVerified: true };
  }

  // Generate a new fresh code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + 15);

  await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorCode: code, twoFactorCodeExpires: expires },
  });

  await send2FACode(email, code);

  return { success: "A new verification code has been sent." };
}
