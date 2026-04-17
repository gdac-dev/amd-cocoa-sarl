import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductDetailsClient } from "./ProductDetailsClient";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, seller: true }
  });

  if (!product) notFound();

  return (
    <div className="bg-beige min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/catalogue" className="inline-flex items-center text-cocoa-500 hover:text-primary mb-8 font-medium transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" /> Retour au catalogue
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-cocoa-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative aspect-square md:aspect-auto bg-cocoa-50">
              <Image 
                src={product.image || "/media__1775744053671.png"} 
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="uppercase tracking-wider text-xs font-bold text-accent mb-2">
                {product.category?.name || "Uncategorized"}
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-primary mb-4">
                {product.name}
              </h1>
              
              <div className="text-cocoa-500 text-lg mb-8 space-y-4">
                <p>{product.description}</p>
              </div>

              {/* Client Component for Qty, Unit Select, and Add to Cart */}
              <ProductDetailsClient product={product} />

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
