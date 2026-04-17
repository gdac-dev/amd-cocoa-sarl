"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function updateSellerProfile(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized." };

  const shopName = formData.get("shopName") as string;
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return { error: "User not found." };

  const updates: any = {};

  if (shopName && shopName !== user.shopName) {
    updates.shopName = shopName;
  }

  if (newPassword) {
    if (newPassword !== confirmPassword) {
      return { error: "New passwords do not match." };
    }
    if (newPassword.length < 6) {
      return { error: "Password must be at least 6 characters." };
    }
    if (!currentPassword) {
      return { error: "Please enter your current password to change it." };
    }
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return { error: "Current password is incorrect." };
    }
    updates.passwordHash = await bcrypt.hash(newPassword, 10);
  }

  if (Object.keys(updates).length === 0) {
    return { error: "No changes detected." };
  }

  await prisma.user.update({ where: { id: user.id }, data: updates });

  revalidatePath("/seller/settings");
  return { success: "Profile updated successfully!" };
}
