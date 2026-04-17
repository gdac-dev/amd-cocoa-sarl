import { getTranslation } from "@/lib/translations";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export default async function FAQPage() {
  const { t } = await getTranslation();

  const faqs = [
    {
      q: t("faq.q1"),
      a: t("footer.organic") + t("faq.a1_suffix")
    },
    {
      q: t("faq.q2"),
      a: t("faq.a2")
    },
    {
      q: t("faq_new.q3"),
      a: t("faq_new.a3")
    },
    {
      q: t("faq_new.q4"),
      a: t("faq_new.a4")
    },
    {
      q: t("faq_new.q5"),
      a: t("faq_new.a5")
    }
  ];
  
  return (
    <div className="bg-beige min-h-screen py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-4 font-serif">
            {t("faq_new.hero_title")}
          </h1>
          <p className="text-lg text-cocoa-500">
            {t("faq_new.hero_desc")}<Link href="/contact" className="text-accent hover:underline font-bold">{t("faq_new.hero_link")}</Link>.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details key={idx} className="bg-white p-6 rounded-xl border border-cocoa-200 group transition-all duration-300 hover:shadow-sm">
              <summary className="text-lg font-bold text-primary cursor-pointer list-none flex justify-between items-center outline-none">
                {faq.q}
                <span className="transition-transform duration-300 group-open:-rotate-180 text-accent">
                  <ChevronDown className="w-5 h-5" />
                </span>
              </summary>
              <div className="text-cocoa-600 mt-4 leading-relaxed pr-6 border-t border-cocoa-50 pt-4 opacity-0 group-open:opacity-100 transition-opacity duration-300">
                {faq.a}
              </div>
            </details>
          ))}
        </div>

      </div>
    </div>
  );
}
