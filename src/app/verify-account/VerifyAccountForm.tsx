"use client";

import { useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyAccountCode, resendVerificationCode } from "./actions";
import { motion } from "framer-motion";
import Link from "next/link";
import { MailCheck, CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/context/TranslationContext";

export default function VerifyAccountForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const email = searchParams.get("email") || "";

  const [isPending, startTransition] = useTransition();
  const [isResending, startResendTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [verified, setVerified] = useState(false);

  const handleVerify = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const form = e.currentTarget;
    const code = (form.elements.namedItem("code") as HTMLInputElement)?.value?.trim();

    if (!email) {
      setError(t("verify.email_missing"));
      return;
    }

    if (!code || code.length !== 6) {
      setError(t("verify.invalid_code"));
      return;
    }

    const formData = new FormData();
    formData.set("email", email);
    formData.set("code", code);

    startTransition(async () => {
      const res = await verifyAccountCode(null, formData);

      if (res?.error) {
        setError(res.error);
        return;
      }

      if (res?.alreadyVerified) {
        setVerified(true);
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      if (res?.success) {
        setVerified(true);
        // Auto-redirect to login — user logs in from there
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    });
  };

  const handleResend = () => {
    setError("");
    setSuccess("");

    if (!email) {
      setError(t("verify.email_missing"));
      return;
    }

    const formData = new FormData();
    formData.set("email", email);

    startResendTransition(async () => {
      const res = await resendVerificationCode(null, formData);

      if (res?.alreadyVerified) {
        setSuccess(t("verify.already_verified"));
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      if (res?.error) {
        setError(res.error);
        return;
      }

      if (res?.success) {
        setSuccess(res.success);
      }
    });
  };

  // Success state
  if (verified) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-cocoa-100 p-10 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">{t("verify.success_title")}</h2>
          <p className="text-cocoa-500 text-sm">{t("verify.success_desc")}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-cocoa-100 p-8"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <MailCheck className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-primary text-center">{t("verify.title")}</h2>
          <p className="text-cocoa-500 text-sm text-center mt-2">
            {email
              ? <>{t("verify.sent_to")} <strong className="text-primary">{email}</strong>.</>
              : t("verify.enter_code")
            }
          </p>
          {!email && (
            <p className="text-red-500 text-xs mt-2 text-center">
              ⚠️ {t("verify.email_missing_url")} <Link href="/register" className="underline">{t("verify.register_again")}</Link>
            </p>
          )}
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">{t("verify.code_label")}</label>
            <input
              type="text"
              name="code"
              required
              maxLength={6}
              minLength={6}
              placeholder="123456"
              className="w-full px-4 py-3 rounded-md border border-cocoa-200 focus:ring-accent focus:border-accent outline-none text-primary text-center tracking-widest text-2xl font-bold"
            />
          </div>
          <button
            type="submit"
            disabled={isPending || !email}
            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-cocoa-800 transition-colors disabled:opacity-50"
          >
            {isPending ? t("verify.verifying") : t("verify.verify_activate")}
          </button>
        </form>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}
        {success && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-700 text-sm text-center">{success}</p>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-cocoa-100 text-center space-y-3">
          <p className="text-sm text-cocoa-400">{t("verify.didnt_receive")}</p>
          <button
            onClick={handleResend}
            disabled={isResending || !email}
            className="text-sm font-semibold text-accent hover:underline disabled:opacity-40"
          >
            {isResending ? t("verify.sending") : t("verify.send_new_code")}
          </button>
          <div>
            <Link href="/login" className="text-sm text-cocoa-400 hover:underline">
              {t("verify.back_to_login")}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
