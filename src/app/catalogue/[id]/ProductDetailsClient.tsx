"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";

export function ProductDetailsClient({ product }: { product: any }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState(product.unit || "Unit(s)");

  // Options if they want to 'select beside'
  const defaultUnits = [product.unit, "Kg", "Unit(s)", "Bag(s)", "Box(s)"].filter(Boolean);
  const uniqueUnits = Array.from(new Set(defaultUnits));

  return (
    <div className="mt-auto pt-8 border-t border-cocoa-100">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-sm text-cocoa-500 font-medium mb-1">Prix Total</p>
          <p className="text-4xl font-extrabold text-accent-secondary">
            {(product.price * quantity).toFixed(0)} FCFA
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-cocoa-500 mb-2">Quantité & Unité:</label>
          <div className="flex items-center border border-cocoa-200 rounded-lg bg-white overflow-hidden h-12">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))} 
              className="px-4 h-full text-cocoa-500 hover:text-primary transition-colors hover:bg-cocoa-50 text-xl font-bold"
            >
              -
            </button>
            <span className="px-4 font-bold text-primary border-x border-cocoa-200 h-full flex items-center justify-center min-w-[3rem]">
              {quantity}
            </span>
            <button 
              onClick={() => setQuantity(quantity + 1)} 
              className="px-4 h-full text-cocoa-500 hover:text-primary transition-colors hover:bg-cocoa-50 text-xl font-bold"
            >
              +
            </button>
            <div className="flex-1 flex items-center border-l border-cocoa-200 h-full px-2">
              <select 
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="w-full h-full bg-transparent text-primary font-medium focus:outline-none appearance-none outline-none cursor-pointer"
              >
                {uniqueUnits.map(u => (
                  <option key={u as string} value={u as string}>{u}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => addToCart({ 
          id: product.id, 
          name: `${product.name} (${selectedUnit})`, 
          price: product.price, 
          quantity, 
          image: product.image || "/media__1775744053671.png" 
        })}
        className="w-full flex items-center justify-center space-x-2 bg-primary text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-primary-light hover:shadow-xl transition-all active:scale-[0.98]"
      >
        <ShoppingCart className="w-5 h-5" />
        <span>Ajouter au panier</span>
      </button>
    </div>
  );
}
