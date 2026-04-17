import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, ShieldCheck, PackageOpen } from "lucide-react";

async function approveUser(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await prisma.user.update({ where: { id }, data: { isApproved: true } });
  revalidatePath(`/admin/users/${id}`);
}

import { redirect } from "next/navigation";

async function toggleDeactivateUser(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const user = await prisma.user.findUnique({ where: { id } });
  if (user) {
    await prisma.user.update({ where: { id }, data: { isActive: !user.isActive } });
  }
  revalidatePath(`/admin/users/${id}`);
}

async function deleteUserAction(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await prisma.user.delete({ where: { id } });
  redirect("/admin/users");
}

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: { products: { include: { category: true } } }
  });

  if (!user) notFound();

  const StatusBadge = ({ ok, label }: { ok: boolean; label: string }) => (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
      {ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
      {label}
    </span>
  );

  return (
    <div>
      <Link href="/admin/users" className="inline-flex items-center gap-1 text-cocoa-500 hover:text-primary mb-6 transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Users
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Profile Card */}
        <div className="bg-white rounded-xl border border-cocoa-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-2xl font-bold text-amber-700">
              {(user.name || user.email)[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary">{user.name || "—"}</h2>
              <p className="text-sm text-cocoa-500">{user.email}</p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-cocoa-100">
            <div className="flex justify-between text-sm">
              <span className="text-cocoa-500">Role</span>
              <span className={`font-bold ${user.role === "ADMIN" ? "text-purple-700" : "text-primary"}`}>{user.role}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-cocoa-500">Joined</span>
              <span className="font-medium">{user.createdAt.toLocaleDateString()}</span>
            </div>
            {user.isSeller && (
              <div className="flex justify-between text-sm">
                <span className="text-cocoa-500">Shop Name</span>
                <span className="font-medium">{user.shopName || "—"}</span>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2 border-t border-cocoa-100">
            <h3 className="text-xs font-semibold text-cocoa-400 uppercase tracking-wider">Status</h3>
            <div className="flex flex-wrap gap-2">
              <StatusBadge ok={user.isEmailVerified} label={user.isEmailVerified ? "Email Verified" : "Unverified"} />
              {user.isSeller && <StatusBadge ok={user.isApproved} label={user.isApproved ? "Seller Approved" : "Pending Approval"} />}
              <StatusBadge ok={user.isActive} label={user.isActive ? "Active" : "Deactivated"} />
            </div>
          </div>

          {/* Actions */}
          {user.email !== "admin@amdcocoa.com" && (
            <div className="space-y-2 pt-2 border-t border-cocoa-100">
              <h3 className="text-xs font-semibold text-cocoa-400 uppercase tracking-wider">Actions</h3>
              {user.isSeller && !user.isApproved && (
                <form action={approveUser}>
                  <input type="hidden" name="id" value={user.id} />
                  <button type="submit" className="w-full flex items-center justify-center gap-2 bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    <ShieldCheck className="w-4 h-4" /> Approve Seller
                  </button>
                </form>
              )}
              <form action={toggleDeactivateUser}>
                <input type="hidden" name="id" value={user.id} />
                <button type="submit" className="w-full text-sm text-orange-600 hover:underline font-medium py-1">
                  {user.isActive ? "Deactivate Account" : "Activate Account"}
                </button>
              </form>
              <form action={deleteUserAction}>
                <input type="hidden" name="id" value={user.id} />
                <button type="submit" className="w-full text-sm text-red-600 hover:underline font-bold py-1">
                  Delete User Completely
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right: Products */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-cocoa-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-cocoa-100">
            <PackageOpen className="w-5 h-5 text-cocoa-400" />
            <h3 className="font-semibold text-primary">Listed Products ({user.products.length})</h3>
          </div>
          {user.products.length === 0 ? (
            <div className="text-center py-12 text-cocoa-400">
              <p>This user has not listed any products.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {user.products.map(p => (
                <div key={p.id} className="flex items-center justify-between py-3 border-b border-cocoa-50 last:border-0">
                  <div>
                    <p className="font-medium text-primary">{p.name}</p>
                    <p className="text-xs text-cocoa-400">{p.category.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-accent-secondary">{p.price.toFixed(0)} FCFA</p>
                    <p className={`text-xs font-medium ${p.stock > 0 ? "text-green-600" : "text-red-500"}`}>{p.stock} in stock</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
