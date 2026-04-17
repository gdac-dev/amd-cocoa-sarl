"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { send2FACode } from "@/lib/email";

function getRedirectPath(user: { isSeller: boolean; isApproved: boolean; role: string }) {
  if (user.role === "ADMIN") return "/admin";
  if (user.isSeller) return "/seller";
  return "/catalogue";
}

export async function preAuthenticate(
  prevState: any,
  formData: FormData
) {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { error: "Invalid credentials." };

    const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordsMatch) return { error: "Invalid credentials." };

    // Block unverified users
    if (user.isEmailVerified === false) {
      return { error: "Please verify your email first.", needsVerification: true, email };
    }

    if (user.twoFactorEnabled) {
      // Generate and send 2FA code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = new Date();
      expires.setMinutes(expires.getMinutes() + 10);

      await prisma.user.update({
        where: { id: user.id },
        data: { twoFactorCode: code, twoFactorCodeExpires: expires },
      });

      await send2FACode(email, code);
      return { requires2FA: true, email };
    }

    // No 2FA — sign in directly with role-based redirect
    const redirectTo = getRedirectPath(user);
    await signIn("credentials", { email, password, redirectTo });

  } catch (error) {
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error; // Must rethrow for Next.js to handle the redirect
    }
    if (error instanceof AuthError) {
      return { error: "Invalid credentials." };
    }
    throw error;
  }
}

export async function verify2FA(
  prevState: any,
  formData: FormData
) {
  const email = (formData.get("email") as string)?.trim();
  const code = formData.get("code") as string;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { error: "Invalid credentials." };

    const redirectTo = getRedirectPath(user);

    await signIn("credentials", {
      is2FA: "true",
      email,
      code,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }
    return { error: "Invalid or expired code." };
  }
}
