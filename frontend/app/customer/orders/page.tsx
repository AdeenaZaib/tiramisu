"use client";
import { useState } from "react";

type Order = {
  id: number;
  customerName: string;
  eventDate: string;
  deliveryAddress: string;
  status: string;
  totalCost: number;
  createdAt: string;
};

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Confirmed: "bg-blue-100 text-blue-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

export default function MyOrders() {
  const [customerName, setCustomerName] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    if (!customerName.trim()) return;
    setLoading(true);
    setSearched(false);
    try {
      const res = await fetch(`/api/orders/customer/${customerName}`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      alert("Error: " + err.message);
      setOrders([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-red-800 text-center mb-8">My Orders</h1>

      {/* Customer Name lookup */}
      <div className="bg-white p-6 rounded-xl border border-amber-200 shadow-md mb-8 flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-amber-900 mb-1 uppercase tracking-wide">
            Enter Your Name
          </label>
          <input
            placeholder="e.g. John Doe"
            className="w-full p-3 border rounded border-gray-300 focus:border-red-800 outline-none bg-white"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchOrders()}
          />
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="bg-red-800 text-white font-bold px-6 py-3 rounded hover:bg-red-900 transition-colors disabled:opacity-60"
        >
          {loading ? "Loading..." : "View Orders"}
        </button>
      </div>

      {/* Results */}
      {searched && orders.length === 0 && (
        <div className="text-center text-gray-500 py-12 bg-white rounded-xl border border-amber-100">
          <p className="text-lg">You have no catering orders at this time.</p>
        </div>
      )}

      {orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-lg border-l-8 border-amber-900 shadow-md"
            >
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                    Order #{order.id}
                  </p>
                  <p className="font-bold text-lg uppercase">{order.customerName}</p>
                  <p className="text-gray-600 text-sm">{order.deliveryAddress}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                  <p className="text-red-700 font-bold text-xl mt-2">
                    ${order.totalCost?.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex gap-6 mt-4 text-sm text-gray-500 border-t border-gray-100 pt-3">
                <span>
                  <span className="font-semibold text-gray-700">Event Date:</span>{" "}
                  {new Date(order.eventDate).toLocaleDateString()}
                </span>
                <span>
                  <span className="font-semibold text-gray-700">Ordered:</span>{" "}
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}