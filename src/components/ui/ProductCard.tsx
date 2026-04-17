"use client";

import Image from "next/image";
import { ShoppingCart, Eye } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useTranslation } from "@/context/TranslationContext";
import Link from "next/link";

// Prisma Product shape with relationship mapping
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    shortDescription: string;
    image: string | null;
    category?: { name: string };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { t } = useTranslation();

  return (
    <div className="group relative bg-white flex flex-col rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-cocoa-50 hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden bg-cocoa-100">
        <Image
          src={product.image || "/media__1775744053671.png"}
          alt={product.name}
          fill
          className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* Overlay category badge */}
        {product.category && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary uppercase tracking-wider">
            {product.category.name}
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-primary leading-tight line-clamp-1 group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          <p className="text-xl font-semibold text-accent-secondary ml-4 whitespace-nowrap">
            {product.price.toFixed(0)} FCFA
          </p>
        </div>
        
        <p className="text-cocoa-500 text-sm line-clamp-2 mb-4 flex-1">
          {product.shortDescription}
        </p>

        <div className="grid grid-cols-2 gap-3 mt-auto pt-4">
          <Link
            href={`/catalogue/${product.id}`}
            className="flex items-center justify-center space-x-1.5 bg-amber-50 text-amber-700 border border-amber-200 py-2.5 px-3 rounded-md font-bold hover:bg-amber-100 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm line-clamp-1">Voir plus</span>
          </Link>

          <button
            onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image || "/media__1775744053671.png" })}
            className="flex items-center justify-center space-x-1.5 bg-primary text-white py-2.5 px-3 rounded-md font-bold hover:bg-primary-light transition-all active:scale-95 shadow-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm line-clamp-1">Ajouter</span>
          </button>
        </div>
      </div>
    </div>
  );
}
