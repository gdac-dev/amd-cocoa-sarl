import { getTranslation } from "@/lib/translations";
import Image from "next/image";
import Link from "next/link";
import { Handshake, Target, Globe, ArrowRight } from "lucide-react";

export default async function AboutPage() {
  const { t } = await getTranslation();
  
  return (
    <div className="bg-beige min-h-screen">
      
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-primary text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <Image 
            src="/farmers_group.png" 
            alt="Cocoa Farmers" 
            fill 
            className="object-cover" 
            priority
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 font-serif">
            {t("nav.about_us")}
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 font-light leading-relaxed">
            {t("about_new.hero_desc")}
          </p>
        </div>
      </section>

      {/* Heritage & Sourcing Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-800 font-bold text-sm tracking-widest uppercase">
                <Target className="w-4 h-4" /> {t("about_new.mission")}
              </div>
              <h2 className="text-4xl font-bold text-primary leading-tight">
                {t("about.sourcing_title")}
              </h2>
              <p className="text-lg text-cocoa-600 leading-relaxed">
                {t("about.intro")}
              </p>
              <p className="text-lg text-cocoa-600 leading-relaxed">
                {t("about.body")}
              </p>
              <div className="pt-4 flex gap-8 border-t border-cocoa-200">
                <div>
                  <p className="text-5xl font-extrabold text-accent mb-2">15+</p>
                  <p className="text-sm font-bold text-cocoa-400 uppercase tracking-wider">{t("about_new.stats_years")}</p>
                </div>
                <div>
                  <p className="text-5xl font-extrabold text-accent mb-2">10k+</p>
                  <p className="text-sm font-bold text-cocoa-400 uppercase tracking-wider">{t("about_new.stats_farmers")}</p>
                </div>
              </div>
            </div>

            <div className=" relative h-[600px] rounded-2xl overflow-hidden shadow-2xl block border-8 border-white group">
              <Image 
                src="/farmer_portrait.png" 
                alt="Farmer Portrait" 
                fill 
                className="object-cover transform group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="font-bold text-xl italic hover:text-accent transition-colors">{t("about_new.quote")}</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-24 bg-white border-t border-cocoa-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cocoa-50 text-cocoa-600 font-bold text-sm tracking-widest uppercase mb-6">
            <Handshake className="w-4 h-4" /> Global Collaboration
          </div>
          <h2 className="text-4xl font-bold text-primary mb-6">{t("about_new.partners_title")}</h2>
          <p className="text-lg text-cocoa-500 max-w-3xl mx-auto mb-16">
            {t("about_new.partners_desc")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Chococam */}
            <div className="bg-beige border border-cocoa-100 rounded-2xl p-8 hover:-translate-y-2 transition-all shadow-sm hover:shadow-xl group text-left">
              <div className="w-16 h-16 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl font-black mb-6 group-hover:scale-110 transition-transform">
                C
              </div>
              <h3 className="text-2xl font-bold text-primary mb-3">Chococam</h3>
              <p className="text-cocoa-500 mb-6 line-clamp-3">
                {t("about_new.chococam_desc")}
              </p>
              <a href="https://www.chococam.net" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-accent font-bold hover:underline">
                {t("about_new.visit_website")} <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>

            {/* Neo Industries */}
            <div className="bg-beige border border-cocoa-100 rounded-2xl p-8 hover:-translate-y-2 transition-all shadow-sm hover:shadow-xl group text-left">
              <div className="w-16 h-16 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-black mb-6 group-hover:scale-110 transition-transform">
                N
              </div>
              <h3 className="text-2xl font-bold text-primary mb-3">Neo Industries</h3>
              <p className="text-cocoa-500 mb-6 line-clamp-3">
                {t("about_new.neo_desc")}
              </p>
              <a href="https://neoindustry.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-accent font-bold hover:underline">
                {t("about_new.visit_website")} <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>

            {/* SIC Cacaos */}
            <div className="bg-beige border border-cocoa-100 rounded-2xl p-8 hover:-translate-y-2 transition-all shadow-sm hover:shadow-xl group text-left">
              <div className="w-16 h-16 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-2xl font-black mb-6 group-hover:scale-110 transition-transform">
                S
              </div>
              <h3 className="text-2xl font-bold text-primary mb-3">SIC Cacaos</h3>
              <p className="text-cocoa-500 mb-6 line-clamp-3">
                {t("about_new.sic_desc")}
              </p>
              <a href="https://www.barry-callebaut.com/en-AF/sic-cacaos" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-accent font-bold hover:underline">
                {t("about_new.visit_website")} <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
