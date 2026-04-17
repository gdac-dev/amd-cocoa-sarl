"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Globe, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useTranslation } from "@/context/TranslationContext";
import { useState } from "react";

export function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const { t, language, setLanguage } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when a link is clicked
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <Link href="/" onClick={closeMenu} className="flex items-center gap-2 text-2xl font-bold text-accent font-['var(--font-dancing-script)']">
            <Image src="/logo.png" alt="AMD Logo" width={32} height={32} className="object-contain" />
            <span>AMD</span>
          </Link>
          
          {/* Desktop Navigation Map: Home > About Us > Catalogue > Our Shops > Contact Us */}
          <div className="hidden lg:flex space-x-8">
            <Link href="/" className="text-primary hover:text-accent font-medium transition-colors">
              {t("nav.home")}
            </Link>
            <Link href="/about" className="text-primary hover:text-accent font-medium transition-colors">
              {t("nav.about_us")}
            </Link>
            <Link href="/catalogue" className="text-primary hover:text-accent font-medium transition-colors">
              {t("nav.catalogue")}
            </Link>
            <Link href="/shops" className="text-primary hover:text-accent font-medium transition-colors">
              {t("nav.our_shops")}
            </Link>
            <Link href="/contact" className="text-primary hover:text-accent font-medium transition-colors">
              {t("nav.contact_us")}
            </Link>
          </div>

          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm font-semibold text-primary">
              <Globe className="w-4 h-4 text-accent" />
              <button 
                onClick={() => setLanguage("en")} 
                className={`hover:text-accent transition-colors ${language === "en" ? "text-accent" : ""}`}
              >
                EN
              </button>
              <span>|</span>
              <button 
                onClick={() => setLanguage("fr")} 
                className={`hover:text-accent transition-colors ${language === "fr" ? "text-accent" : ""}`}
              >
                FR
              </button>
            </div>
            
            <Link href="/login" className="hidden lg:block text-primary hover:text-accent font-medium transition-colors text-sm border border-cocoa-200 px-4 py-1.5 rounded-full">
              {t("nav.login")}
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-primary hover:text-accent transition-colors focus:outline-none"
              aria-label={t("nav.cart")}
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-accent-secondary rounded-full transform translate-x-1/4 -translate-y-1/4">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Hamburger Icon for Mobile */}
            <button 
              className="lg:hidden p-2 text-primary hover:text-accent"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-cocoa-50 absolute w-full shadow-lg max-h-screen overflow-y-auto animate-in fade-in slide-in-from-top-4">
          <div className="px-4 pt-4 pb-8 space-y-4 flex flex-col">
            <Link href="/" onClick={closeMenu} className="block text-primary hover:bg-cocoa-50 rounded-lg px-4 py-3 font-medium transition-colors">
              {t("nav.home")}
            </Link>
            <Link href="/about" onClick={closeMenu} className="block text-primary hover:bg-cocoa-50 rounded-lg px-4 py-3 font-medium transition-colors">
              {t("nav.about_us")}
            </Link>
            <Link href="/catalogue" onClick={closeMenu} className="block text-primary hover:bg-cocoa-50 rounded-lg px-4 py-3 font-medium transition-colors">
              {t("nav.catalogue")}
            </Link>
            <Link href="/shops" onClick={closeMenu} className="block text-primary hover:bg-cocoa-50 rounded-lg px-4 py-3 font-medium transition-colors">
              {t("nav.our_shops")}
            </Link>
            <Link href="/contact" onClick={closeMenu} className="block text-primary hover:bg-cocoa-50 rounded-lg px-4 py-3 font-medium transition-colors">
              {t("nav.contact_us")}
            </Link>
            
            <div className="border-t border-cocoa-100 my-2 pt-4"></div>
            
            <Link href="/login" onClick={closeMenu} className="block text-center bg-primary text-white hover:bg-primary-light rounded-lg px-4 py-3 font-medium transition-colors">
              {t("nav.login")}
            </Link>

            <div className="flex items-center justify-center space-x-6 pt-4 text-sm font-semibold text-primary">
              <button 
                onClick={() => { setLanguage("en"); closeMenu(); }} 
                className={`py-2 px-6 rounded-full border ${language === "en" ? "border-accent text-accent bg-amber-50" : "border-cocoa-200"}`}
              >
                English
              </button>
              <button 
                onClick={() => { setLanguage("fr"); closeMenu(); }} 
                className={`py-2 px-6 rounded-full border ${language === "fr" ? "border-accent text-accent bg-amber-50" : "border-cocoa-200"}`}
              >
                Français
              </button>
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}
