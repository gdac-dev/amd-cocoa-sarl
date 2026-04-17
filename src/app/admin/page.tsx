import { prisma } from "@/lib/prisma";
import { Users, ShoppingBag, DollarSign, Package, Bot } from "lucide-react";
import Link from "next/link";
import { getTranslation } from "@/lib/translations";

export default async function AdminDashboardPage() {
  const { t } = await getTranslation();
  const usersCount = await prisma.user.count();
  const ordersCount = await prisma.order.count();
  const productsCount = await prisma.product.count();
  
  // Aggregate total revenue
  const revenueAgg = await prisma.order.aggregate({
    _sum: {
      totalPrice: true,
    },
    where: {
      status: { not: "CANCELLED" }
    }
  });
  const totalRevenue = revenueAgg._sum.totalPrice || 0;

  const recentMessages = await prisma.contactMessage.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    where: { isRead: false }
  });

  const recentChatbotLogs = await prisma.chatbotLog.findMany({
    take: 5,
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-cocoa-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-cocoa-500">{t("admin.total_users")}</p>
            <p className="text-3xl font-bold text-primary mt-2">{usersCount}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-full">
            <Users className="h-6 w-6 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-cocoa-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-cocoa-500">{t("admin.total_orders")}</p>
            <p className="text-3xl font-bold text-primary mt-2">{ordersCount}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-full">
            <ShoppingBag className="h-6 w-6 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-cocoa-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-cocoa-500">{t("admin.total_revenue")}</p>
            <p className="text-3xl font-bold text-primary mt-2">${totalRevenue.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-full">
            <DollarSign className="h-6 w-6 text-amber-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-cocoa-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-cocoa-500">{t("admin.nav_products")}</p>
            <p className="text-3xl font-bold text-primary mt-2">{productsCount}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-full">
            <Package className="h-6 w-6 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Unread Messages List */}
        <div className="bg-white rounded-xl shadow-sm border border-cocoa-100 flex flex-col">
          <div className="p-6 border-b border-cocoa-50 flex justify-between items-center">
             <h2 className="text-lg font-bold">{t("admin.recent_unread")}</h2>
             <Link href="/admin/messages" className="text-sm text-accent hover:underline">{t("admin.view_all")}</Link>
          </div>
          <div className="p-0 flex-1">
             {recentMessages.length === 0 ? (
               <p className="p-6 text-cocoa-400">{t("admin.no_unread")}</p>
             ) : (
               <ul className="divide-y divide-cocoa-50">
                 {recentMessages.map(msg => (
                   <li key={msg.id} className="p-4 hover:bg-amber-50/30 transition-colors">
                     <p className="text-sm font-bold">{msg.name} <span className="text-cocoa-400 font-normal">({msg.email})</span></p>
                     <p className="text-sm font-medium mt-1 truncate">{msg.subject}</p>
                     <p className="text-xs text-cocoa-500 mt-1 line-clamp-1">{msg.message}</p>
                   </li>
                 ))}
               </ul>
             )}
          </div>
        </div>

        {/* Chatbot Logs List */}
        <div className="bg-white rounded-xl shadow-sm border border-cocoa-100 flex flex-col">
          <div className="p-6 border-b border-cocoa-50 flex justify-between items-center">
             <h2 className="text-lg font-bold flex items-center gap-2"><Bot className="w-5 h-5"/> {t("admin.unanswered_chatbot")}</h2>
             <Link href="/admin/chatbot" className="text-sm text-accent hover:underline">{t("admin.view_logs")}</Link>
          </div>
          <div className="p-0 flex-1">
             {recentChatbotLogs.length === 0 ? (
               <p className="p-6 text-cocoa-400">{t("admin.no_unanswered")}</p>
             ) : (
               <ul className="divide-y divide-cocoa-50">
                 {recentChatbotLogs.map(log => (
                   <li key={log.id} className="p-4 hover:bg-amber-50/30 transition-colors flex justify-between items-center">
                     <p className="text-sm text-primary">"{log.query}"</p>
                     <p className="text-xs text-cocoa-400">{log.createdAt.toLocaleDateString()}</p>
                   </li>
                 ))}
               </ul>
             )}
          </div>
        </div>

      </div>

    </div>
  );
}
