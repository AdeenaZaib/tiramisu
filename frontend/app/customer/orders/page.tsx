"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ fullName: string } | null>(null);

  useEffect(() => {
    // 1. Check who is logged in
    const storedUser = localStorage.getItem("user");
    
    if (!storedUser) {
      // If no one is logged in, kick them back to the login page
      router.push("/auth/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    // 2. Fetch only THIS user's orders automatically
    const fetchMyOrders = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/orders/customer/${encodeURIComponent(parsedUser.fullName)}`);
        if (!res.ok) throw new Error("Failed to fetch orders");
        
        const data = await res.json();
        
        // Sort newest event dates first
        data.sort((a: Order, b: Order) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
        setOrders(data);
      } catch (err: any) {
        console.error("Error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [router]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p className="text-xl text-amber-900 font-bold animate-pulse">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-red-800 text-center mb-2">My Orders</h1>
      <p className="text-center text-gray-500 mb-8 font-semibold">
        Welcome back, {user?.fullName}
      </p>

      {/* Empty State */}
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-amber-200 shadow-sm">
          <p className="text-lg text-gray-500 mb-4">You have no catering orders at this time.</p>
          <button 
            onClick={() => router.push("/customer/menu")}
            className="bg-red-800 text-white font-bold py-2 px-6 rounded hover:bg-red-900 transition"
          >
            Browse Menu
          </button>
        </div>
      ) : (
        /* Orders List */
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