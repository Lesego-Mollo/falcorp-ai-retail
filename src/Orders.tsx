import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type OrderItem = {
  id: string;
  name: string;
  price: string;
  quantity: number;
};

type Order = {
  id: string;
  userId: string;
  userName?: string;
  items: OrderItem[];
  total: number;
  placedAt: string; // ISO
  status?: string;
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Order | null>(null);
  const navigate = useNavigate();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("loggedInUser") || "null");
      if (!user) {
        navigate("/login");
        return;
      }

      const ORDERS_API = import.meta.env.VITE_ORDERS_API_URL as string | undefined;
      if (ORDERS_API) {
        const res = await fetch(`${ORDERS_API}?userId=${encodeURIComponent(user.email || user.id)}`);
        if (!res.ok) throw new Error(`Orders API returned ${res.status}`);
        const d = await res.json();
        const results = d?.results || [];
        results.sort((a: Order, b: Order) => (a.placedAt < b.placedAt ? 1 : -1));
        setOrders(results);
      } else {
        const all = JSON.parse(localStorage.getItem("orders") || "[]") as Order[];
        const mine = all.filter((o) => (o.userId || "") === (user.email || user.id));
        mine.sort((a, b) => (a.placedAt < b.placedAt ? 1 : -1));
        setOrders(mine);
      }
    } catch (err) {
      console.warn("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const viewDetails = (o: Order) => setSelected(o);

  const cancelOrder = async (id: string) => {
    const ORDERS_API = import.meta.env.VITE_ORDERS_API_URL as string | undefined;
    if (ORDERS_API) {
      try {
        const res = await fetch(`${ORDERS_API}/${encodeURIComponent(id)}/cancel`, { method: "POST" });
        if (!res.ok) throw new Error(`Cancel returned ${res.status}`);
      } catch (err) {
        alert("Failed to cancel order: " + String(err));
        return;
      }
      await loadOrders();
    } else {
      // localStorage fallback
      const all = JSON.parse(localStorage.getItem("orders") || "[]") as Order[];
      const idx = all.findIndex((x) => x.id === id);
      if (idx >= 0) {
        all[idx].status = "canceled";
        localStorage.setItem("orders", JSON.stringify(all));
        await loadOrders();
      }
    }
  };

  const reorder = (o: Order) => {
    // store items temporarily and navigate to browse; Root will pick them up
    localStorage.setItem("reorderItems", JSON.stringify(o.items));
    navigate("/browse");
  };

  if (!JSON.parse(localStorage.getItem("loggedInUser") || "null")) return null;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Your Orders</h1>
          <button onClick={loadOrders} className="px-3 py-2 rounded-xl bg-white/80 border border-white/30">Refresh</button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">You have no orders yet. Place an order to see it here.</div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="glass-morphism rounded-2xl p-4 shadow-glass border border-white/30">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-gray-600">Order ID: <span className="font-mono text-xs">{o.id}</span></div>
                    <div className="text-lg font-semibold mt-1">Placed: {new Date(o.placedAt).toLocaleString()}</div>
                    <div className="text-sm text-gray-600 mt-1">Status: <span className="font-medium">{(o as any).status || 'placed'}</span></div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <div className="text-sm text-gray-600">Items: {o.items.length}</div>
                    <div className="text-2xl font-bold text-primary-600">R{o.total.toFixed(2)}</div>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => viewDetails(o)} className="px-3 py-1 rounded-lg bg-white/20">View</button>
                      <button onClick={() => reorder(o)} className="px-3 py-1 rounded-lg bg-primary-500 text-white">Re-order</button>
                      <button onClick={() => cancelOrder(o.id)} className="px-3 py-1 rounded-lg bg-red-500 text-white">Cancel</button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-2">
                  {o.items.slice(0,3).map((it) => (
                    <div key={it.id} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{it.name}</div>
                        <div className="text-xs text-gray-500">Qty: {it.quantity}</div>
                      </div>
                      <div className="text-sm font-semibold">{it.price}</div>
                    </div>
                  ))}
                  {o.items.length > 3 && <div className="text-xs text-gray-500">+ {o.items.length - 3} more items</div>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Details modal */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Order {selected.id}</h2>
                <button onClick={() => setSelected(null)} className="text-sm text-gray-600">Close</button>
              </div>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">Placed: {new Date(selected.placedAt).toLocaleString()}</div>
                <div className="text-sm text-gray-600">Status: {(selected as any).status || 'placed'}</div>
                <div className="mt-4 space-y-2">
                  {selected.items.map((it) => (
                    <div key={it.id} className="flex justify-between">
                      <div>
                        <div className="font-medium">{it.name}</div>
                        <div className="text-xs text-gray-500">Qty: {it.quantity}</div>
                      </div>
                      <div className="text-sm font-semibold">{it.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
