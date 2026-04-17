"use client";

import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useTranslation } from "@/context/TranslationContext";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const { t } = useTranslation();

  // Prevent scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[60] transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-beige shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full bg-white">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-cocoa-100 bg-beige">
            <h2 className="text-lg font-bold text-primary flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5 text-accent" />
              {t("cart.title")}
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-cocoa-400 hover:text-primary transition-colors focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 bg-beige">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-cocoa-400">
                <ShoppingBag className="h-16 w-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">{t("cart.empty")}</p>
                <Link 
                  href="/catalogue" 
                  className="mt-6 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-light transition-colors"
                  onClick={() => setIsCartOpen(false)}
                >
                  {t("cart.start_shopping")}
                </Link>
              </div>
            ) : (
              <ul className="space-y-6">
                {items.map((item) => (
                  <li key={item.id} className="flex py-2">
                    <div className="flex-shrink-0 w-20 h-20 bg-cocoa-50 rounded-md overflow-hidden border border-cocoa-100 relative">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="ml-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between text-base font-medium text-primary">
                          <h3 className="line-clamp-1">{item.name}</h3>
                          <p className="ml-4 whitespace-nowrap">{(item.price * item.quantity).toFixed(0)} FCFA</p>
                        </div>
                        <p className="mt-1 text-sm text-cocoa-500">{item.price.toFixed(0)} FCFA {t("cart.each")}</p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center border border-cocoa-200 rounded-md">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 px-2 text-cocoa-500 hover:text-primary transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 font-medium text-primary">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 px-2 text-cocoa-500 hover:text-primary transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="flex">
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="font-medium text-accent hover:text-accent-secondary transition-colors"
                          >
                            {t("cart.remove")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-cocoa-100 px-6 py-6 sm:px-6 bg-white">
              <div className="flex justify-between text-base font-medium text-primary mb-4">
                <p>{t("cart.subtotal")}</p>
                <p className="text-xl">{totalPrice.toFixed(0)} FCFA</p>
              </div>
              <p className="mt-0.5 text-sm text-cocoa-500 mb-6">
                {t("cart.shipping_taxes")}
              </p>
              <div className="mt-6">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="flex items-center justify-center rounded-md border border-transparent bg-primary px-6 py-3.5 text-base font-medium text-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all w-full"
                >
                  {t("cart.checkout")}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
