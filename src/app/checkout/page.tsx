"use client";

import { useCart } from "@/context/CartContext";
import { useTranslation } from "@/context/TranslationContext";
import { useState, useEffect } from "react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    email: "",
  });
  
  const [paymentMethod, setPaymentMethod] = useState("Mobile Money");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="bg-beige min-h-screen py-24 flex flex-col items-center justify-center">
        <ShoppingBag className="h-20 w-20 text-cocoa-200 mb-6" />
        <h1 className="text-3xl font-bold text-primary mb-4">{t("checkout.empty_title")}</h1>
        <p className="text-cocoa-500 mb-8">{t("checkout.empty_subtitle")}</p>
        <Link 
          href="/shop" 
          className="px-8 py-3 bg-accent text-primary font-bold rounded hover:bg-[#d4a844] transition-colors"
        >
          {t("checkout.return_shop")}
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to database first
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.fullName,
          customerPhone: formData.phone,
          customerAddr: formData.address,
          customerCity: formData.city,
          customerEmail: formData.email,
          totalPrice,
          paymentMethod,
          items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity }))
        })
      });
    } catch (err) {
      console.error("Failed to save order to DB", err);
    }

    // Construct message
    let message = `Hello AMD Cocoa, I would like to place a new order!\n\n`;
    message += `*Order Summary:*\n`;
    items.forEach(item => {
      message += `- ${item.quantity}x ${item.name} (${(item.price * item.quantity).toFixed(0)} FCFA)\n`;
    });
    message += `\n*Total Due: ${totalPrice.toFixed(0)} FCFA*\n\n`;
    
    message += `*Customer Details:*\n`;
    message += `Name: ${formData.fullName}\n`;
    message += `Phone: ${formData.phone}\n`;
    message += `Address: ${formData.address}\n`;
    message += `City: ${formData.city}\n`;
    if (formData.email) {
      message += `Email: ${formData.email}\n`;
    }
    
    message += `\n*Payment Method:* ${paymentMethod}\n`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/237653522435?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Clear the cart
    clearCart();
    
    // Redirect home
    window.location.href = "/";
  };

  return (
    <div className="bg-beige min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-12">{t("checkout.title")}</h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Form Section */}
          <div className="flex-1 lg:w-2/3">
            <form onSubmit={handleConfirmOrder} className="space-y-8">
              
              {/* Customer Info */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-cocoa-50">
                <h2 className="text-xl font-bold text-primary mb-6 border-b border-cocoa-50 pb-4">{t("checkout.customer_info")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-primary mb-1">{t("checkout.full_name")} *</label>
                    <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-md border border-cocoa-200 focus:ring-accent focus:border-accent outline-none transition-colors text-primary bg-white"/>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-primary mb-1">{t("checkout.phone")} *</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 rounded-md border border-cocoa-200 focus:ring-accent focus:border-accent outline-none transition-colors text-primary bg-white"/>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-primary mb-1">{t("checkout.address")} *</label>
                    <input required type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-3 rounded-md border border-cocoa-200 focus:ring-accent focus:border-accent outline-none transition-colors text-primary bg-white"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">{t("checkout.city")} *</label>
                    <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 rounded-md border border-cocoa-200 focus:ring-accent focus:border-accent outline-none transition-colors text-primary bg-white"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">{t("checkout.email_optional")} <span className="text-cocoa-400 font-normal">({t("checkout.optional")})</span></label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-md border border-cocoa-200 focus:ring-accent focus:border-accent outline-none transition-colors text-primary bg-white"/>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-cocoa-50">
                <h2 className="text-xl font-bold text-primary mb-6 border-b border-cocoa-50 pb-4">{t("checkout.payment_title")}</h2>
                <div className="space-y-4">
                  {['Mobile Money', 'Orange Money', 'Cash on Delivery', 'Bank Transfer'].map((method) => (
                    <label key={method} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === method ? 'border-accent bg-amber-50/50' : 'border-cocoa-200 hover:border-accent'}`}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value={method} 
                        checked={paymentMethod === method}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 text-accent focus:ring-accent border-gray-300"
                      />
                      <span className="ml-3 block text-sm font-medium text-primary">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="w-full flex items-center justify-center px-8 py-5 text-lg font-bold rounded-md text-primary bg-accent hover:bg-[#d4a844] hover:-translate-y-0.5 shadow-lg shadow-accent/30 transition-all active:scale-[0.98]"
              >
                {t("checkout.confirm_btn")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <p className="text-center text-sm text-cocoa-400 mt-4">
                {t("checkout.whatsapp_note")}
              </p>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-cocoa-50 sticky top-28">
              <h2 className="text-xl font-bold text-primary mb-6 border-b border-cocoa-50 pb-4">{t("checkout.order_summary")}</h2>
              <ul className="space-y-6 mb-6">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-cocoa-50 rounded border border-cocoa-100 overflow-hidden relative flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 flex justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-primary line-clamp-2">{item.name}</h3>
                        <p className="text-xs text-cocoa-500 mt-1">{t("checkout.qty")}: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-primary whitespace-nowrap">
                        {(item.price * item.quantity).toFixed(0)} FCFA
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="border-t border-cocoa-50 pt-4 space-y-3">
                <div className="flex justify-between text-sm text-cocoa-500">
                  <p>{t("checkout.subtotal")}</p>
                  <p>{totalPrice.toFixed(0)} FCFA</p>
                </div>
                <div className="flex justify-between text-sm text-cocoa-500 block">
                  <p>{t("checkout.shipping")}</p>
                  <p>{t("checkout.shipping_later")}</p>
                </div>
                <div className="flex justify-between text-xl font-bold text-primary pt-4 border-t border-cocoa-50">
                  <p>{t("checkout.total")}</p>
                  <p className="text-accent-secondary">{totalPrice.toFixed(0)} FCFA</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
