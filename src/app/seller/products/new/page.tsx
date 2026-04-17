import { ProductForm } from "@/components/ui/ProductForm";
import { prisma } from "@/lib/prisma";

export default async function SellerNewProductPage() {
  const categories = await prisma.category.findMany();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Add New Product</h1>
        <p className="text-cocoa-500">List an item in your shop.</p>
      </div>
      <ProductForm categories={categories} cancelUrl="/seller/products" />
    </div>
  );
}
