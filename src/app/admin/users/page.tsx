import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Eye } from "lucide-react";

async function deleteUser(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}

async function toggleDeactivate(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const user = await prisma.user.findUnique({ where: { id } });
  if (user) {
    await prisma.user.update({ where: { id }, data: { isActive: !user.isActive } });
  }
  revalidatePath("/admin/users");
}

async function approveSeller(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  // Make user a SELLER if we had a dedicated role, but we just use isSeller + isApproved
  await prisma.user.update({ where: { id }, data: { isApproved: true } });
  revalidatePath("/admin/users");
}

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <p className="text-cocoa-500">Manage registered users and access roles.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-cocoa-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-cocoa-50 text-primary border-b border-cocoa-100 uppercase text-xs tracking-wider">
              <th className="p-4">Name</th>
              <th className="p-4">Email Address</th>
              <th className="p-4">Role</th>
              <th className="p-4">Verified</th>
              <th className="p-4">Joined Date</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cocoa-50">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-amber-50/20">
                <td className="p-4">
                   <p className="font-bold text-primary">{user.name || "N/A"}</p>
                </td>
                <td className="p-4 text-sm text-cocoa-500">{user.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                    {user.role}
                  </span>
                  {user.isSeller && (
                    <span className={`ml-1 px-2 py-1 rounded text-xs font-bold ${user.isApproved ? 'bg-amber-100 text-amber-700' : 'bg-orange-100 text-orange-700'}`}>
                      {user.isApproved ? "Seller" : "Seller (pending)"}
                    </span>
                  )}
                </td>
                <td className="p-4 flex gap-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.isEmailVerified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {user.isEmailVerified ? "✓ Verified" : "✗ Unverified"}
                  </span>
                  {!user.isActive && (
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700">Deactivated</span>
                  )}
                </td>
                <td className="p-4 text-sm text-cocoa-500">{user.createdAt.toLocaleDateString()}</td>
                <td className="p-4 flex space-x-3 items-center">
                   <div className="flex flex-col space-y-2">
                     <Link href={`/admin/users/${user.id}`} className="inline-flex items-center gap-1 text-blue-500 hover:underline text-sm font-medium">
                       <Eye className="w-3.5 h-3.5" /> View
                     </Link>
                     {user.email !== 'admin@amdcocoa.com' && (
                       <>
                         {user.isSeller && !user.isApproved && (
                           <form action={approveSeller}>
                             <input type="hidden" name="id" value={user.id} />
                             <button type="submit" className="text-green-600 hover:underline text-sm font-bold bg-green-100 px-2 py-1 rounded">Approve Seller</button>
                           </form>
                         )}
                         <form action={toggleDeactivate}>
                           <input type="hidden" name="id" value={user.id} />
                           <button type="submit" className="text-orange-500 hover:underline text-sm font-medium">
                             {user.isActive ? "Deactivate" : "Activate"}
                           </button>
                         </form>
                         <form action={deleteUser}>
                           <input type="hidden" name="id" value={user.id} />
                           <button type="submit" className="text-red-500 hover:underline text-sm font-bold">Delete</button>
                         </form>
                       </>
                     )}
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
