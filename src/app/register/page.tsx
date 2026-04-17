"use client";

import { useState, useTransition } from "react";
import { registerUser } from "./actions";
import { useTranslation } from "@/context/TranslationContext";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha";

export default function RegisterPage() {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSeller, setIsSeller] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await registerUser(null, formData);
      if (res?.error) {
        setErrorMessage(res.error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-beige flex items-center justify-center p-4 py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-xl shadow-lg border border-cocoa-100 p-8"
      >
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex flex-col items-center gap-2 mb-4">
            <Image src="/logo.png" alt="AMD Logo" width={48} height={48} className="object-contain cursor-pointer" />
            <span className="text-3xl font-bold text-accent font-['var(--font-dancing-script)']">AMD</span>
          </Link>
          <h2 className="text-3xl font-bold text-primary">{t("auth.signup_title")}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">{t("auth.name")}</label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-3 rounded-md border border-cocoa-200 focus:ring-accent focus:border-accent outline-none text-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">{t("auth.email")}</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-3 rounded-md border border-cocoa-200 focus:ring-accent focus:border-accent outline-none text-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">{t("auth.password")}</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-md border border-cocoa-200 focus:ring-accent focus:border-accent outline-none text-primary"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              name="isSeller" 
              id="isSeller"
              checked={isSeller}
              onChange={(e) => setIsSeller(e.target.checked)}
              className="w-4 h-4 text-accent border-cocoa-200 rounded focus:ring-accent"
            />
            <label htmlFor="isSeller" className="text-sm font-medium text-primary">{t("auth.are_you_seller")}</label>
          </div>

          {isSeller && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
              <label className="block text-sm font-medium text-primary mb-1">{t("auth.shop_name")}</label>
              <input
                type="text"
                name="shopName"
                required={isSeller}
                className="w-full px-4 py-3 rounded-md border border-cocoa-200 focus:ring-accent focus:border-accent outline-none text-primary"
              />
            </motion.div>
          )}

          <div className="flex justify-center">
            {/* Using a mocked test sitekey for development. User can swap via env later. */}
            <ReCAPTCHA sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary text-white font-bold py-3 px-4 rounded hover:bg-primary-light transition-colors disabled:opacity-50"
          >
            {isPending ? "..." : t("auth.submit")}
          </button>
          
          <div className="text-center mt-4">
            <Link href="/login" className="text-sm text-accent hover:underline">
              {t("auth.already_have_account")}
            </Link>
          </div>
        </form>

        {errorMessage && (
          <div className="text-red-500 text-sm text-center mt-4">
            {errorMessage}
          </div>
        )}
      </motion.div>
    </div>
  );
}
