"use client";

import { useState, useTransition } from "react";
import { requestPasswordReset, resetPassword } from "./actions";
import { motion } from "framer-motion";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { useTranslation } from "@/context/TranslationContext";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [step, setStep] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    const emailVal = formData.get("email") as string;
    startTransition(async () => {
      const res = await requestPasswordReset(null, formData);
      if (res?.success) {
        setEmail(emailVal);
        setMessage(res.success);
        setStep("reset");
      }
    });
  };

  const handleReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    formData.set("email", email);
    startTransition(async () => {
      const res = await resetPassword(null, formData);
      if (res?.error) setError(res.error);
    });
  };

  return (
    <div className="min-h-screen bg-beige flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-cocoa-100 p-8"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <KeyRound className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-primary">
            {step === "request" ? t("forgot_password.title_request") : t("forgot_password.title_reset")}
          </h2>
          {message && <p className="text-sm text-cocoa-500 text-center mt-2">{message}</p>}
        </div>

        {step === "request" ? (
          <form onSubmit={handleRequest} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-primary mb-1">{t("forgot_password.email_label")}</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 rounded-md border border-cocoa-200 focus:border-accent outline-none text-primary"
              />
            </div>
            <button type="submit" disabled={isPending} className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-cocoa-800 transition-colors disabled:opacity-50">
              {isPending ? t("forgot_password.sending") : t("forgot_password.send_code")}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-primary mb-1">{t("forgot_password.code_label")}</label>
              <input
                type="text"
                name="code"
                required
                maxLength={6}
                placeholder="123456"
                className="w-full px-4 py-3 rounded-md border border-cocoa-200 focus:border-accent outline-none text-primary text-center tracking-widest text-xl font-bold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">{t("forgot_password.new_password")}</label>
              <input
                type="password"
                name="newPassword"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-md border border-cocoa-200 focus:border-accent outline-none text-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">{t("forgot_password.confirm_password")}</label>
              <input
                type="password"
                name="confirmPassword"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-md border border-cocoa-200 focus:border-accent outline-none text-primary"
              />
            </div>
            <button type="submit" disabled={isPending} className="w-full bg-accent text-white font-bold py-3 rounded-lg hover:opacity-90 transition-colors disabled:opacity-50">
              {isPending ? t("forgot_password.resetting") : t("forgot_password.reset_btn")}
            </button>
          </form>
        )}

        {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-accent hover:underline">{t("forgot_password.back_to_login")}</Link>
        </div>
      </motion.div>
    </div>
  );
}
