import { ProductForm } from "@/components/ui/ProductForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function AdminEditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const categories = await prisma.category.findMany();
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <p className="text-cocoa-500">Update item details in the master catalog.</p>
      </div>
      <ProductForm categories={categories} cancelUrl="/admin/products" initialData={product} />
    </div>
  );
}
