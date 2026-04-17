"use client";

import { useState, useTransition } from "react";
import { updateSellerProfile } from "./actions";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { useTranslation } from "@/context/TranslationContext";

export default function SellerSettingsPage() {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateSellerProfile(null, formData);
      if (res?.error) setMessage({ type: "error", text: res.error });
      if (res?.success) setMessage({ type: "success", text: res.success });
    });
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">{t("seller.settings_title")}</h1>
        <p className="text-cocoa-500 mt-1">{t("seller.settings_desc")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Shop Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-cocoa-100 shadow-sm p-6 space-y-4"
        >
          <h2 className="text-lg font-semibold text-primary border-b border-cocoa-100 pb-3">{t("seller.shop_info")}</h2>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">{t("seller.shop_name")}</label>
            <input
              type="text"
              name="shopName"
              className="w-full px-4 py-2 border border-cocoa-200 rounded-md focus:border-accent outline-none"
            />
          </div>
        </motion.div>

        {/* Password Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
          className="bg-white rounded-xl border border-cocoa-100 shadow-sm p-6 space-y-4"
        >
          <h2 className="text-lg font-semibold text-primary border-b border-cocoa-100 pb-3">{t("seller.change_password")}</h2>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">{t("seller.current_password")}</label>
            <input
              type="password"
              name="currentPassword"
              className="w-full px-4 py-2 border border-cocoa-200 rounded-md focus:border-accent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">{t("seller.new_password")}</label>
            <input
              type="password"
              name="newPassword"
              minLength={6}
              className="w-full px-4 py-2 border border-cocoa-200 rounded-md focus:border-accent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">{t("seller.confirm_password")}</label>
            <input
              type="password"
              name="confirmPassword"
              minLength={6}
              className="w-full px-4 py-2 border border-cocoa-200 rounded-md focus:border-accent outline-none"
            />
          </div>
        </motion.div>

        {/* Feedback */}
        {message && (
          <p className={`text-sm font-medium px-4 py-3 rounded-md ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-cocoa-800 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isPending ? t("seller.saving") : t("seller.save_changes")}
        </button>
      </form>
    </div>
  );
}
