import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Users, ShoppingBag, List, MessageSquare, LayoutDashboard, LogOut, Package2, Bot, Settings } from "lucide-react";
import { handleSignOut } from "@/lib/actions/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  
  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-[#fdfaf6] text-primary font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-beige flex flex-col shadow-xl">
        <div className="flex items-center gap-2 px-6 py-6 border-b border-cocoa-700">
          <Image src="/logo.png" alt="AMD Logo" width={32} height={32} className="object-contain" />
          <span className="text-2xl font-bold text-accent font-['var(--font-dancing-script)'] tracking-normal">AMD</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/admin" className="flex items-center space-x-3 p-3 rounded-md hover:bg-amber-500 hover:text-white transition-colors group">
            <LayoutDashboard className="h-5 w-5 text-cocoa-300 group-hover:text-white" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/products" className="flex items-center space-x-3 p-3 rounded-md hover:bg-amber-500 hover:text-white transition-colors group">
            <Package2 className="h-5 w-5 text-cocoa-300 group-hover:text-white" />
            <span>Products</span>
          </Link>
          <Link href="/admin/categories" className="flex items-center space-x-3 p-3 rounded-md hover:bg-amber-500 hover:text-white transition-colors group">
            <List className="h-5 w-5 text-cocoa-300 group-hover:text-white" />
            <span>Categories</span>
          </Link>
          <Link href="/admin/orders" className="flex items-center space-x-3 p-3 rounded-md hover:bg-amber-500 hover:text-white transition-colors group">
            <ShoppingBag className="h-5 w-5 text-cocoa-300 group-hover:text-white" />
            <span>Orders</span>
          </Link>
          <Link href="/admin/users" className="flex items-center space-x-3 p-3 rounded-md hover:bg-amber-500 hover:text-white transition-colors group">
            <Users className="h-5 w-5 text-cocoa-300 group-hover:text-white" />
            <span>Users</span>
          </Link>
          <Link href="/admin/messages" className="flex items-center space-x-3 p-3 rounded-md hover:bg-amber-500 hover:text-white transition-colors group">
            <MessageSquare className="h-5 w-5 text-cocoa-300 group-hover:text-white" />
            <span>Messages</span>
          </Link>
          <Link href="/admin/chatbot" className="flex items-center space-x-3 p-3 rounded-md hover:bg-amber-500 hover:text-white transition-colors group">
            <Bot className="h-5 w-5 text-cocoa-300 group-hover:text-white" />
            <span>Chatbot Logs</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center space-x-3 p-3 rounded-md hover:bg-amber-500 hover:text-white transition-colors group">
            <Settings className="h-5 w-5 text-cocoa-300 group-hover:text-white" />
            <span>Settings</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t border-cocoa-700">
          <form action={handleSignOut}>
            <button type="submit" className="flex items-center space-x-3 p-3 w-full rounded-md hover:bg-red-800/20 text-red-300 transition-colors">
              <LogOut className="h-5 w-5" />
              <span>Log out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-cocoa-100 p-4 flex justify-between items-center z-10 shadow-sm">
          <h2 className="text-xl font-semibold">Welcome back, {session?.user?.name}</h2>
          <div className="flex items-center space-x-4">
            <Link href="/" target="_blank" className="text-sm font-medium text-cocoa-500 hover:text-accent transition-colors">
              View Public App &rarr;
            </Link>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
      
    </div>
  );
}
