const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://tiramisu-sy4o.onrender.com";
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Order = {
  id: number;
  customerName: string;
  eventName: string;
  eventDate: string;
  deliveryAddress: string;
  status: string;
  subtotal: number;
  tax: number;
  totalCost: number;
  items: Array<{
    quantity: number;
    priceAtOrder: number;
    menuItem: { name: string; price: number };
  }>;
};

export default function InvoicePage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the specific order by ID
    fetch(`${API_URL}/api/orders/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Invoice not found");
        return res.json();
      })
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return <div style={{ background: "#FDFAF5", minHeight: "100vh", padding: 60, textAlign: "center", fontFamily: "'Jost', sans-serif" }}>Loading Invoice...</div>;
  }

  if (!order) {
    return (
      <div style={{ background: "#FDFAF5", minHeight: "100vh", padding: 60, textAlign: "center", fontFamily: "'Jost', sans-serif" }}>
        <h1 style={{ fontSize: 32 }}>Invoice Not Found</h1>
        <button onClick={() => router.back()} style={{ marginTop: 20, padding: "10px 20px", cursor: "pointer" }}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ background: "#FDFAF5", minHeight: "100vh", fontFamily: "'Jost', sans-serif", color: "#2C2416", padding: "40px 24px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Cormorant Garamond', serif; }
        
        /* This hides the back/print buttons when the user actually prints the page! */
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .invoice-box { box-shadow: none !important; border: none !important; padding: 0 !important; }
        }
      `}</style>

      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        
        {/* Actions (Hidden during printing) */}
        <div className="no-print" style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
          <button onClick={() => router.push("/customer/orders")} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, color: "rgba(44,36,22,0.6)" }}>
            ← Back to Orders
          </button>
          <button onClick={() => window.print()} style={{ background: "#2C2416", color: "#FDFAF5", border: "none", padding: "10px 24px", borderRadius: 100, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer" }}>
            Print Invoice
          </button>
        </div>

        {/* Invoice Paper */}
        <div className="invoice-box" style={{ background: "#fff", border: "1px solid rgba(44,36,22,0.08)", padding: 60, borderRadius: 4, boxShadow: "0 24px 48px rgba(44,36,22,0.05)" }}>
          
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #2C2416", paddingBottom: 32, marginBottom: 40 }}>
            <div>
              <h1 className="font-display" style={{ fontSize: 42, letterSpacing: 2, marginBottom: 8, lineHeight: 1 }}>tiramisu.</h1>
              <p style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(44,36,22,0.5)" }}>Premium Catering Services</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <h2 style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B6914", fontWeight: 600, marginBottom: 8 }}>Invoice</h2>
              <p className="font-display" style={{ fontSize: 24, margin: 0 }}>#{order.id.toString().padStart(5, '0')}</p>
              <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(44,36,22,0.05)", padding: "4px 10px", borderRadius: 100, display: "inline-block", marginTop: 12 }}>
                Status: {order.status}
              </span>
            </div>
          </div>

          {/* Customer Details */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 48 }}>
            <div>
              <p style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(44,36,22,0.4)", fontWeight: 600, marginBottom: 8 }}>Billed To</p>
              <p className="font-display" style={{ fontSize: 24, margin: "0 0 4px" }}>{order.customerName}</p>
              <p style={{ fontSize: 14, color: "rgba(44,36,22,0.7)" }}>Event: {order.eventName || "Catering Event"}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(44,36,22,0.4)", fontWeight: 600, marginBottom: 8 }}>Event Details</p>
              <p style={{ fontSize: 14, color: "rgba(44,36,22,0.8)", margin: "0 0 4px" }}>Date: {new Date(order.eventDate).toLocaleDateString()}</p>
              <p style={{ fontSize: 14, color: "rgba(44,36,22,0.8)", margin: 0 }}>Venue: {order.deliveryAddress}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 40 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(44,36,22,0.1)" }}>
                <th style={{ textAlign: "left", padding: "12px 0", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(44,36,22,0.5)" }}>Item Description</th>
                <th style={{ textAlign: "center", padding: "12px 0", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(44,36,22,0.5)" }}>Guests</th>
                <th style={{ textAlign: "right", padding: "12px 0", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(44,36,22,0.5)" }}>Price/Pax</th>
                <th style={{ textAlign: "right", padding: "12px 0", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(44,36,22,0.5)" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => {
                // Use priceAtOrder if available, otherwise fallback to current menuItem price
                const price = item.priceAtOrder || item.menuItem.price;
                const lineTotal = price * item.quantity;
                return (
                  <tr key={idx} style={{ borderBottom: "1px dashed rgba(44,36,22,0.08)" }}>
                    <td style={{ padding: "16px 0", fontSize: 15 }}>{item.menuItem.name}</td>
                    <td style={{ textAlign: "center", padding: "16px 0", fontSize: 14, color: "rgba(44,36,22,0.7)" }}>{item.quantity}</td>
                    <td style={{ textAlign: "right", padding: "16px 0", fontSize: 14, color: "rgba(44,36,22,0.7)" }}>${price.toFixed(2)}</td>
                    <td style={{ textAlign: "right", padding: "16px 0", fontSize: 15, fontWeight: 500 }}>${lineTotal.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ width: "300px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 14, color: "rgba(44,36,22,0.6)" }}>
                <span>Subtotal</span>
                <span>${(order.subtotal || order.totalCost / 1.1).toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, fontSize: 14, color: "rgba(44,36,22,0.6)" }}>
                <span>Tax (10%)</span>
                <span>${(order.tax || (order.totalCost - (order.totalCost / 1.1))).toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid #2C2416", paddingTop: 16, fontSize: 20, fontWeight: 600 }}>
                <span className="font-display">Total Billed</span>
                <span style={{ color: "#8B6914" }}>${order.totalCost.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: 80, borderTop: "1px solid rgba(44,36,22,0.1)", paddingTop: 24, textAlign: "center" }}>
            <p className="font-display" style={{ fontSize: 18, color: "rgba(44,36,22,0.8)", marginBottom: 8 }}>Thank you for dining with tiramisu.</p>
            <p style={{ fontSize: 12, color: "rgba(44,36,22,0.4)" }}>If you have any questions regarding this invoice, please contact billing@tiramisu.com.</p>
          </div>

        </div>
      </div>
    </div>
  );
}