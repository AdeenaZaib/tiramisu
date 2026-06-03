const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://tiramisu-sy4o.onrender.com";
"use client";
import { useEffect, useState } from "react";

type Order = {
  id: number;
  customerName: string;
  contact: string;
  contactNumber?: string;
  eventDate: string;
  deliveryAddress: string;
  status: string;
  totalCost: number;
  createdAt: string;
  rating?: number;
  feedback?: string;
};

const STATUSES = ["Pending", "Confirmed", "Delivered", "Cancelled"];

const getStatusStyle = (status: string) => {
  switch(status) {
    case 'Pending': return { bg: "rgba(139,105,20,0.1)", color: "#8B6914", border: "rgba(139,105,20,0.3)" };
    case 'Confirmed': return { bg: "rgba(44,36,22,0.08)", color: "#2C2416", border: "rgba(44,36,22,0.2)" };
    case 'Delivered': return { bg: "rgba(90,112,48,0.15)", color: "#5A7030", border: "rgba(90,112,48,0.3)" };
    case 'Cancelled': return { bg: "rgba(168,50,50,0.1)", color: "#a83232", border: "rgba(168,50,50,0.3)" };
    default: return { bg: "rgba(0,0,0,0.05)", color: "#000", border: "rgba(0,0,0,0.1)" };
  }
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  
  // NEW: State to track which filter is currently active
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders/all`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      data.sort((a: Order, b: Order) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
      setOrders(data);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      fetchOrders(); 
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

  // NEW: Filter the displayed orders based on the clicked card
  const displayedOrders = statusFilter === "All" 
    ? orders 
    : orders.filter(o => o.status === statusFilter);

  return (
    <div style={{ background: "#FDFAF5", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Jost', sans-serif", color: "#2C2416" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Cormorant Garamond', serif; }
        .status-select { background: #fff; border: 1px solid rgba(44,36,22,0.2); padding: 8px 12px; border-radius: 4px; font-family: 'Jost', sans-serif; font-size: 13px; font-weight: 500; color: #2C2416; cursor: pointer; outline: none; transition: border-color 0.3s; }
        .status-select:focus { border-color: #8B6914; }
        .admin-card { background: #fff; border-radius: 4px; border: 1px solid rgba(44,36,22,0.06); padding: 32px; transition: all 0.3s ease; }
        .admin-card:hover { box-shadow: 0 16px 48px rgba(44,36,22,0.05); transform: translateY(-2px); }
        .stat-card-clickable { cursor: pointer; user-select: none; }
      `}</style>

      {/* ── Hero Banner ── */}
      <section style={{ position: "relative", height: 320, overflow: "hidden", background: "#252119", flexShrink: 0, display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", right: "-5%", top: "-20%", width: "500px", height: "500px", border: "1px solid rgba(253,250,245,0.05)", borderRadius: "50%", zIndex: 1 }} />
        <div style={{ position: "absolute", right: "5%", top: "10%", width: "300px", height: "300px", border: "1px solid rgba(253,250,245,0.05)", borderRadius: "50%", zIndex: 1 }} />

        <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 1280, margin: "0 auto", padding: "0 60px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
            <div style={{ height: 1, width: 40, background: "rgba(253,250,245,0.2)" }} />
            <span style={{ fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(253,250,245,0.45)", fontWeight: 600 }}>Management Console</span>
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2.8rem,6vw,5.5rem)", fontWeight: 300, color: "#FDFAF5", lineHeight: 1, marginBottom: 16 }}>
            Order <em style={{ color: "#8B6914", fontStyle: "italic" }}>Dashboard</em>
          </h1>
          <p style={{ fontSize: 13, color: "rgba(253,250,245,0.4)", fontWeight: 300, letterSpacing: "0.05em", maxWidth: 400 }}>
            Manage active bookings, update fulfillment statuses, and review client feedback.
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 48px 100px", flex: "1 0 auto", width: "100%" }}>
        
        {/* Clickable Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40 }}>
          {STATUSES.map((s) => {
            const style = getStatusStyle(s);
            const isActive = statusFilter === s;
            return (
              <div 
                key={s} 
                onClick={() => setStatusFilter(isActive ? "All" : s)}
                className="admin-card stat-card-clickable" 
                style={{ 
                  border: isActive ? `2px solid ${style.color}` : `1px solid ${style.border}`, 
                  textAlign: "center", 
                  padding: "32px 20px",
                  boxShadow: isActive ? "0 16px 48px rgba(44,36,22,0.06)" : "",
                  transform: isActive ? "translateY(-4px)" : "none"
                }}
              >
                {/* THE FIX: Removed font-display, using Jost for numbers */}
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 48, fontWeight: 400, color: style.color, lineHeight: 1, marginBottom: 8 }}>
                  {counts[s] || 0}
                </p>
                <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(44,36,22,0.5)" }}>
                  {s}
                </p>
              </div>
            );
          })}
        </div>

        {/* Filter Clear Button (Only shows if a filter is active) */}
        {statusFilter !== "All" && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, borderBottom: "1px solid rgba(44,36,22,0.1)", paddingBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#8B6914" }}>
              Showing {displayedOrders.length} {statusFilter} order{displayedOrders.length !== 1 ? 's' : ''}
            </span>
            <button 
              onClick={() => setStatusFilter("All")}
              style={{ background: "transparent", border: "1px solid rgba(44,36,22,0.2)", color: "#2C2416", padding: "6px 16px", borderRadius: 100, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer" }}
            >
              Clear Filter
            </button>
          </div>
        )}

        {/* Orders Table */}
        {loading ? (
           <div style={{ textAlign: "center", padding: "80px 20px", color: "#8B6914", fontSize: "1.2rem" }}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "rgba(44,36,22,0.35)", background: "#fff", border: "1px dashed rgba(44,36,22,0.15)", borderRadius: 4 }}>
            <p className="font-display" style={{ fontSize: 24, fontWeight: 300 }}>No orders have been placed yet.</p>
          </div>
        ) : displayedOrders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "rgba(44,36,22,0.35)", background: "#fff", border: "1px dashed rgba(44,36,22,0.15)", borderRadius: 4 }}>
            <p className="font-display" style={{ fontSize: 24, fontWeight: 300 }}>No {statusFilter.toLowerCase()} orders found.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 24 }}>
            {displayedOrders.map((order) => {
              const style = getStatusStyle(order.status);
              return (
                <div key={order.id} className="admin-card">
                  
                  {/* Top Row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 20 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                        <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(44,36,22,0.4)", fontWeight: 600 }}>Order #{order.id}</span>
                        <span style={{ background: style.bg, color: style.color, padding: "4px 12px", borderRadius: 100, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>{order.status}</span>
                      </div>
                      <h3 className="font-display" style={{ fontSize: 26, margin: "0 0 4px", color: "#2C2416" }}>{order.customerName}</h3>
                      <p style={{ fontSize: 14, color: "rgba(44,36,22,0.6)", marginBottom: 4 }}>📞 {order.contact || order.contactNumber}</p>
                      <p style={{ fontSize: 14, color: "rgba(44,36,22,0.6)" }}>📍 {order.deliveryAddress}</p>
                      <p style={{ fontSize: 13, color: "rgba(44,36,22,0.4)", marginTop: 12 }}>Event Date: {new Date(order.eventDate).toLocaleDateString()}</p>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      {/* THE FIX: Changed $ to Rs and using Jost for the total cost */}
                      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 32, color: "#8B6914", fontWeight: 500, marginBottom: 16 }}>
                        Rs {order.totalCost?.toFixed(2)}
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                        <label style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(44,36,22,0.5)", fontWeight: 600 }}>Update Status</label>
                        <select 
                          value={order.status} 
                          disabled={updatingId === order.id} 
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="status-select"
                        >
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Row */}
                  {order.rating && (
                    <div style={{ marginTop: 24, padding: 20, background: "rgba(139,105,20,0.04)", borderRadius: 4, border: "1px dashed rgba(139,105,20,0.2)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B6914", fontWeight: 600 }}>Client Feedback</span>
                        <span style={{ color: "#8B6914", fontSize: 14 }}>{"★".repeat(order.rating)}</span>
                        <span style={{ fontSize: 12, color: "rgba(44,36,22,0.5)", fontWeight: 500 }}>({order.rating}/5)</span>
                      </div>
                      <p style={{ fontSize: 14, color: "rgba(44,36,22,0.7)", fontStyle: "italic", margin: 0 }}>
                        {order.feedback ? `"${order.feedback}"` : "No written feedback provided."}
                      </p>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer style={{ background: "#1A140D", color: "rgba(253,250,245,0.4)", padding: "40px 60px", flexShrink: 0 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <span className="font-display" style={{ fontSize: 22, color: "rgba(253,250,245,0.7)", fontWeight: 300, letterSpacing: 2 }}>tiramisu.</span>
          <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" }}>© {new Date().getFullYear()} tiramisu. Admin</span>
        </div>
      </footer>
    </div>
  );
}