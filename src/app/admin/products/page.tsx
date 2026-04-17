import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Plus } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

async function deleteProduct(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
}

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Products Management</h1>
          <p className="text-cocoa-500">Manage your catalog, stock, and descriptions.</p>
        </div>
        <Link href="/admin/products/new" className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded shadow hover:bg-primary-light transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-cocoa-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-cocoa-50 text-primary border-b border-cocoa-100 uppercase text-xs tracking-wider">
              <th className="p-4">Image</th>
              <th className="p-4">Name / Slug</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cocoa-50">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-amber-50/20">
                <td className="p-4">
                   <div className="h-12 w-12 bg-cocoa-100 rounded overflow-hidden relative">
                     <Image src={product.image || "/media__1775744053671.png"} fill alt="Product" className="object-cover" />
                   </div>
                </td>
                <td className="p-4">
                   <p className="font-bold text-primary">{product.name}</p>
                   <p className="text-xs text-cocoa-400">{product.slug}</p>
                </td>
                <td className="p-4 text-sm font-medium">{product.category.name}</td>
                <td className="p-4 font-bold text-accent-secondary">{product.price.toFixed(0)} FCFA</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${product.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="p-4 flex space-x-3 items-center pt-6">
                   <Link href={`/admin/products/${product.id}/edit`} className="text-blue-500 hover:underline text-sm font-medium">Edit</Link>
                   <form action={deleteProduct}>
                     <input type="hidden" name="id" value={product.id} />
                     <button type="submit" className="text-red-500 hover:underline text-sm font-medium">Delete</button>
                   </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="p-8 text-center text-cocoa-400">No products found.</div>
        )}
      </div>
    </div>
  );
}
