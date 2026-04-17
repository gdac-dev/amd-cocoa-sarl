import { ProductForm } from "@/components/ui/ProductForm";
import { prisma } from "@/lib/prisma";
import { getTranslation } from "@/lib/translations";

export default async function SellerNewProductPage() {
  const { t } = await getTranslation();
  const categories = await prisma.category.findMany();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t("seller.new_product_title")}</h1>
        <p className="text-cocoa-500">{t("seller.new_product_desc")}</p>
      </div>
      <ProductForm categories={categories} cancelUrl="/seller/products" />
    </div>
  );
}
