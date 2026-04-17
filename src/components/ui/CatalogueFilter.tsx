"use client";

import { Search } from "lucide-react";

export function CatalogueFilter({
  query,
  sort,
  categorySlug,
  tSearch,
  tLatest,
  tOldest,
  tLow,
  tHigh,
  tPop
}: {
  query: string;
  sort: string;
  categorySlug?: string;
  tSearch: string;
  tLatest: string;
  tOldest: string;
  tLow: string;
  tHigh: string;
  tPop: string;
}) {
  return (
    <form action="/catalogue" method="GET" className="flex flex-col sm:flex-row gap-4 items-end">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cocoa-400" />
        <input 
          type="text" 
          name="q"
          defaultValue={query}
          placeholder={tSearch}
          className="pl-9 pr-4 py-2 w-full sm:w-64 rounded-md border border-cocoa-200 outline-none focus:border-accent text-sm"
        />
      </div>
      {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
      <select 
        name="sort" 
        defaultValue={sort} 
        onChange={(e) => e.target.form?.submit()}
        className="px-4 py-2 rounded-md border border-cocoa-200 outline-none focus:border-accent text-sm bg-white cursor-pointer"
      >
        <option value="latest">{tLatest}</option>
        <option value="oldest">{tOldest}</option>
        <option value="price_low">{tLow}</option>
        <option value="price_high">{tHigh}</option>
        <option value="popularity">{tPop}</option>
      </select>
    </form>
  );
}
