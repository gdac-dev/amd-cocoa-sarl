import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getTranslation } from "@/lib/translations";

export default async function SellerDashboardPage() {
  const session = await auth();
  const { t } = await getTranslation();
  const userId = session?.user?.id;

  const productsCount = await prisma.product.count({
    where: { sellerId: userId }
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{t("seller.dashboard_title")}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-cocoa-100">
          <h3 className="text-cocoa-500 font-medium text-sm">{t("seller.active_products")}</h3>
          <p className="text-4xl font-bold text-primary mt-2">{productsCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-cocoa-100 opacity-50">
          <h3 className="text-cocoa-500 font-medium text-sm">{t("seller.total_sales")}</h3>
          <p className="text-4xl font-bold text-primary mt-2">0</p>
          <span className="text-xs text-cocoa-400">{t("seller.coming_soon")}</span>
        </div>
      </div>
    </div>
  );
}
