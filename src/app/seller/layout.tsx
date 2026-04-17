import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Package2, Store, LogOut, Settings } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { handleSignOut } from "@/lib/actions/auth";
import { getTranslation } from "@/lib/translations";

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const { t } = await getTranslation();
  
  if (!session || !session.user) {
    redirect("/login");
  }

  // Fetch full user to verify seller status
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  
  if (!user?.isSeller) {
    return (
      <div className="min-h-screen bg-beige flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">{t("seller.access_denied")}</h1>
        <p className="text-cocoa-600 mb-8 max-w-md">
          {t("seller.not_seller")}
        </p>
        <Link href="/" className="bg-primary text-white px-6 py-2 rounded-full hover:bg-cocoa-800 transition-colors">
          {t("seller.return_home")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#fdfaf6] text-primary font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-beige flex flex-col shadow-xl">
        <div className="flex items-center gap-2 px-6 py-6 border-b border-cocoa-700">
          <Image src="/logo.png" alt="AMD Logo" width={32} height={32} className="object-contain" />
          <span className="text-2xl font-bold text-accent font-['var(--font-dancing-script)'] tracking-normal">SELLER</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/seller" className="flex items-center space-x-3 p-3 rounded-md hover:bg-amber-500 hover:text-white transition-colors group">
            <Store className="h-5 w-5 text-cocoa-300 group-hover:text-white" />
            <span>{t("seller.my_shop")}</span>
          </Link>
          <Link href="/seller/products" className="flex items-center space-x-3 p-3 rounded-md hover:bg-amber-500 hover:text-white transition-colors group">
            <Package2 className="h-5 w-5 text-cocoa-300 group-hover:text-white" />
            <span>{t("seller.my_products")}</span>
          </Link>
          <Link href="/seller/settings" className="flex items-center space-x-3 p-3 rounded-md hover:bg-amber-500 hover:text-white transition-colors group">
            <Settings className="h-5 w-5 text-cocoa-300 group-hover:text-white" />
            <span>{t("seller.settings")}</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t border-cocoa-700">
          <form action={handleSignOut}>
            <button type="submit" className="flex items-center space-x-3 p-3 w-full rounded-md hover:bg-red-800/20 text-red-300 transition-colors">
              <LogOut className="h-5 w-5" />
              <span>{t("seller.logout")}</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-cocoa-100 p-4 flex justify-between items-center z-10 shadow-sm">
          <h2 className="text-xl font-semibold">{t("seller.welcome")} {user.shopName || user.name}</h2>
          <div className="flex items-center space-x-4">
            <Link href="/" target="_blank" className="text-sm font-medium text-cocoa-500 hover:text-accent transition-colors">
              {t("seller.view_public")} &rarr;
            </Link>
          </div>
        </header>

        <div className="flex-1 border-t border-cocoa-100 flex flex-col">
          {!user.isApproved && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 m-8 mb-0 shadow-sm rounded-r-md">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-amber-800 font-medium">
                    ⚠️ {t("seller.pending_approval")}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
