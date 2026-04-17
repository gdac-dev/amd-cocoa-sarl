import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Plus } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { deleteProduct } from "@/lib/actions/products";
import { getTranslation } from "@/lib/translations";

export default async function SellerProductsPage() {
  const session = await auth();
  const { t } = await getTranslation();
  const products = await prisma.product.findMany({
    where: { sellerId: session?.user?.id },
    orderBy: { createdAt: "desc" },
    include: { category: true }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">{t("seller.products_title")}</h1>
          <p className="text-cocoa-500">{t("seller.products_desc")}</p>
        </div>
        <Link href="/seller/products/new" className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded shadow hover:bg-primary-light transition-colors">
          <Plus className="h-4 w-4" />
          <span>{t("seller.add_product")}</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-cocoa-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-cocoa-50 text-primary border-b border-cocoa-100 uppercase text-xs tracking-wider">
              <th className="p-4">{t("seller.col_image")}</th>
              <th className="p-4">{t("seller.col_name")}</th>
              <th className="p-4">{t("seller.col_category")}</th>
              <th className="p-4">{t("seller.col_price")}</th>
              <th className="p-4">{t("seller.col_stock")}</th>
              <th className="p-4">{t("seller.col_actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cocoa-50">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-amber-50/20">
                <td className="p-4">
                   <div className="h-12 w-12 bg-cocoa-100 rounded overflow-hidden relative">
                     <Image src={product.image || "/media__1775744053671.png"} fill alt="Product" className="object-cover" />
                   </div>
                </td>
                <td className="p-4">
                   <p className="font-bold text-primary">{product.name}</p>
                   <p className="text-xs text-cocoa-400">{product.slug}</p>
                </td>
                <td className="p-4 text-sm font-medium">{product.category.name}</td>
                <td className="p-4 font-bold text-accent-secondary">{product.price.toFixed(0)} FCFA</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${product.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="p-4 flex space-x-3 items-center pt-6">
                   <Link href={`/seller/products/${product.id}/edit`} className="text-blue-500 hover:underline text-sm font-medium">{t("seller.edit")}</Link>
                   <form action={deleteProduct}>
                     <input type="hidden" name="id" value={product.id} />
                     <button type="submit" className="text-red-500 hover:underline text-sm font-medium">{t("seller.delete")}</button>
                   </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="p-8 text-center text-cocoa-400">{t("seller.no_products")}</div>
        )}
      </div>
    </div>
  );
}
