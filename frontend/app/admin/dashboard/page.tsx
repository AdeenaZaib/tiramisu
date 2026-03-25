"use client";
import { useEffect, useState } from "react";

type Order = {
  id: number;
  customerName: string;
  contact: string;
  eventDate: string;
  deliveryAddress: string;
  status: string;
  totalCost: number;
  createdAt: string;
};

const STATUSES = ["Pending", "Confirmed", "Delivered", "Cancelled"];

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  Delivered: "bg-green-100 text-green-800 border-green-300",
  Cancelled: "bg-red-100 text-red-800 border-red-300",
};

export default function ManagerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/orders/all");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      // Sort descending by date
      data.sort(
        (a: Order, b: Order) =>
          new Date(b.createdAt || b.eventDate).getTime() -
          new Date(a.createdAt || a.eventDate).getTime()
      );
      setOrders(data);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStatus),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-red-800 text-center mb-2">Order Dashboard</h1>
      <p className="text-center text-gray-500 mb-8 text-sm uppercase tracking-widest">
        Catering Manager View
      </p>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {STATUSES.map((s) => (
          <div
            key={s}
            className={`p-4 rounded-lg border text-center ${STATUS_COLORS[s] || "bg-gray-100"}`}
          >
            <p className="text-2xl font-bold">{counts[s] || 0}</p>
            <p className="text-xs font-semibold uppercase tracking-wide">{s}</p>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      {loading ? (
        <p className="text-center text-gray-500 py-12">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-500 py-12 bg-white rounded-xl border border-amber-100">
          <p className="text-lg">No orders have been placed yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-lg border-l-8 border-amber-900 shadow-md"
            >
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                      Order #{order.id}
                    </p>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                        STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="font-bold text-lg uppercase truncate">{order.customerName}</p>
                  <p className="text-gray-500 text-sm">{order.contact}</p>
                  <p className="text-gray-500 text-sm truncate">{order.deliveryAddress}</p>
                  <div className="flex gap-4 mt-2 text-xs text-gray-400">
                    <span>
                      <span className="font-semibold text-gray-600">Event:</span>{" "}
                      {new Date(order.eventDate).toLocaleDateString()}
                    </span>
                    {order.createdAt && (
                      <span>
                        <span className="font-semibold text-gray-600">Placed:</span>{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <p className="text-red-700 font-bold text-xl">${order.totalCost?.toFixed(2)}</p>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-500 font-semibold uppercase">
                      Update Status:
                    </label>
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="border-2 border-amber-800 rounded p-1.5 text-sm bg-white font-semibold focus:outline-none"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}