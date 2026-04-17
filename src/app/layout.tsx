import type { Metadata } from "next";
import { Inter, Dancing_Script } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { TranslationProvider } from "@/context/TranslationContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { FloatingWidgets } from "@/components/ui/FloatingWidgets";
import { PageLoader } from "@/components/ui/PageLoader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AMD Cocoa - Premium Quality Cocoa Products",
  description: "Experience the rich taste of AMD Cocoa. We offer artisanal chocolate, premium cocoa beans, rich cocoa butter, and fine cocoa powder. Elevate your culinary experience.",
  keywords: "cocoa, artisanal chocolate, cocoa beans, cocoa butter, premium cocoa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${dancingScript.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <TranslationProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1 mt-20 flex flex-col min-h-screen">
              <PageLoader>
                {children}
              </PageLoader>
            </main>
            <Footer />
            <CartDrawer />
            <FloatingWidgets />
          </CartProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}
