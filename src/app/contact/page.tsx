"use client";

import { useTranslation } from "@/context/TranslationContext";
import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      if (!res.ok) throw new Error("Failed to submit. Please try again.");
      setSuccess(true);
      e.currentTarget.reset();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-beige min-h-screen py-16 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full px-4 sm:px-6">
        <h1 className="text-4xl font-extrabold text-primary tracking-tight mb-4 text-center">
          {t("footer.contact_us")}
        </h1>
        <p className="text-cocoa-500 mb-8 text-center">{t("contact.subtitle")}</p>
        
        {success ? (
          <div className="bg-green-50 border border-green-200 text-green-700 p-8 rounded-xl shadow-sm text-center">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
            <p>Thank you for reaching out. We have sent a confirmation to your email address and will reply shortly.</p>
            <button onClick={() => setSuccess(false)} className="mt-6 text-sm font-bold text-accent hover:underline">
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-cocoa-100 shadow-sm space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-primary mb-1">Name *</label>
                <input required name="name" type="text" className="w-full px-4 py-3 border border-cocoa-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-primary mb-1">Email Address *</label>
                <input required name="email" type="email" className="w-full px-4 py-3 border border-cocoa-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-primary mb-1">Phone Number <span className="text-cocoa-400 font-normal">(Optional)</span></label>
                <input name="phone" type="tel" className="w-full px-4 py-3 border border-cocoa-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-primary mb-1">Message *</label>
                <textarea required name="message" rows={5} className="w-full px-4 py-3 border border-cocoa-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all"></textarea>
              </div>
            </div>
            <button 
              disabled={isSubmitting}
              type="submit" 
              className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 mt-2 rounded-lg hover:bg-primary-light active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
               {isSubmitting ? "Sending..." : "Send Message"}
               <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
