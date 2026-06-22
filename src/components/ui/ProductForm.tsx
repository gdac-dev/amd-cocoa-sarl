"use client";

import { useTransition, useState } from "react";
import { createProduct, updateProduct } from "@/lib/actions/products";
import { useTranslation } from "@/context/TranslationContext";

export function ProductForm({ categories, cancelUrl, initialData }: { categories: any[], cancelUrl: string, initialData?: any }) {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const [unitInput, setUnitInput] = useState(initialData?.unit || "Unit(s)");
  const [isUnitDropdownOpen, setIsUnitDropdownOpen] = useState(false);
  
  const defaultUnits = ["Unit(s)", "Kg", "Bag(s)", "Box(es)"];
  const filteredUnits = defaultUnits.filter(u => u.toLowerCase().includes(unitInput.toLowerCase()));
  const isExactMatch = defaultUnits.some(u => u.toLowerCase() === unitInput.toLowerCase());

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (initialData?.id) {
       formData.append("id", initialData.id);
    }
    startTransition(() => {
      if (initialData?.id) {
        updateProduct(formData);
      } else {
        createProduct(formData);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-cocoa-100 shadow-sm space-y-6 max-w-3xl" encType="multipart/form-data">
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-primary mb-1">{t("product_form.product_name")}</label>
          <input type="text" name="name" defaultValue={initialData?.name} required className="w-full px-4 py-2 border border-cocoa-200 rounded-md focus:border-accent outline-none" />
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-primary mb-1">{t("product_form.category")}</label>
          <select name="categoryId" defaultValue={initialData?.categoryId || ""} required className="w-full px-4 py-2 border border-cocoa-200 rounded-md focus:border-accent outline-none bg-white">
            <option value="">{t("product_form.select_category")}</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-3 md:col-span-1">
          <label className="block text-sm font-medium text-primary mb-1">{t("product_form.price")}</label>
          <input type="number" name="price" defaultValue={initialData?.price} min="0.01" step="0.01" required className="w-full px-4 py-2 border border-cocoa-200 rounded-md focus:border-accent outline-none" />
        </div>
        <div className="col-span-3 md:col-span-1 relative">
          <label className="block text-sm font-medium text-primary mb-1">{t("product_form.unit")}</label>
          <input type="hidden" name="unit" value={unitInput} />
          <input 
            type="text" 
            value={unitInput} 
            onChange={e => setUnitInput(e.target.value)}
            onFocus={() => setIsUnitDropdownOpen(true)}
            onBlur={() => setTimeout(() => setIsUnitDropdownOpen(false), 200)}
            required 
            className="w-full px-4 py-2 border border-cocoa-200 rounded-md focus:border-accent outline-none" 
          />
          {isUnitDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-cocoa-200 rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredUnits.length > 0 ? (
                filteredUnits.map(u => (
                  <div key={u} onClick={() => setUnitInput(u)} className="px-4 py-2 hover:bg-cocoa-50 cursor-pointer">{u}</div>
                ))
              ) : null}
              {!isExactMatch && unitInput.trim() !== "" && (
                <div onClick={() => setUnitInput(unitInput)} className="px-4 py-2 hover:bg-cocoa-50 cursor-pointer text-accent">
                  {t("product_form.create_unit")} &quot;{unitInput}&quot;...
                </div>
              )}
            </div>
          )}
        </div>
        <div className="col-span-3 md:col-span-1">
          <label className="block text-sm font-medium text-primary mb-1">{t("product_form.stock")}</label>
          <input type="number" name="stock" defaultValue={initialData?.stock} required className="w-full px-4 py-2 border border-cocoa-200 rounded-md focus:border-accent outline-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-primary mb-1">{t("product_form.product_image")}</label>
        <input type="file" name="image" accept="image/*" capture="environment" className="w-full px-4 py-2 border border-cocoa-200 rounded-md focus:border-accent outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-light" />
        {initialData?.image && <p className="text-xs text-cocoa-400 mt-2">{t("product_form.current_image")} {initialData.image}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-primary mb-1">{t("product_form.short_desc")}</label>
        <input type="text" name="shortDescription" defaultValue={initialData?.shortDescription} required className="w-full px-4 py-2 border border-cocoa-200 rounded-md focus:border-accent outline-none" />
      </div>

      <div>
        <label className="block text-sm font-medium text-primary mb-1">{t("product_form.full_desc")}</label>
        <textarea name="description" defaultValue={initialData?.description} rows={4} required className="w-full px-4 py-2 border border-cocoa-200 rounded-md focus:border-accent outline-none"></textarea>
      </div>

      <div className="flex gap-4 pt-4 border-t border-cocoa-100">
        <button type="submit" disabled={isPending} className="px-6 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-light transition-colors disabled:opacity-50">
          {isPending ? t("product_form.saving") : (initialData ? t("product_form.update_product") : t("product_form.save_product"))}
        </button>
        <a href={cancelUrl} className="px-6 py-2 bg-cocoa-100 text-primary font-semibold rounded-md hover:bg-cocoa-200 transition-colors">
          {t("product_form.cancel")}
        </a>
      </div>
    </form>
  );
}
