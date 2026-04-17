"use client";

import { useState, useTransition } from "react";
import { preAuthenticate, verify2FA } from "./actions";
import { useTranslation } from "@/context/TranslationContext";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");
  
  const [requires2FA, setRequires2FA] = useState(false);
  const [emailFor2FA, setEmailFor2FA] = useState("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    
    startTransition(async () => {
      const res = await preAuthenticate(null, formData);
      if (res?.error) {
        setErrorMessage(res.error);
      } else if (res?.requires2FA) {
        setRequires2FA(true);
        setEmailFor2FA(email);
      }
    });
  };

  const handle2FA = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    const formData = new FormData(e.currentTarget);
    formData.append("email", emailFor2FA);
    
    startTransition(async () => {
      const res = await verify2FA(null, formData);
      if (res?.error) {
        setErrorMessage(res.error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-beige flex items-center justify-center p-4">
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
          <h2 className="text-3xl font-bold text-primary">{t("auth.login_title")}</h2>
        </div>

        {!requires2FA ? (
          <form onSubmit={handleLogin} className="space-y-6">
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
                className="w-full px-4 py-3 rounded-md border border-cocoa-200 focus:ring-accent focus:border-accent outline-none text-primary"
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary text-white font-bold py-3 px-4 rounded hover:bg-primary-light transition-colors disabled:opacity-50"
            >
              {isPending ? "..." : t("auth.submit")}
            </button>
            <div className="text-center mt-4 space-y-2">
              <Link href="/register" className="block text-sm text-accent hover:underline">
                {t("auth.dont_have_account")}
              </Link>
              <Link href="/forgot-password" className="block text-sm text-cocoa-400 hover:text-primary hover:underline">
                {t("auth.forgot_password")}
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handle2FA} className="space-y-6">
            <p className="text-sm text-cocoa-500 text-center">
              {t("auth.two_fa_sent")}
            </p>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">{t("auth.two_fa_label")}</label>
              <input
                type="text"
                name="code"
                required
                maxLength={6}
                className="w-full px-4 py-3 rounded-md border border-cocoa-200 focus:ring-accent focus:border-accent outline-none text-primary text-center tracking-widest text-xl"
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-accent text-white font-bold py-3 px-4 rounded hover:bg-accent-secondary transition-colors disabled:opacity-50"
            >
              {isPending ? "..." : t("auth.verify")}
            </button>
          </form>
        )}

        {errorMessage && (
          <div className="text-red-500 text-sm text-center mt-4">
            {errorMessage}
          </div>
        )}
      </motion.div>
    </div>
  );
}
