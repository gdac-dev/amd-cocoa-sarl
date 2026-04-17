import { prisma } from "@/lib/prisma";
import { getTranslation } from "@/lib/translations";
import { Store } from "lucide-react";
import Link from "next/link";

export default async function ShopsPage() {
  const { t } = await getTranslation();
  
  const sellers = await prisma.user.findMany({
    where: { isSeller: true, isApproved: true },
    select: { id: true, shopName: true, name: true, createdAt: true }
  });

  return (
    <div className="bg-beige min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-primary tracking-tight mb-8">
          {t("nav.our_shops")}
        </h1>
        <p className="text-lg text-cocoa-500 mb-12 max-w-3xl">
          {t("shops.subtitle")}
        </p>

        {sellers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-cocoa-200">
            <p className="text-cocoa-500">{t("shops.no_shops")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sellers.map((seller) => (
              <div key={seller.id} className="bg-white border border-cocoa-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <Store className="w-8 h-8 text-accent mb-4" />
                <h3 className="text-2xl font-bold text-primary">{seller.shopName || seller.name}</h3>
                <p className="text-sm text-cocoa-400 mt-2">{t("shops.partner_since")} {new Date(seller.createdAt).getFullYear()}</p>
                <Link href={`/catalogue?sellerId=${seller.id}`} className="mt-6 text-sm text-accent hover:underline font-semibold block">{t("shops.view_products")} &rarr;</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
