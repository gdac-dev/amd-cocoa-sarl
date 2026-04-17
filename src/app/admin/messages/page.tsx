import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function toggleRead(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const isRead = formData.get("isRead") === "true";
  await prisma.contactMessage.update({ where: { id }, data: { isRead: !isRead } });
  revalidatePath("/admin/messages");
}

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Contact Messages</h1>
        <p className="text-cocoa-500">Inquiries submitted via the Contact page.</p>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="p-8 text-center text-cocoa-400 bg-white rounded-xl border border-cocoa-100">No messages found.</div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`bg-white rounded-xl shadow-sm border p-6 ${msg.isRead ? 'border-cocoa-50 opacity-70' : 'border-accent border-l-4'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-primary">{msg.subject}</h3>
                  <p className="text-sm text-cocoa-500">From: <span className="font-semibold text-primary">{msg.name}</span> ({msg.email})</p>
                </div>
                <p className="text-xs text-cocoa-400">{msg.createdAt.toLocaleString()}</p>
              </div>
              <p className="text-primary text-sm whitespace-pre-line mb-6 bg-beige p-4 rounded-md">{msg.message}</p>
              
              <div className="flex justify-end">
                <form action={toggleRead}>
                  <input type="hidden" name="id" value={msg.id} />
                  <input type="hidden" name="isRead" value={String(msg.isRead)} />
                  <button type="submit" className={`px-4 py-2 text-sm font-medium rounded ${msg.isRead ? 'text-primary bg-cocoa-100 hover:bg-cocoa-200' : 'bg-primary text-white hover:bg-primary-light'}`}>
                    {msg.isRead ? "Mark as Unread" : "Mark as Read"}
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
