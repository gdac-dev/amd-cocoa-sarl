"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Globe, Menu, X, LogOut, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useTranslation } from "@/context/TranslationContext";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const { t, language, setLanguage } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const isLoggedIn = status === "authenticated" && !!session?.user;

  const closeMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = async () => {
    closeMenu();
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  // Auth section for desktop — hidden while loading to avoid flash
  const DesktopAuthSection = () => {
    if (isLoading) {
      return <div className="hidden lg:block h-8 w-24 rounded-full bg-cocoa-100 animate-pulse" />;
    }
    if (isLoggedIn) {
      return (
        <div className="hidden lg:flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-primary border border-cocoa-200 px-3 py-1.5 rounded-full select-none">
            <User className="w-3.5 h-3.5 text-accent shrink-0" />
            {session.user?.name?.split(" ")[0]}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm font-medium text-red-600 border border-red-200 px-3 py-1.5 rounded-full
                       transition-all duration-200 cursor-pointer
                       hover:bg-red-50 hover:border-red-400 hover:text-red-700 hover:shadow-sm
                       active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            {t("nav.logout")}
          </button>
        </div>
      );
    }
    return (
      <Link
        href="/login"
        className="hidden lg:flex items-center text-primary hover:text-accent font-medium transition-colors text-sm border border-cocoa-200 px-4 py-1.5 rounded-full hover:border-accent"
      >
        {t("nav.login")}
      </Link>
    );
  };

  // Auth section for mobile menu
  const MobileAuthSection = () => {
    if (isLoading) {
      return <div className="h-12 w-full rounded-lg bg-cocoa-100 animate-pulse" />;
    }
    if (isLoggedIn) {
      return (
        <>
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
            <User className="w-4 h-4 text-accent shrink-0" />
            <span className="font-semibold text-primary text-sm truncate">{session?.user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-200
                       rounded-lg px-4 py-3 font-medium transition-all duration-200
                       cursor-pointer hover:bg-red-100 hover:border-red-400 active:scale-95"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {t("nav.logout")}
          </button>
        </>
      );
    }
    return (
      <Link
        href="/login"
        onClick={closeMenu}
        className="block text-center bg-primary text-white hover:bg-primary-light rounded-lg px-4 py-3 font-medium transition-colors"
      >
        {t("nav.login")}
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link href="/" onClick={closeMenu} className="flex items-center gap-2 text-2xl font-bold text-accent font-['var(--font-dancing-script)']">
            <Image src="/logo.png" alt="AMD Logo" width={32} height={32} className="object-contain" />
            <span>AMD</span>
          </Link>

          {/* Desktop Nav Links */}
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

          {/* Right Controls */}
          <div className="flex items-center gap-2 md:gap-3">

            {/* Language Toggle — desktop */}
            <div className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-primary">
              <Globe className="w-4 h-4 text-accent" />
              <button
                onClick={() => setLanguage("en")}
                className={`px-1 hover:text-accent transition-colors ${language === "en" ? "text-accent font-bold" : ""}`}
              >
                EN
              </button>
              <span className="text-cocoa-300">|</span>
              <button
                onClick={() => setLanguage("fr")}
                className={`px-1 hover:text-accent transition-colors ${language === "fr" ? "text-accent font-bold" : ""}`}
              >
                FR
              </button>
            </div>

            {/* Desktop Auth */}
            <DesktopAuthSection />

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-primary hover:text-accent transition-colors focus:outline-none cursor-pointer"
              aria-label={t("nav.cart")}
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-accent-secondary rounded-full transform translate-x-1/4 -translate-y-1/4">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Hamburger — mobile */}
            <button
              className="lg:hidden p-2 text-primary hover:text-accent cursor-pointer transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-cocoa-50 absolute w-full shadow-lg overflow-y-auto animate-in fade-in slide-in-from-top-4">
          <div className="px-4 pt-4 pb-8 flex flex-col gap-2">

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

            <div className="border-t border-cocoa-100 pt-4 flex flex-col gap-3">
              <MobileAuthSection />
            </div>

            {/* Language Toggle — mobile */}
            <div className="flex items-center justify-center gap-4 pt-2 text-sm font-semibold text-primary">
              <button
                onClick={() => { setLanguage("en"); closeMenu(); }}
                className={`py-2 px-6 rounded-full border transition-colors cursor-pointer ${language === "en" ? "border-accent text-accent bg-amber-50" : "border-cocoa-200 hover:border-accent hover:text-accent"}`}
              >
                English
              </button>
              <button
                onClick={() => { setLanguage("fr"); closeMenu(); }}
                className={`py-2 px-6 rounded-full border transition-colors cursor-pointer ${language === "fr" ? "border-accent text-accent bg-amber-50" : "border-cocoa-200 hover:border-accent hover:text-accent"}`}
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
