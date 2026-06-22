import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getTranslation } from "@/lib/translations";

async function updateStatus(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orders");
}

export default async function AdminOrdersPage() {
  const { t } = await getTranslation();
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true }
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t("admin.orders_title")}</h1>
        <p className="text-cocoa-500">{t("admin.orders_desc")}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-cocoa-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-cocoa-50 text-primary border-b border-cocoa-100 uppercase text-xs tracking-wider">
              <th className="p-4">{t("admin.col_order_details")}</th>
              <th className="p-4">{t("admin.col_customer")}</th>
              <th className="p-4">{t("admin.col_total")}</th>
              <th className="p-4">{t("admin.col_payment_method")}</th>
              <th className="p-4">{t("admin.col_status")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cocoa-50">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-amber-50/20">
                <td className="p-4">
                   <p className="text-xs text-cocoa-400 font-mono mb-1">{order.id}</p>
                   <p className="text-sm font-medium">{order.createdAt.toLocaleDateString()}</p>
                   <p className="text-xs text-cocoa-500 mt-1">{order.items.length} {t("admin.items_count")}</p>
                </td>
                <td className="p-4">
                   <p className="font-bold text-primary">{order.customerName}</p>
                   <p className="text-sm text-cocoa-500">{order.customerPhone}</p>
                   <p className="text-xs text-cocoa-400">{order.customerCity}</p>
                </td>
                <td className="p-4 font-bold text-accent-secondary">{order.totalPrice.toLocaleString("fr-FR")} XAF</td>
                <td className="p-4 text-sm">{order.paymentMethod}</td>
                <td className="p-4">
                  <form action={updateStatus} className="flex flex-col space-y-2">
                    <input type="hidden" name="id" value={order.id} />
                    <select 
                      name="status" 
                      defaultValue={order.status}
                      className={`text-sm font-bold border rounded p-1 ${
                        order.status === 'PENDING' ? 'text-amber-600 bg-amber-50 border-amber-200' :
                        order.status === 'SHIPPED' ? 'text-blue-600 bg-blue-50 border-blue-200' :
                        'text-green-600 bg-green-50 border-green-200'
                      }`}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PAID">PAID</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                    <button type="submit" className="text-xs text-accent hover:underline text-left">{t("admin.update")}</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="p-8 text-center text-cocoa-400">{t("admin.no_orders")}</div>
        )}
      </div>
    </div>
  );
}
