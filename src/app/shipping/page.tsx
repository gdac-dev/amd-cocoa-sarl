import { getTranslation } from "@/lib/translations";
import { Truck, RotateCcw, Package, Globe } from "lucide-react";
import Link from "next/link";

export default async function ShippingPage() {
  const { t } = await getTranslation();
  
  return (
    <div className="bg-beige min-h-screen py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-4 font-serif">
            {t("shipping_new.hero_title")}
          </h1>
          <p className="text-xl text-cocoa-500 max-w-2xl mx-auto">
            {t("shipping_new.hero_desc")}
          </p>
        </div>

        <div className="space-y-12">
          
          {/* Section 1 */}
          <div className="bg-white p-8 rounded-2xl border border-cocoa-100 shadow-sm flex flex-col md:flex-row gap-6 items-start">
            <div className="p-4 bg-amber-50 rounded-xl text-amber-600 shrink-0">
              <Truck className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary mb-3">{t("shipping_new.sec1_title")}</h2>
              <p className="text-cocoa-600 leading-relaxed mb-4">
                {t("shipping_new.sec1_desc")}
              </p>
              <ul className="list-disc list-inside text-cocoa-500 space-y-2">
                <li>{t("shipping_new.sec1_li1")}</li>
                <li>{t("shipping_new.sec1_li2")}</li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-white p-8 rounded-2xl border border-cocoa-100 shadow-sm flex flex-col md:flex-row gap-6 items-start">
            <div className="p-4 bg-blue-50 rounded-xl text-blue-600 shrink-0">
              <Globe className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary mb-3">{t("shipping_new.sec2_title")}</h2>
              <p className="text-cocoa-600 leading-relaxed mb-4">
                {t("shipping_new.sec2_desc1")}
              </p>
              <p className="text-cocoa-600 leading-relaxed">
                {t("shipping_new.sec2_desc2")}<Link href="/contact" className="text-accent font-bold hover:underline">{t("shipping_new.sec2_desc3")}</Link>{t("shipping_new.sec2_desc4")}
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white p-8 rounded-2xl border border-cocoa-100 shadow-sm flex flex-col md:flex-row gap-6 items-start">
            <div className="p-4 bg-red-50 rounded-xl text-red-600 shrink-0">
              <RotateCcw className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary mb-3">{t("shipping_new.sec3_title")}</h2>
              <p className="text-cocoa-600 leading-relaxed mb-4">
                {t("shipping_new.sec3_desc")}
              </p>
              <ul className="list-disc list-inside text-cocoa-500 space-y-2">
                <li>{t("shipping_new.sec3_li1")}</li>
                <li>{t("shipping_new.sec3_li2")}</li>
                <li>{t("shipping_new.sec3_li3")}</li>
              </ul>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-white p-8 rounded-2xl border border-cocoa-100 shadow-sm flex flex-col md:flex-row gap-6 items-start">
            <div className="p-4 bg-green-50 rounded-xl text-green-600 shrink-0">
              <Package className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary mb-3">{t("shipping_new.sec4_title")}</h2>
              <p className="text-cocoa-600 leading-relaxed">
                {t("shipping_new.sec4_desc")}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
