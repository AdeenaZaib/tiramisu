"use client";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://tiramisu-sy4o.onrender.com";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast"; // <-- Import the Toast component

// THE FIX: Added eventName to the type definition so it correctly pulls from the database
type Order = { 
  id: number; 
  customerName: string; 
  eventName?: string; 
  eventDate: string; 
  deliveryAddress: string; 
  status: string; 
  totalCost: number; 
  createdAt: string; 
  rating?: number; 
  feedback?: string; 
};

export default function MyOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<{ fullName: string } | null>(null);
  
  const [reviewingId, setReviewingId] = useState<number | null>(null);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");

  // Toast States
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Helper to show toasts
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToastMsg(msg);
    setToastType(type);
  };

  const fetchMyOrders = async (name: string) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/customer/${encodeURIComponent(name)}`);
      const data = await res.json();
      
      // SATISFIES TC-04: Sorts by the date the order was PLACED (createdAt) newest first
      data.sort((a: Order, b: Order) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : new Date(a.eventDate).getTime();
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : new Date(b.eventDate).getTime();
        return dateB - dateA; 
      });
      
      setOrders(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const storedUser = typeof window !== "undefined" ? window.localStorage.getItem("user") : null;
    if (!storedUser) { router.push("/auth/login"); return; }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    fetchMyOrders(parsedUser.fullName);
  }, [router]);

  const handleCancel = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    
    try {
      const res = await fetch(`${API_URL}/api/orders/${id}/cancel`, { 
        method: "PUT" 
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to cancel order");
      }
      
      showToast("Order cancelled successfully.", "success"); // Success Toast
      fetchMyOrders(user!.fullName); 
      
    } catch (error) { 
      const errorMessage = error instanceof Error ? error.message : "Error cancelling order";
      showToast(errorMessage, "error"); // Error Toast
    }
  };

  const submitFeedback = async (id: number) => {
    if (rating < 1 || rating > 5) {
      showToast("Rating must be between 1 and 5.", "error"); // Error Toast
      return; 
    }

    try {
      const res = await fetch(`${API_URL}/api/orders/${id}/feedback`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, feedback }),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to submit feedback");
      }
      
      showToast("Thank you for your feedback!", "success"); // Success Toast
      setReviewingId(null);
      fetchMyOrders(user!.fullName); 
    } catch (error) { 
      const errorMessage = error instanceof Error ? error.message : "Error submitting review";
      showToast(errorMessage, "error"); // Error Toast
    }
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Pending': return { bg: "rgba(139,105,20,0.1)", color: "#8B6914" };
      case 'Confirmed': return { bg: "rgba(44,36,22,0.08)", color: "#2C2416" };
      case 'Delivered': return { bg: "rgba(90,112,48,0.15)", color: "#5A7030" };
      case 'Cancelled': return { bg: "rgba(168,50,50,0.1)", color: "#a83232" };
      default: return { bg: "rgba(0,0,0,0.05)", color: "#000" };
    }
  };

  return (
    <div style={{ background: "#FDFAF5", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Jost', sans-serif", color: "#2C2416", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Cormorant Garamond', serif; }
        .btn-outline { background: transparent; border: 1.5px solid rgba(44,36,22,0.2); color: #2C2416; padding: 8px 20px; border-radius: 100px; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; cursor: pointer; transition: all 0.3s; }
        .btn-outline:hover { border-color: #2C2416; }
      `}</style>

      {/* ── Hero Banner ── */}
      <section style={{ position: "relative", height: 320, overflow: "hidden", background: "#2C2416", flexShrink: 0 }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(44,36,22,0.8) 0%, rgba(44,36,22,0.4) 100%)" }} />
        <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", padding: "0 60px", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
            <div style={{ height: 1, width: 40, background: "rgba(253,250,245,0.3)" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(253,250,245,0.45)", fontWeight: 500 }}>Explore</span>
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2.8rem,6vw,5.5rem)", fontWeight: 300, color: "#FDFAF5", lineHeight: 1, marginBottom: 16 }}>
            My Bookings
          </h1>
          <p style={{ fontSize: 14, color: "rgba(253,250,245,0.5)", fontWeight: 300, letterSpacing: "0.05em", maxWidth: 400 }}>
            Manage your confirmed orders, invoices, and feedback.
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 24px", flex: "1 0 auto", width: "100%" }}>
        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "rgba(44,36,22,0.35)" }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>📅</div>
            <p className="font-display" style={{ fontSize: 24, fontWeight: 300 }}>You have no official bookings yet.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 24 }}>
            {orders.map((order) => {
              const statusStyle = getStatusStyle(order.status);
              return (
                <div key={order.id} style={{ background: "#fff", border: "1px solid rgba(44,36,22,0.08)", padding: 32, borderRadius: 8, boxShadow: "0 10px 30px rgba(44,36,22,0.03)" }}>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, borderBottom: "1px solid rgba(44,36,22,0.05)", paddingBottom: 24 }}>
                    <div>
                      <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(44,36,22,0.4)", fontWeight: 600 }}>Order #{order.id}</span>
                      {/* SATISFIES TC-04: Displays Event Name */}
                      <h3 className="font-display" style={{ fontSize: 26, margin: "8px 0" }}>{order.eventName || "Catering Event"}</h3>
                      {/* SATISFIES TC-04: Displays Date */}
                      <p style={{ fontSize: 14, color: "rgba(44,36,22,0.6)" }}>Event Date: {new Date(order.eventDate).toLocaleDateString()}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      {/* SATISFIES TC-04: Displays Status Pill */}
                      <span style={{ background: statusStyle.bg, color: statusStyle.color, padding: "6px 16px", borderRadius: 100, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, display: "inline-block", marginBottom: 12 }}>
                        {order.status}
                      </span>
                      {/* SATISFIES TC-04: Displays Total (Updated to Rs and Jost font) */}
                      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 24, fontWeight: 500, color: "#2C2416" }}>
                        Rs {order.totalCost?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <button onClick={() => router.push(`/customer/invoice/${order.id}`)} className="btn-outline">View Invoice</button>

                    {order.status === "Pending" && (
                      <button onClick={() => handleCancel(order.id)} style={{ background: "transparent", border: "1.5px solid rgba(168,50,50,0.3)", color: "#a83232", padding: "8px 20px", borderRadius: 100, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer", transition: "all 0.3s" }}>
                        Cancel
                      </button>
                    )}

                    {order.status === "Delivered" && !order.rating && reviewingId !== order.id && (
                      <button onClick={() => setReviewingId(order.id)} style={{ background: "rgba(139,105,20,0.1)", border: "1.5px solid transparent", color: "#8B6914", padding: "8px 20px", borderRadius: 100, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer" }}>
                        Leave Review
                      </button>
                    )}

                    {order.rating && (
                      <div style={{ padding: "8px 20px", fontSize: 13, color: "#8B6914", fontWeight: 600 }}>
                        {"★".repeat(order.rating)} ({order.rating}/5)
                      </div>
                    )}
                  </div>

                  {reviewingId === order.id && (
                    <div style={{ marginTop: 24, padding: 24, background: "rgba(139,105,20,0.05)", borderRadius: 8, border: "1px dashed rgba(139,105,20,0.2)" }}>
                      <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, color: "#8B6914", marginBottom: 12 }}>Rate your experience</p>
                      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                        <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(Number(e.target.value))} style={{ width: 80, padding: 12, border: "1px solid rgba(44,36,22,0.15)", borderRadius: 4, fontFamily: "'Jost', sans-serif" }} />
                        <input type="text" placeholder="Share your feedback..." value={feedback} onChange={(e) => setFeedback(e.target.value)} style={{ flex: 1, padding: 12, border: "1px solid rgba(44,36,22,0.15)", borderRadius: 4, fontFamily: "'Jost', sans-serif" }} />
                      </div>
                      <div style={{ display: "flex", gap: 12 }}>
                        <button onClick={() => submitFeedback(order.id)} style={{ background: "#2C2416", color: "#FDFAF5", border: "none", padding: "8px 24px", borderRadius: 100, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer" }}>Submit</button>
                        <button onClick={() => setReviewingId(null)} style={{ background: "transparent", border: "none", color: "rgba(44,36,22,0.5)", fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>Cancel</button>
                      </div>
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
          <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" }}>© {new Date().getFullYear()} tiramisu.</span>
        </div>
      </footer>

      {/* Render the Toast Component */}
      <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg("")} />
    </div>
  );
}