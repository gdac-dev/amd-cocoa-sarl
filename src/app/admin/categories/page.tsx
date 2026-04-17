import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import { revalidatePath } from "next/cache";

async function addCategory(formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const description = formData.get("description") as string;

  await prisma.category.create({ data: { name, slug, description } });
  revalidatePath("/admin/categories");
}

async function deleteCategory(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Category List */}
      <div className="lg:col-span-2">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Categories Management</h1>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-cocoa-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cocoa-50 text-primary border-b border-cocoa-100 uppercase text-xs tracking-wider">
                <th className="p-4">Name / Slug</th>
                <th className="p-4">Products Linked</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cocoa-50">
              {categories.map(cat => (
                <tr key={cat.id} className="hover:bg-amber-50/20">
                  <td className="p-4">
                     <p className="font-bold text-primary">{cat.name}</p>
                     <p className="text-xs text-cocoa-400">{cat.slug}</p>
                  </td>
                  <td className="p-4 font-bold text-cocoa-500">{cat._count.products} Items</td>
                  <td className="p-4 flex space-x-3 items-center pt-5">
                     <form action={deleteCategory}>
                       <input type="hidden" name="id" value={cat.id} />
                       <button type="submit" disabled={cat._count.products > 0} className={`text-sm font-medium ${cat._count.products > 0 ? "text-gray-300 cursor-not-allowed" : "text-red-500 hover:underline"}`}>
                         Delete
                       </button>
                     </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Category */}
      <div>
        <div className="bg-primary text-beige rounded-xl p-6 shadow-xl sticky top-24">
           <h2 className="text-xl font-bold mb-4 text-white">Add Category</h2>
           <form action={addCategory} className="space-y-4">
             <div>
               <label className="block text-sm font-medium mb-1">Category Name</label>
               <input name="name" required className="w-full px-3 py-2 rounded bg-cocoa-800 border border-cocoa-700 text-white focus:outline-none focus:border-accent" />
             </div>
             <div>
               <label className="block text-sm font-medium mb-1">Description</label>
               <textarea name="description" rows={3} className="w-full px-3 py-2 rounded bg-cocoa-800 border border-cocoa-700 text-white focus:outline-none focus:border-accent"></textarea>
             </div>
             <button type="submit" className="w-full bg-accent text-primary font-bold py-2 rounded hover:bg-[#d4a844] transition-colors mt-4">
               Save Category
             </button>
           </form>
        </div>
      </div>

    </div>
  );
}
