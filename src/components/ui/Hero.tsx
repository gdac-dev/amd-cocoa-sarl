import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslation } from "@/lib/translations";

export async function Hero() {
  const { t } = await getTranslation();

  return (
    <div className="relative bg-primary min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/hero_cocoa_banner_1775744171416.png"
          alt="Premium Cocoa Beans and Chocolate"
          fill
          className="object-cover opacity-40 mix-blend-overlay"
          priority
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-beige tracking-tight mb-6 drop-shadow-lg">
          {t("hero.title_part1")} <span className="text-accent">{t("hero.title_part2")}</span>
        </h1>
        <p className="mt-4 text-xl sm:text-2xl text-white max-w-3xl mx-auto font-light leading-relaxed mb-10">
          {t("hero.subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-sm text-primary bg-accent hover:bg-[#d4a844] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            {t("hero.shop_now")}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link
            href="#bestsellers"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-sm text-beige border border-cocoa-500 hover:bg-cocoa-800 transition-all"
          >
            {t("hero.explore_bestsellers")}
          </Link>
        </div>
      </div>
    </div>
  );
}
