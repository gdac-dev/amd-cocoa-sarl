"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "@/translations/en.json";
import fr from "@/translations/fr.json";

type Language = "en" | "fr";
type Translations = typeof en;

interface TranslationContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (keyPath: string) => string;
}

const TranslationContext = createContext<TranslationContextProps | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;)\s*NEXT_LOCALE=([^;]+)/);
    const savedLang = match ? (match[1] as Language) : "en";
    if (savedLang === "en" || savedLang === "fr") {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000`;
    setLanguageState(lang);
    window.location.reload();
  };

  const t = (keyPath: string): string => {
    const keys = keyPath.split(".");
    let current: any = language === "en" ? en : fr;
    
    for (const key of keys) {
      if (current[key] === undefined) {
        return keyPath; // fallback to key path if not found
      }
      current = current[key];
    }
    
    return current as string;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}
