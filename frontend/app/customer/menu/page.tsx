"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Image from "next/image";

// ─── Data ───────────────────────────────────────────────────────────────────

type MenuItem = {
  id: number;
  name: string;
  desc: string;
  price: string;
  cuisine: string;
  category: string;
  img: string;
  icon: string;
  tag?: string;
};

const CUISINES = ["All", "Pakistani", "Continental", "Italian", "BBQ & Grills", "Desserts & Sweets"];

const MENU_ITEMS: MenuItem[] = [
  // Pakistani
  { id: 1, name: "Chicken Karahi", desc: "Tender chicken slow-cooked in a rich tomato and spice base, finished with fresh ginger and coriander.", price: "Rs 2,800", cuisine: "Pakistani", category: "Main", img: "/images/menu/karahi.jpg", icon: "🍛", tag: "Bestseller" },
  { id: 2, name: "Mutton Biryani", desc: "Fragrant basmati rice layered with slow-cooked mutton, saffron, and whole spices.", price: "Rs 3,200", cuisine: "Pakistani", category: "Main", img: "/images/menu/biryani.jpg", icon: "🍚", tag: "Signature" },
  { id: 3, name: "Seekh Kebab Platter", desc: "Hand-minced spiced beef kebabs, grilled over charcoal and served with mint chutney.", price: "Rs 1,800", cuisine: "Pakistani", category: "Starter", img: "/images/menu/seekh.jpg", icon: "🍢" },
  { id: 4, name: "Nihari", desc: "A slow-cooked overnight stew of tender beef shank with aromatic whole spices.", price: "Rs 2,400", cuisine: "Pakistani", category: "Main", img: "/images/menu/nihari.jpg", icon: "🥘", tag: "Chef's Pick" },
  { id: 5, name: "Aloo Keema Samosa", desc: "Crispy pastry pockets filled with spiced potato and minced meat — perfect canapés.", price: "Rs 900", cuisine: "Pakistani", category: "Starter", img: "/images/menu/samosa.jpg", icon: "🥟" },
  { id: 6, name: "Rabri Kheer", desc: "Slow-reduced milk pudding with cardamom, rose water, and crushed pistachios.", price: "Rs 750", cuisine: "Pakistani", category: "Dessert", img: "/images/menu/kheer.jpg", icon: "🍮" },

  // Continental
  { id: 7, name: "Herb Roasted Chicken", desc: "Free-range chicken marinated in fresh herbs, roasted to golden perfection with seasonal vegetables.", price: "Rs 2,600", cuisine: "Continental", category: "Main", img: "/images/menu/herb-chicken.jpg", icon: "🍗", tag: "Bestseller" },
  { id: 8, name: "Garden Fresh Salad", desc: "Crisp seasonal greens, cherry tomatoes, cucumber ribbons, and a honey mustard dressing.", price: "Rs 950", cuisine: "Continental", category: "Starter", img: "/images/menu/salad.jpg", icon: "🥗" },
  { id: 9, name: "Beef Wellington", desc: "Prime beef tenderloin wrapped in mushroom duxelles and golden puff pastry.", price: "Rs 5,500", cuisine: "Continental", category: "Main", img: "/images/menu/wellington.jpg", icon: "🥩", tag: "Premium" },
  { id: 10, name: "Cream of Mushroom Soup", desc: "Velvety wild mushroom soup with thyme cream and toasted sourdough croutons.", price: "Rs 800", cuisine: "Continental", category: "Starter", img: "/images/menu/mushroom-soup.jpg", icon: "🍲" },
  { id: 11, name: "Crème Brûlée", desc: "Classic French vanilla custard with a perfectly caramelised sugar crust.", price: "Rs 850", cuisine: "Continental", category: "Dessert", img: "/images/menu/creme-brulee.jpg", icon: "🍮", tag: "Chef's Pick" },

  // Italian
  { id: 12, name: "Truffle Pasta", desc: "Hand-rolled tagliatelle with black truffle, parmesan cream, and toasted pine nuts.", price: "Rs 2,200", cuisine: "Italian", category: "Main", img: "/images/menu/pasta.jpg", icon: "🍝", tag: "Signature" },
  { id: 13, name: "Margherita Pizza", desc: "Wood-fired dough with San Marzano tomatoes, fresh buffalo mozzarella, and basil.", price: "Rs 1,800", cuisine: "Italian", category: "Main", img: "/images/menu/pizza.jpg", icon: "🍕" },
  { id: 14, name: "Burrata Bruschetta", desc: "Grilled sourdough topped with creamy burrata, heritage tomatoes, and aged balsamic.", price: "Rs 1,100", cuisine: "Italian", category: "Starter", img: "/images/menu/bruschetta.jpg", icon: "🍞" },
  { id: 15, name: "Tiramisu", desc: "Classic layered espresso-soaked ladyfingers with mascarpone cream and cocoa.", price: "Rs 950", cuisine: "Italian", category: "Dessert", img: "/images/menu/tiramisu.jpg", icon: "🍰", tag: "Bestseller" },
  { id: 16, name: "Risotto al Porcini", desc: "Slow-stirred Arborio rice with porcini mushrooms, white wine, and aged parmesan.", price: "Rs 1,900", cuisine: "Italian", category: "Main", img: "/images/menu/risotto.jpg", icon: "🍚" },

  // BBQ
  { id: 17, name: "Mixed Grill Platter", desc: "A generous selection of charcoal-grilled chicken tikka, boti, seekh kebab, and lamb chops.", price: "Rs 4,200", cuisine: "BBQ & Grills", category: "Main", img: "/images/menu/mixed-grill.jpg", icon: "🔥", tag: "Bestseller" },
  { id: 18, name: "Lamb Chops", desc: "Marinated rack of lamb chops grilled over open charcoal, served with raita and naan.", price: "Rs 3,800", cuisine: "BBQ & Grills", category: "Main", img: "/images/menu/lamb-chops.jpg", icon: "🥩", tag: "Signature" },
  { id: 19, name: "Chicken Tikka", desc: "Bone-in chicken marinated overnight in yoghurt and spices, cooked in a clay oven.", price: "Rs 2,200", cuisine: "BBQ & Grills", category: "Main", img: "/images/menu/tikka.jpg", icon: "🍖" },
  { id: 20, name: "Boti Kebab", desc: "Tender cubes of marinated beef threaded on skewers and grilled over hot coals.", price: "Rs 2,400", cuisine: "BBQ & Grills", category: "Starter", img: "/images/menu/boti.jpg", icon: "🍢" },

  // Desserts
  { id: 21, name: "Gulab Jamun", desc: "Soft milk-solid dumplings soaked in rose and cardamom sugar syrup, served warm.", price: "Rs 600", cuisine: "Desserts & Sweets", category: "Dessert", img: "/images/menu/gulab-jamun.jpg", icon: "🍯", tag: "Bestseller" },
  { id: 22, name: "Gajar Halwa", desc: "Slow-cooked carrot halwa with khoya, cardamom, and garnished with silver leaf and nuts.", price: "Rs 700", cuisine: "Desserts & Sweets", category: "Dessert", img: "/images/menu/halwa.jpg", icon: "🥕", tag: "Seasonal" },
  { id: 23, name: "Fruit Trifle", desc: "Layered sponge, whipped cream, fresh seasonal fruits, and custard in a show-stopping bowl.", price: "Rs 850", cuisine: "Desserts & Sweets", category: "Dessert", img: "/images/menu/trifle.jpg", icon: "🍓" },
  { id: 24, name: "Chocolate Fondant", desc: "Warm dark chocolate lava cake with a molten centre, served with vanilla bean ice cream.", price: "Rs 1,100", cuisine: "Desserts & Sweets", category: "Dessert", img: "/images/menu/fondant.jpg", icon: "🍫", tag: "Chef's Pick" },
];

// ─── Tag colours ─────────────────────────────────────────────────────────────
const TAG_STYLE: Record<string, { bg: string; color: string }> = {
  "Bestseller": { bg: "rgba(139,105,20,0.12)", color: "#8B6914" },
  "Signature":  { bg: "rgba(44,36,22,0.08)",  color: "#5C4A2A" },
  "Chef's Pick":{ bg: "rgba(120,80,40,0.1)",  color: "#7A5028" },
  "Premium":    { bg: "rgba(80,60,20,0.1)",   color: "#6B5020" },
  "Seasonal":   { bg: "rgba(100,130,60,0.1)", color: "#5A7030" },
};

// ─── Inner page (uses useSearchParams so needs Suspense boundary) ────────────
function MenuCatalogInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromLanding = searchParams.get("from") === "landing";

  const [activeCuisine, setActiveCuisine] = useState("All");
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const filtered = activeCuisine === "All"
    ? MENU_ITEMS
    : MENU_ITEMS.filter(i => i.cuisine === activeCuisine);

  return (
    <div style={{ background: "#FDFAF5", minHeight: "100vh", fontFamily: "'Jost', sans-serif", color: "#2C2416" }}>

      {/* ── Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Cormorant Garamond', serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease forwards; }

        .cuisine-tab {
          border: 1.5px solid rgba(44,36,22,0.15);
          background: transparent;
          color: rgba(44,36,22,0.5);
          padding: 10px 22px;
          border-radius: 100px;
          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 500;
          cursor: pointer;
          font-family: 'Jost', sans-serif;
          transition: all 0.25s ease;
          white-space: nowrap;
        }
        .cuisine-tab:hover {
          border-color: rgba(44,36,22,0.35);
          color: rgba(44,36,22,0.8);
        }
        .cuisine-tab.active {
          background: #2C2416;
          border-color: #2C2416;
          color: #FDFAF5;
        }

        .menu-card {
          background: #fff;
          border-radius: 4px;
          overflow: hidden;
          transition: box-shadow 0.35s ease, transform 0.35s ease;
          cursor: default;
          border: 1px solid rgba(44,36,22,0.06);
        }
        .menu-card:hover {
          box-shadow: 0 16px 48px rgba(44,36,22,0.10);
          transform: translateY(-3px);
        }
        .menu-img-wrap { overflow: hidden; }
        .menu-img-wrap img { transition: transform 0.65s cubic-bezier(.25,.46,.45,.94); }
        .menu-card:hover .menu-img-wrap img { transform: scale(1.06); }

        .order-btn {
          background: #2C2416;
          color: #FDFAF5;
          border: none;
          padding: 9px 20px;
          border-radius: 100px;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Jost', sans-serif;
          transition: background 0.25s ease;
        }
        .order-btn:hover { background: #8B6914; }
      `}</style>

      {/* ── Header: Landing variant ── */}
      {fromLanding ? (
        <header style={{
          background: "rgba(253,250,245,0.96)", backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(44,36,22,0.07)",
          position: "sticky", top: 0, zIndex: 40,
        }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={() => router.push("/")}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, color: "rgba(44,36,22,0.5)", fontFamily: "'Jost', sans-serif", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 500, padding: 0, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#2C2416"}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "rgba(44,36,22,0.5)"}
            >
              ← Back
            </button>
            <span className="font-display" style={{ fontSize: 24, letterSpacing: 2, color: "#2C2416", fontWeight: 400 }}>La Tavola</span>
            <button onClick={() => router.push("/auth")}
              style={{ background: "transparent", border: "1.5px solid rgba(44,36,22,0.3)", color: "#2C2416", padding: "9px 24px", borderRadius: 100, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer", fontFamily: "'Jost', sans-serif", transition: "all 0.3s ease" }}
              onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "#2C2416"; b.style.color = "#FDFAF5"; }}
              onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "transparent"; b.style.color = "#2C2416"; }}
            >Login</button>
          </div>
        </header>
      ) : (
        /* ── Header: Customer dashboard variant ── */
        <header style={{
          background: "rgba(253,250,245,0.96)", backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(44,36,22,0.07)",
          position: "sticky", top: 0, zIndex: 40,
        }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={() => router.push("/customer")}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, color: "rgba(44,36,22,0.5)", fontFamily: "'Jost', sans-serif", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 500, padding: 0, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#2C2416"}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "rgba(44,36,22,0.5)"}
            >
              ← Dashboard
            </button>
            <span className="font-display" style={{ fontSize: 24, letterSpacing: 2, color: "#2C2416", fontWeight: 400 }}>La Tavola</span>
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <button onClick={() => router.push("/customer/orders")}
                style={{ background: "none", border: "none", color: "rgba(44,36,22,0.45)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500, cursor: "pointer", fontFamily: "'Jost', sans-serif", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#2C2416"}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "rgba(44,36,22,0.45)"}
              >My Orders</button>
              <button onClick={() => router.push("/auth")}
                style={{ background: "transparent", border: "1.5px solid rgba(44,36,22,0.25)", color: "#2C2416", padding: "9px 24px", borderRadius: 100, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer", fontFamily: "'Jost', sans-serif", transition: "all 0.3s ease" }}
                onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "#2C2416"; b.style.color = "#FDFAF5"; }}
                onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "transparent"; b.style.color = "#2C2416"; }}
              >Logout</button>
            </div>
          </div>
        </header>
      )}

      {/* ── Hero banner ── */}
      <section style={{ position: "relative", height: 320, overflow: "hidden", background: "#2C2416" }}>
        <Image src="/images/menu-hero.jpg" alt="Menu" fill
          style={{ objectFit: "cover", objectPosition: "center 40%", opacity: 0.35 }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(44,36,22,0.7) 0%, rgba(44,36,22,0.3) 100%)" }} />
        <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", padding: "0 60px", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
            <div style={{ height: 1, width: 40, background: "rgba(253,250,245,0.3)" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(253,250,245,0.45)", fontWeight: 500 }}>Explore</span>
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2.8rem,6vw,5.5rem)", fontWeight: 300, color: "#FDFAF5", lineHeight: 1, marginBottom: 16 }}>
            Our Menu
          </h1>
          <p style={{ fontSize: 14, color: "rgba(253,250,245,0.5)", fontWeight: 300, letterSpacing: "0.05em", maxWidth: 400 }}>
            {fromLanding
              ? "Crafted with care — browse our full selection of dishes and place your catering order."
              : "Welcome back. Browse our menu and add dishes to your order."}
          </p>
        </div>
      </section>

      {/* ── Cuisine filter tabs ── */}
      <div style={{ background: "#F5EFE3", borderBottom: "1px solid rgba(44,36,22,0.07)", position: "sticky", top: 72, zIndex: 30 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px" }}>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "18px 0", scrollbarWidth: "none" }}>
            {CUISINES.map(c => (
              <button key={c} className={`cuisine-tab${activeCuisine === c ? " active" : ""}`}
                onClick={() => setActiveCuisine(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 48px 100px" }}>

        {/* Section label */}
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

        {/* Card grid */}
        <div key={activeCuisine} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              className="menu-card fade-up"
              style={{ animationDelay: `${idx * 0.04}s` }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Image */}
              <div className="menu-img-wrap" style={{ position: "relative", height: 210, background: "#EDE0C8" }}>
                <Image src={item.img} alt={item.name} fill
                  style={{ objectFit: "cover" }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
                {/* Fallback */}
                <div style={{ position: "absolute", inset: 0, zIndex: -1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 64, opacity: 0.35 }}>{item.icon}</span>
                </div>
                {/* Category pill */}
                <div style={{
                  position: "absolute", bottom: 12, left: 12, zIndex: 2,
                  background: "rgba(253,250,245,0.9)", backdropFilter: "blur(8px)",
                  padding: "4px 12px", borderRadius: 100,
                  fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase",
                  fontWeight: 600, color: "rgba(44,36,22,0.6)",
                }}>
                  {item.category}
                </div>
                {/* Tag */}
                {item.tag && (
                  <div style={{
                    position: "absolute", top: 12, right: 12, zIndex: 2,
                    background: TAG_STYLE[item.tag]?.bg ?? "rgba(139,105,20,0.1)",
                    padding: "4px 12px", borderRadius: 100,
                    fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase",
                    fontWeight: 600, color: TAG_STYLE[item.tag]?.color ?? "#8B6914",
                    backdropFilter: "blur(8px)",
                  }}>
                    {item.tag}
                  </div>
                )}
              </div>

              {/* Body */}
              <div style={{ padding: "22px 22px 26px" }}>
                <span style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#8B6914", fontWeight: 600 }}>
                  {item.cuisine}
                </span>
                <h3 className="font-display" style={{ fontSize: 22, fontWeight: 400, color: "#2C2416", margin: "7px 0 10px", lineHeight: 1.2 }}>
                  {item.name}
                </h3>
                <p style={{ fontSize: 13, color: "rgba(44,36,22,0.5)", lineHeight: 1.75, fontWeight: 300, marginBottom: 20, minHeight: 60 }}>
                  {item.desc}
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span className="font-display" style={{ fontSize: 20, fontWeight: 400, color: "#2C2416" }}>
                    {item.price}
                  </span>
                  <button
                    className="order-btn"
                    onClick={() => router.push(fromLanding ? "/auth" : `/customer/orders/new?item=${item.id}`)}
                  >
                    {fromLanding ? "Order" : "Add to Order"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "rgba(44,36,22,0.35)" }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>🍽️</div>
            <p className="font-display" style={{ fontSize: 24, fontWeight: 300 }}>No dishes found</p>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer style={{ background: "#1A140D", color: "rgba(253,250,245,0.4)", padding: "40px 60px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <span className="font-display" style={{ fontSize: 22, color: "rgba(253,250,245,0.7)", fontWeight: 300, letterSpacing: 2 }}>La Tavola</span>
          <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" }}>© {new Date().getFullYear()} La Tavola Catering</span>
          <button onClick={() => router.push(fromLanding ? "/" : "/customer")}
            style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'Jost', sans-serif", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#8B6914"}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "rgba(253,250,245,0.4)"}
          >
            {fromLanding ? "← Back to Home" : "← Dashboard"}
          </button>
        </div>
      </footer>
    </div>
  );
}

// ─── Export with Suspense (required for useSearchParams in Next.js) ────────────
export default function MenuCatalogPage() {
  return (
    <Suspense>
      <MenuCatalogInner />
    </Suspense>
  );
}