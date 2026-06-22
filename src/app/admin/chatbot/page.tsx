import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Trash2 } from "lucide-react";
import { getTranslation } from "@/lib/translations";

async function deleteLog(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await prisma.chatbotLog.delete({ where: { id } });
  revalidatePath("/admin/chatbot");
}

export default async function AdminChatbotLogsPage() {
  const { t } = await getTranslation();
  const logs = await prisma.chatbotLog.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t("admin.chatbot_title")}</h1>
        <p className="text-cocoa-500">{t("admin.chatbot_desc")}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-cocoa-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-cocoa-50 text-primary border-b border-cocoa-100 uppercase text-xs tracking-wider">
              <th className="p-4">{t("admin.col_query")}</th>
              <th className="p-4">{t("admin.col_date")}</th>
              <th className="p-4">{t("admin.col_actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cocoa-50">
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-amber-50/20">
                <td className="p-4">
                   <p className="font-medium text-primary text-sm whitespace-pre-wrap">&quot;{log.query}&quot;</p>
                </td>
                <td className="p-4 text-sm text-cocoa-500">{log.createdAt.toLocaleString()}</td>
                <td className="p-4 flex space-x-3 items-center">
                   <form action={deleteLog}>
                     <input type="hidden" name="id" value={log.id} />
                     <button type="submit" className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors">
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && (
          <div className="p-8 text-center text-cocoa-400">{t("admin.no_logs")}</div>
        )}
      </div>
    </div>
  );
}
