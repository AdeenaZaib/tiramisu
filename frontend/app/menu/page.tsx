"use client";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://tiramisu-sy4o.onrender.com";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

type FrontendMenuItem = {
  id: number;
  name: string;
  desc: string;
  price: string;
  cuisine: string;
  category: string;
  img: string;
  icon: string;
};

export default function PublicMenuPage() {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<FrontendMenuItem[]>([]);
  const [cuisines, setCuisines] = useState<string[]>(["All"]);
  const [activeCuisine, setActiveCuisine] = useState("All");
  const [loading, setLoading] = useState(true);

  // FETCH DATA FROM SPRING BOOT BACKEND
  useEffect(() => {
    fetch(`${API_URL}/api/menu/all`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch menu");
        return res.json();
      })
      .then((data) => {
        const formattedData: FrontendMenuItem[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          desc: item.description || "A delicious catering option crafted with care.",
          price: `$${Number(item.price).toFixed(2)}`,
          cuisine: item.category || "General",
          category: "Dish", 
          img: `/images/menu/${item.name.toLowerCase().replace(/\s+/g, '-')}.jpg`,
          icon: "🍽️", 
        }));

        setMenuItems(formattedData);
        const uniqueCategories = Array.from(new Set(formattedData.map((i) => i.cuisine)));
        setCuisines(["All", ...uniqueCategories]);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered = activeCuisine === "All"
    ? menuItems
    : menuItems.filter(i => i.cuisine === activeCuisine);

  return (
    <div style={{ background: "#FDFAF5", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Jost', sans-serif", color: "#2C2416" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Cormorant Garamond', serif; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
        .cuisine-tab { border: 1.5px solid rgba(44,36,22,0.15); background: transparent; color: rgba(44,36,22,0.5); padding: 10px 22px; border-radius: 100px; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 500; cursor: pointer; font-family: 'Jost', sans-serif; transition: all 0.25s ease; white-space: nowrap; }
        .cuisine-tab:hover { border-color: rgba(44,36,22,0.35); color: rgba(44,36,22,0.8); }
        .cuisine-tab.active { background: #2C2416; border-color: #2C2416; color: #FDFAF5; }
        .menu-card { background: #fff; border-radius: 4px; overflow: hidden; transition: box-shadow 0.35s ease, transform 0.35s ease; cursor: default; border: 1px solid rgba(44,36,22,0.06); }
        .menu-card:hover { box-shadow: 0 16px 48px rgba(44,36,22,0.10); transform: translateY(-3px); }
        .menu-img-wrap { overflow: hidden; }
        .menu-img-wrap img { transition: transform 0.65s cubic-bezier(.25,.46,.45,.94); }
        .menu-card:hover .menu-img-wrap img { transform: scale(1.06); }
        .order-btn { background: #2C2416; color: #FDFAF5; border: none; padding: 9px 20px; border-radius: 100px; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; cursor: pointer; font-family: 'Jost', sans-serif; transition: background 0.25s ease; }
        .order-btn:hover { background: #8B6914; }
      `}</style>

      {/* ── Standalone Custom Header ── */}
      <header style={{ background: "rgba(253,250,245,0.96)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(44,36,22,0.07)", position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => router.push("/")}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, color: "rgba(44,36,22,0.5)", fontFamily: "'Jost', sans-serif", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 500, padding: 0, transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#2C2416"}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "rgba(44,36,22,0.5)"}
          >
            ← Back
          </button>
          <span className="font-display" style={{ fontSize: 24, letterSpacing: 2, color: "#2C2416", fontWeight: 400 }}>tiramisu.</span>
          <button onClick={() => router.push("/auth")}
            style={{ background: "transparent", border: "1.5px solid rgba(44,36,22,0.25)", color: "#2C2416", padding: "9px 24px", borderRadius: 100, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer", fontFamily: "'Jost', sans-serif", transition: "all 0.3s ease" }}
            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "#2C2416"; b.style.color = "#FDFAF5"; }}
            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "transparent"; b.style.color = "#2C2416"; }}
          >
            Login
          </button>
        </div>
      </header>

      {/* ── Hero banner ── */}
      <section style={{ position: "relative", height: 320, overflow: "hidden", background: "#2C2416", flexShrink: 0 }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(44,36,22,0.8) 0%, rgba(44,36,22,0.4) 100%)" }} />
        <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", padding: "0 60px", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
            <div style={{ height: 1, width: 40, background: "rgba(253,250,245,0.3)" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(253,250,245,0.45)", fontWeight: 500 }}>Explore</span>
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2.8rem,6vw,5.5rem)", fontWeight: 300, color: "#FDFAF5", lineHeight: 1, marginBottom: 16 }}>
            Our Menu
          </h1>
          <p style={{ fontSize: 14, color: "rgba(253,250,245,0.5)", fontWeight: 300, letterSpacing: "0.05em", maxWidth: 400 }}>
            Crafted with care — browse our full selection of dishes and log in to place your catering order.
          </p>
        </div>
      </section>

      {/* ── Dynamic Cuisine filter tabs ── */}
      <div style={{ background: "#F5EFE3", borderBottom: "1px solid rgba(44,36,22,0.07)", position: "sticky", top: 72, zIndex: 30, flexShrink: 0 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px" }}>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "18px 0", scrollbarWidth: "none" }}>
            {cuisines.map(c => (
              <button key={c} className={`cuisine-tab${activeCuisine === c ? " active" : ""}`} onClick={() => setActiveCuisine(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 48px 100px", flex: "1 0 auto", width: "100%" }}>
        {loading ? (
           <div style={{ textAlign: "center", padding: "80px 20px", color: "#8B6914", fontSize: "1.2rem" }}>
             Loading exquisite dishes...
           </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 44, flexWrap: "wrap", gap: 16 }}>
              <div>
                <h2 className="font-display" style={{ fontSize: "clamp(1.8rem,3vw,2.8rem)", fontWeight: 300, color: "#2C2416", marginBottom: 4 }}>
                  {activeCuisine === "All" ? "All Dishes" : activeCuisine}
                </h2>
                <p style={{ fontSize: 13, color: "rgba(44,36,22,0.4)", fontWeight: 300, letterSpacing: "0.05em" }}>
                  {filtered.length} {filtered.length === 1 ? "dish" : "dishes"} available
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ height: 1, width: 32, background: "rgba(139,105,20,0.35)" }} />
                <span style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(139,105,20,0.6)", fontWeight: 500 }}>Crafted with care</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
              {filtered.map((item, idx) => (
                <div key={item.id} className="menu-card fade-up" style={{ animationDelay: `${idx * 0.04}s` }}>
                  <div className="menu-img-wrap" style={{ position: "relative", height: 210, background: "#EDE0C8" }}>
                    <Image src={item.img} alt={item.name} fill style={{ objectFit: "cover" }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                    <div style={{ position: "absolute", inset: 0, zIndex: -1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 64, opacity: 0.35 }}>{item.icon}</span>
                    </div>
                  </div>
                  <div style={{ padding: "22px 22px 26px" }}>
                    <span style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#8B6914", fontWeight: 600 }}>{item.cuisine}</span>
                    <h3 className="font-display" style={{ fontSize: 22, fontWeight: 400, color: "#2C2416", margin: "7px 0 10px", lineHeight: 1.2 }}>{item.name}</h3>
                    <p style={{ fontSize: 13, color: "rgba(44,36,22,0.5)", lineHeight: 1.75, fontWeight: 300, marginBottom: 20, minHeight: 60 }}>{item.desc}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span className="font-display" style={{ fontSize: 20, fontWeight: 400, color: "#2C2416" }}>{item.price}</span>
                      <button className="order-btn" onClick={() => router.push("/auth")}>Login to Order</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* ── Footer ── */}
      <footer style={{ background: "#1A140D", color: "rgba(253,250,245,0.4)", padding: "40px 60px", flexShrink: 0 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <span className="font-display" style={{ fontSize: 22, color: "rgba(253,250,245,0.7)", fontWeight: 300, letterSpacing: 2 }}>tiramisu.</span>
          <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" }}>© {new Date().getFullYear()} tiramisu.</span>
        </div>
      </footer>
    </div>
  );
}