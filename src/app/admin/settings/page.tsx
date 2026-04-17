import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { signOut } from "@/auth";
import { Settings, Lock, Mail, AlertCircle } from "lucide-react";

async function updateCredentials(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user) return;

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (email && email.trim() !== "") {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { email }
    });
  }

  if (password && password.trim() !== "") {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { passwordHash }
    });
  }

  // Force re-login
  await signOut({ redirectTo: "/login" });
}

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session?.user) return null;

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6 text-accent" /> Account Settings
        </h1>
        <p className="text-cocoa-500 mt-1">Manage your administrator credentials and security.</p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-cocoa-100">
        <div className="bg-amber-50 text-amber-800 p-4 rounded-lg flex gap-3 mb-8 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
          <p>If you update your credentials here, you will be forcefully logged out and required to sign back in to confirm your identity.</p>
        </div>

        <form action={updateCredentials} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-primary mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-cocoa-400" /> Email Address
            </label>
            <input 
              name="email" 
              type="email" 
              defaultValue={user?.email || ""} 
              className="w-full px-4 py-3 border border-cocoa-200 rounded-lg focus:ring-2 focus:ring-accent outline-none transition-all" 
              placeholder="admin@amdcocoa.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-cocoa-400" /> New Password
            </label>
            <input 
              name="password" 
              type="password" 
              className="w-full px-4 py-3 border border-cocoa-200 rounded-lg focus:ring-2 focus:ring-accent outline-none transition-all" 
              placeholder="Leave blank to keep current password"
            />
          </div>
          
          <button type="submit" className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-light transition-all active:scale-95">
            Save Changes & Relogin
          </button>
        </form>
      </div>
    </div>
  );
}
