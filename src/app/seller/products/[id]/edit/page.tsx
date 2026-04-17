import { ProductForm } from "@/components/ui/ProductForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { auth } from "@/auth";

export default async function SellerEditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return notFound();
  
  const { id } = await params;
  const categories = await prisma.category.findMany();
  const product = await prisma.product.findUnique({ 
    where: { id, sellerId: session.user.id } 
  });

  if (!product) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <p className="text-cocoa-500">Update your product details.</p>
      </div>
      <ProductForm categories={categories} cancelUrl="/seller/products" initialData={product} />
    </div>
  );
}
