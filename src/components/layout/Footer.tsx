"use client";

import Link from "next/link";
import Image from "next/image";
import { Leaf, ShieldCheck, HeartHandshake } from "lucide-react";
import { useTranslation } from "@/context/TranslationContext";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-primary text-beige">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center gap-2 text-2xl font-bold text-accent font-['var(--font-dancing-script)']">
              <Image src="/logo.png" alt="AMD Logo" width={32} height={32} className="object-contain" />
              <span>AMD</span>
            </div>
            <p className="text-cocoa-200 text-base">
              {t("footer.desc")}
            </p>
            <div className="flex space-x-6">
              {/* Dummy social icons can go here */}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-accent tracking-wider uppercase">{t("footer.shop")}</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/catalogue" className="text-base text-cocoa-200 hover:bg-accent hover:text-white px-2 py-1 -ml-2 rounded transition-colors inline-block">
                      {t("footer.all_products")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/shops" className="text-base text-cocoa-200 hover:bg-accent hover:text-white px-2 py-1 -ml-2 rounded transition-colors inline-block">
                      {t("footer.our_shops")}
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-accent tracking-wider uppercase">{t("footer.support")}</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/about" className="text-base text-cocoa-200 hover:bg-accent hover:text-white px-2 py-1 -ml-2 rounded transition-colors inline-block">
                      {t("footer.about_us")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-base text-cocoa-200 hover:bg-accent hover:text-white px-2 py-1 -ml-2 rounded transition-colors inline-block">
                      {t("footer.contact_us")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/shipping" className="text-base text-cocoa-200 hover:bg-accent hover:text-white px-2 py-1 -ml-2 rounded transition-colors inline-block">
                      {t("footer.shipping_returns")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="text-base text-cocoa-200 hover:bg-accent hover:text-white px-2 py-1 -ml-2 rounded transition-colors inline-block">
                      {t("footer.faq")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Value Proposition Strip */}
        <div className="mt-12 pt-8 border-t border-cocoa-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-cocoa-200">
            <Leaf className="h-5 w-5 text-accent-secondary" />
            <span className="text-sm">{t("footer.organic")}</span>
          </div>
          <div className="flex items-center space-x-2 text-cocoa-200">
            <ShieldCheck className="h-5 w-5 text-accent-secondary" />
            <span className="text-sm">{t("footer.premium")}</span>
          </div>
          <div className="flex items-center space-x-2 text-cocoa-200">
            <HeartHandshake className="h-5 w-5 text-accent-secondary" />
            <span className="text-sm">{t("footer.fairtrade")}</span>
          </div>
        </div>

        <div className="mt-8 border-t border-cocoa-800 pt-8 flex items-center justify-between">
          <p className="text-base text-cocoa-300 xl:text-center">
            &copy; {new Date().getFullYear()} AMD Cocoa. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
