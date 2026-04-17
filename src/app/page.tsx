import { Hero } from "@/components/ui/Hero";
import { ProductCard } from "@/components/ui/ProductCard";
import { prisma } from "@/lib/prisma";
import { getTranslation } from "@/lib/translations";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default async function Home() {
  const { t } = await getTranslation();
  const bestSellers = await prisma.product.findMany({
    take: 3,
    orderBy: { createdAt: "asc" },
    include: { category: true }
  });

  const categories = await prisma.category.findMany();

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      
      {/* Dynamic Categories Section */}
      <section className="pt-16 pb-8 bg-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-4 overflow-x-auto pb-4 hide-scrollbar">
            {categories.map(cat => (
              <Link 
                key={cat.id} 
                href={`/catalogue?category=${cat.slug}`}
                className="px-6 py-2 rounded-full border border-cocoa-200 text-primary whitespace-nowrap hover:border-accent hover:text-accent hover:bg-amber-50 transition-colors font-medium"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="bestsellers" className="py-16 bg-beige scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">{t("home.best_sellers")}</h2>
            <div className="mt-4 flex justify-center">
              <div className="h-1 w-24 bg-accent rounded"></div>
            </div>
            <p className="mt-6 text-lg text-cocoa-500 max-w-2xl mx-auto">
              {t("home.best_sellers_desc")}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Highlight Section */}
      <section className="py-24 bg-primary text-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-cocoa-900 rounded-3xl p-8 md:p-16 border border-cocoa-800 shadow-xl overflow-hidden relative">
          <div className="relative z-10 lg:w-1/2">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">{t("home.amd_diff")}</h2>
            <p className="text-lg text-cocoa-200 mb-8 font-light leading-relaxed">
              {t("home.amd_diff_desc")}
            </p>
            <div className="flex gap-4">
              <div className="bg-cocoa-800 p-4 rounded-xl border border-cocoa-700 w-1/2">
                <p className="text-3xl font-bold text-accent mb-2">100%</p>
                <p className="text-sm text-cocoa-300">{t("footer.organic")}</p>
              </div>
              <div className="bg-cocoa-800 p-4 rounded-xl border border-cocoa-700 w-1/2">
                <p className="text-3xl font-bold text-accent mb-2">50+</p>
                <p className="text-sm text-cocoa-300">{t("footer.partner_farms")}</p>
              </div>
            </div>
          </div>
          {/* Abstract background decorative elements */}
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 bg-accent rounded-l-full filter blur-3xl transform translate-x-1/3"></div>
        </div>
      </section>
    </div>
  );
}
