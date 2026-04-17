"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import fs from "fs/promises";
import path from "path";

async function processImage(formData: FormData): Promise<string | null> {
  const image = formData.get("image") as File | null;
  if (!image || image.size === 0) return null;
  
  const buffer = Buffer.from(await image.arrayBuffer());
  const fileName = Date.now() + "-" + image.name.replace(/[^a-zA-Z0-9.\-]/g, "");
  const uploadDir = path.join(process.cwd(), "public/uploads");
  
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (e) {}
  
  await fs.writeFile(path.join(uploadDir, fileName), buffer);
  return `/uploads/${fileName}`;
}

export async function createProduct(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) throw new Error("Unauthorized");
  if (user.isSeller && !user.isApproved) throw new Error("Awaiting approval");

  const name = formData.get("name") as string;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const description = formData.get("description") as string;
  const shortDescription = formData.get("shortDescription") as string || description.substring(0, 100);
  const price = parseFloat(formData.get("price") as string);
  if (price <= 0) throw new Error("Price must be greater than 0");
  const stock = parseInt(formData.get("stock") as string);
  const unit = formData.get("unit") as string || "Unit(s)";
  const categoryId = formData.get("categoryId") as string;
  
  const imagePath = await processImage(formData);

  await prisma.product.create({
    data: {
      name,
      slug,
      description,
      shortDescription,
      price,
      stock,
      unit,
      categoryId,
      image: imagePath,
      sellerId: user.isSeller ? user.id : null, 
    }
  });

  const redirectPath = user.isSeller ? "/seller/products" : "/admin/products";
  revalidatePath(redirectPath);
  redirect(redirectPath);
}

export async function updateProduct(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) throw new Error("Unauthorized");
  if (user.isSeller && !user.isApproved) throw new Error("Awaiting approval");

  const id = formData.get("id") as string;
  const existingProduct = await prisma.product.findUnique({ where: { id } });
  if (!existingProduct) throw new Error("Not found");
  if (user.isSeller && existingProduct.sellerId !== user.id) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const description = formData.get("description") as string;
  const shortDescription = formData.get("shortDescription") as string || description.substring(0, 100);
  const price = parseFloat(formData.get("price") as string);
  if (price <= 0) throw new Error("Price must be greater than 0");
  const stock = parseInt(formData.get("stock") as string);
  const unit = formData.get("unit") as string || "Unit(s)";
  const categoryId = formData.get("categoryId") as string;
  
  const imagePath = await processImage(formData);

  const dataToUpdate: any = {
    name,
    slug,
    description,
    shortDescription,
    price,
    stock,
    unit,
    categoryId,
  };

  if (imagePath) {
    dataToUpdate.image = imagePath;
  }

  await prisma.product.update({
    where: { id },
    data: dataToUpdate
  });

  const redirectPath = user.isSeller ? "/seller/products" : "/admin/products";
  revalidatePath(redirectPath);
  redirect(redirectPath);
}

export async function deleteProduct(formData: FormData) {
  const id = formData.get("id") as string;
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.isSeller && !user.isApproved) throw new Error("Awaiting approval");
  
  const product = await prisma.product.findUnique({ where: { id } });
  if (user?.isSeller && product?.sellerId !== user.id) {
    throw new Error("Unauthorized deletion");
  }

  await prisma.product.delete({ where: { id } });
  const redirectPath = user?.isSeller ? "/seller/products" : "/admin/products";
  revalidatePath(redirectPath);
}
