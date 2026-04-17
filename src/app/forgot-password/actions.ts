"use server";

import { prisma } from "@/lib/prisma";
import { send2FACode } from "@/lib/email";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function requestPasswordReset(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Don't reveal if email exists or not
    return { success: "If an account exists, a reset code has been sent." };
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorCode: code, twoFactorCodeExpires: expires },
  });

  await send2FACode(email, code);
  return { success: "If an account exists, a reset code has been sent.", email };
}

export async function resetPassword(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const code = formData.get("code") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (newPassword !== confirmPassword) {
    return { error: "Passwords do not match." };
  }
  if (newPassword.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (
    !user ||
    user.twoFactorCode !== code ||
    !user.twoFactorCodeExpires ||
    user.twoFactorCodeExpires < new Date()
  ) {
    return { error: "Invalid or expired code." };
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, twoFactorCode: null, twoFactorCodeExpires: null },
  });

  redirect("/login");
}
