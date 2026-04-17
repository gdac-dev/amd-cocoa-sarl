import { cookies } from "next/headers";
import en from "@/translations/en.json";
import fr from "@/translations/fr.json";

export async function getTranslation() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";
  
  const dict = locale === "fr" ? fr : en;

  const t = (keyPath: string): string => {
    const keys = keyPath.split(".");
    let current: any = dict;
    
    for (const key of keys) {
      if (current[key] === undefined) {
        return keyPath;
      }
      current = current[key];
    }
    
    return current as string;
  };

  return { t, locale };
}
