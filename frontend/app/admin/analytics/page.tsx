"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AnalyticsData = {
  totalOrders: number;
  totalRevenue: number;
};

type Review = {
  id: number;
  customerName: string;
  eventName: string;
  rating: number;
  feedback: string;
  eventDate: string;
};

export default function AnalyticsDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<AnalyticsData>({ totalOrders: 0, totalRevenue: 0 });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch both analytics numbers AND the full order list simultaneously
        const [analyticsRes, ordersRes] = await Promise.all([
          fetch("http://localhost:8080/api/orders/analytics"),
          fetch("http://localhost:8080/api/orders/all")
        ]);

        if (analyticsRes.ok) {
          const data = await analyticsRes.json();
          setStats({
            totalOrders: data.totalOrders || 0,
            totalRevenue: data.totalRevenue || 0.0,
          });
        }

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          // Filter only orders that have a rating, and sort them newest first
          const feedbackData = ordersData
            .filter((o: any) => o.rating)
            .sort((a: any, b: any) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
          
          setReviews(feedbackData);
        }

      } catch (err) {
        console.error("Dashboard Data Error:", err);
        setStats({ totalOrders: 0, totalRevenue: 0.0 });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div style={{ background: "#FDFAF5", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Jost', sans-serif", color: "#2C2416" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Cormorant Garamond', serif; }
        .stat-card { background: #fff; border: 1px solid rgba(44,36,22,0.06); padding: 48px; border-radius: 4px; transition: box-shadow 0.35s ease, transform 0.35s ease; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
        .stat-card:hover { box-shadow: 0 16px 48px rgba(44,36,22,0.05); transform: translateY(-2px); }
        .review-card { background: #fff; border: 1px solid rgba(44,36,22,0.08); padding: 32px; border-radius: 4px; box-shadow: 0 10px 30px rgba(44,36,22,0.02); }
      `}</style>

      {/* ── Hero Banner ── */}
      <section style={{ position: "relative", height: 320, overflow: "hidden", background: "#252119", flexShrink: 0, display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", right: "-5%", top: "-20%", width: "500px", height: "500px", border: "1px solid rgba(253,250,245,0.05)", borderRadius: "50%", zIndex: 1 }} />
        <div style={{ position: "absolute", right: "5%", top: "10%", width: "300px", height: "300px", border: "1px solid rgba(253,250,245,0.05)", borderRadius: "50%", zIndex: 1 }} />

        <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 1280, margin: "0 auto", padding: "0 60px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
            <div style={{ height: 1, width: 40, background: "rgba(253,250,245,0.2)" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(253,250,245,0.45)", fontWeight: 600 }}>Management Console</span>
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2.8rem,6vw,5.5rem)", fontWeight: 300, color: "#FDFAF5", lineHeight: 1, marginBottom: 16 }}>
            Business <em style={{ color: "#8B6914", fontStyle: "italic" }}>Analytics</em>
          </h1>
          <p style={{ fontSize: 13, color: "rgba(253,250,245,0.4)", fontWeight: 300, letterSpacing: "0.05em", maxWidth: 400 }}>
            Real-time business metrics and client feedback aggregation.
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 48px 100px", flex: "1 0 auto", width: "100%" }}>
        
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#8B6914", fontSize: "1.2rem" }}>
             Calculating business metrics...
          </div>
        ) : (
          <>
            {/* KPI STATS ROW */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32, marginBottom: 80 }}>
              
              {/* Total Revenue Card */}
              <div className="stat-card">
                <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(44,36,22,0.4)", fontWeight: 600, marginBottom: 16 }}>
                  Total Revenue
                </span>
                {/* THE FIX: Removed .font-display so it uses the clean Jost sans-serif font */}
                <h2 style={{ fontFamily: "'Jost', sans-serif", fontSize: 56, fontWeight: 500, color: "#8B6914", margin: 0, lineHeight: 1.1 }}>
                  Rs. {stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
                <p style={{ fontSize: 13, color: "rgba(44,36,22,0.5)", marginTop: 16 }}>
                  Aggregated from all active orders
                </p>
              </div>

              {/* Total Orders Card */}
              <div className="stat-card">
                <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(44,36,22,0.4)", fontWeight: 600, marginBottom: 16 }}>
                  Total Orders Placed
                </span>
                {/* THE FIX: Removed .font-display so it uses the clean Jost sans-serif font */}
                <h2 style={{ fontFamily: "'Jost', sans-serif", fontSize: 56, fontWeight: 500, color: "#2C2416", margin: 0, lineHeight: 1.1 }}>
                  {stats.totalOrders}
                </h2>
                <p style={{ fontSize: 13, color: "rgba(44,36,22,0.5)", marginTop: 16 }}>
                  Excluding cancelled bookings
                </p>
              </div>
            </div>

            {/* REVIEWS SECTION */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, borderBottom: "1px solid rgba(44,36,22,0.1)", paddingBottom: 16 }}>
              <h2 className="font-display" style={{ fontSize: 36, fontWeight: 300, color: "#2C2416", margin: 0 }}>Recent Client Feedback</h2>
              <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(44,36,22,0.5)", fontWeight: 600 }}>
                {reviews.length} Reviews Found
              </span>
            </div>

            {reviews.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", border: "1px dashed rgba(44,36,22,0.15)", borderRadius: 4 }}>
                <p className="font-display" style={{ fontSize: 22, color: "rgba(44,36,22,0.4)" }}>No client feedback has been submitted yet.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 24 }}>
                {reviews.map((review, idx) => (
                  <div key={idx} className="review-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                      <div>
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#2C2416", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{review.customerName}</h3>
                        <p style={{ fontSize: 12, color: "rgba(44,36,22,0.5)", margin: 0 }}>Order #{review.id} • {new Date(review.eventDate).toLocaleDateString()}</p>
                      </div>
                      <div style={{ background: "rgba(139,105,20,0.1)", padding: "4px 10px", borderRadius: 100, display: "flex", gap: 4 }}>
                         <span style={{ color: "#8B6914", fontSize: 14 }}>{"★".repeat(review.rating)}</span>
                      </div>
                    </div>
                    
                    <p style={{ fontSize: 15, color: "rgba(44,36,22,0.8)", fontStyle: "italic", lineHeight: 1.6, margin: 0 }}>
                      {review.feedback ? `"${review.feedback}"` : "No written text provided. Left a star rating only."}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
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