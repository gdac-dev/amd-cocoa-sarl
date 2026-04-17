import { ProductCard } from "@/components/ui/ProductCard";
import { prisma } from "@/lib/prisma";
import { getTranslation } from "@/lib/translations";
import Link from "next/link";
import { CatalogueFilter } from "@/components/ui/CatalogueFilter";

export default async function CataloguePage(props: { searchParams?: Promise<{ category?: string, q?: string, sort?: string, sellerId?: string }> }) {
  const { t } = await getTranslation();
  const searchParams = await props.searchParams;
  const categorySlug = searchParams?.category;
  const query = searchParams?.q || "";
  const sort = searchParams?.sort || "latest";
  const sellerId = searchParams?.sellerId;

  let orderBy: any = {};
  switch (sort) {
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    case "price_low":
      orderBy = { price: "asc" };
      break;
    case "price_high":
      orderBy = { price: "desc" };
      break;
    case "popularity":
      orderBy = { stock: "asc" }; // Mock popularity
      break;
    case "latest":
    default:
      orderBy = { createdAt: "desc" };
  }

  const where: any = {};
  if (categorySlug) {
    where.category = { slug: categorySlug };
  }
  if (sellerId) {
    where.sellerId = sellerId;
  }
  if (query) {
    where.OR = [
      { name: { contains: query } },
      { description: { contains: query } },
      { category: { name: { contains: query } } }
    ];
  }

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: { category: true }
  });

  const categories = await prisma.category.findMany();

  return (
    <div className="bg-beige min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="border-b border-cocoa-200 pb-10 mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
              {t("catalogue.title")}
            </h1>
            <p className="mt-4 text-lg text-cocoa-500 max-w-2xl">
              {t("footer.desc")}
            </p>
          </div>

          <CatalogueFilter 
            query={query}
            sort={sort}
            categorySlug={categorySlug}
            tSearch={t("catalogue.search")}
            tLatest={t("catalogue.filter_latest")}
            tOldest={t("catalogue.filter_oldest")}
            tLow={t("catalogue.filter_price_low")}
            tHigh={t("catalogue.filter_price_high")}
            tPop={t("catalogue.filter_popularity")}
          />
        </div>

        {/* Categories Dynamic Pilling */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link href="/catalogue" className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${!categorySlug ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-cocoa-200 hover:border-accent'}`}>
            {t("footer.all_products")}
          </Link>
          {categories.map(cat => (
             <Link key={cat.id} href={`/catalogue?category=${cat.slug}`} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${categorySlug === cat.slug ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-cocoa-200 hover:border-accent'}`}>
               {cat.name}
             </Link>
          ))}
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="py-20 text-center">
            <h3 className="text-2xl text-primary font-bold">{t("catalogue.no_products")}</h3>
            <p className="text-cocoa-400 mt-2">{t("catalogue.no_products_hint")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
