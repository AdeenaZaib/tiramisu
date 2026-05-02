"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

// Match the type from your backend
type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  itemType?: string;
};

export default function HomePage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [featuredMenu, setFeaturedMenu] = useState<MenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);

  useEffect(() => {
    setVisible(true);
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);

    // Fetch the real menu from the database
    fetch("http://localhost:8080/api/menu/all")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data: MenuItem[]) => {
        // Grab the first 4 items to feature on the landing page
        setFeaturedMenu(data.slice(0, 4));
        setLoadingMenu(false);
      })
      .catch((err) => {
        console.error("Error fetching menu:", err);
        setLoadingMenu(false);
      });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: "#FDFAF5", color: "#2C2416", fontFamily: "'Jost', sans-serif" }}
    >
      {/* ── Google Fonts & Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');

        .font-display { font-family: 'Cormorant Garamond', serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-1 { animation: fadeUp 0.9s ease forwards; opacity: 0; }
        .anim-2 { animation: fadeUp 0.9s 0.15s ease forwards; opacity: 0; }
        .anim-3 { animation: fadeUp 0.9s 0.3s ease forwards; opacity: 0; }
        .anim-4 { animation: fadeUp 0.9s 0.45s ease forwards; opacity: 0; }

        .img-zoom { transition: transform 0.7s cubic-bezier(.25,.46,.45,.94); }
        .img-zoom:hover { transform: scale(1.05); }

        .card-lift { transition: box-shadow 0.4s ease, transform 0.4s ease; }
        .card-lift:hover { box-shadow: 0 20px 60px rgba(44,36,22,0.10); transform: translateY(-4px); }
      `}</style>

      {/* ── Consistent System Header ── */}
      <header style={{
        background: scrolled ? "rgba(253,250,245,0.96)" : "transparent", 
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(44,36,22,0.07)" : "1px solid transparent",
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        transition: "all 0.5s ease"
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center" }}>
             <span className="font-display" style={{ fontSize: 24, letterSpacing: 2, color: "#2C2416", fontWeight: 600 }}>
               tiramisu.
             </span>
          </div>

          {/* Navigation Links (Centered styling) */}
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {["about", "services", "gallery", "menu"].map(l => (
              <a key={l} href={`#${l}`}
                style={{ 
                  textDecoration: "none", color: "rgba(44,36,22,0.6)", 
                  fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", 
                  fontWeight: 600, transition: "color 0.2s ease" 
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#2C2416"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(44,36,22,0.6)"}
              >
                {l}
              </a>
            ))}
          </div>

          {/* Login Button */}
          <button onClick={() => router.push("/auth")}
            style={{ 
              background: "transparent", border: "1.5px solid rgba(44,36,22,0.25)", 
              color: "#2C2416", padding: "9px 24px", borderRadius: 100, 
              fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", 
              fontWeight: 600, cursor: "pointer", fontFamily: "'Jost', sans-serif", 
              transition: "all 0.3s ease" 
            }}
            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "#2C2416"; b.style.color = "#FDFAF5"; b.style.borderColor = "#2C2416"; }}
            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "transparent"; b.style.color = "#2C2416"; b.style.borderColor = "rgba(44,36,22,0.25)"; }}
          >
            Login
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <Image
            src="/images/hero.jpg"
            alt="Catering spread"
            fill
            style={{ objectFit: "cover", objectPosition: "center 30%" }}
            priority
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(253,250,245,0.15) 0%, rgba(253,250,245,0.1) 50%, rgba(253,250,245,0.8) 85%, rgba(253,250,245,1) 100%)"
          }} />
          {/* Fallback bg */}
          <div style={{
            position: "absolute", inset: 0, zIndex: -1,
            background: "linear-gradient(135deg, #F0E6CE 0%, #E8D8B8 50%, #DFC9A0 100%)"
          }} />
        </div>

        <div style={{ position: "relative", zIndex: 10, marginTop: "auto", padding: "0 60px 90px", maxWidth: 860 }}>
          <div className="anim-1" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 26 }}>
            <div style={{ height: 1, width: 48, background: "rgba(44,36,22,0.3)" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(44,36,22,0.45)", fontWeight: 500 }}>
              Premium Catering
            </span>
          </div>
          <h1 className="anim-2 font-display" style={{ fontSize: "clamp(3.5rem,7vw,7rem)", lineHeight: 0.95, fontWeight: 300, color: "#2C2416", marginBottom: 10 }}>
            Food crafted
          </h1>
          <h1 className="anim-3 font-display" style={{ fontSize: "clamp(3.5rem,7vw,7rem)", lineHeight: 0.95, fontWeight: 300, fontStyle: "italic", color: "#8B6914", marginBottom: 36 }}>
            with intention.
          </h1>
          <p className="anim-4" style={{ fontSize: 15, color: "rgba(44,36,22,0.58)", maxWidth: 420, lineHeight: 1.9, fontWeight: 300, marginBottom: 48 }}>
            From intimate dinners to grand celebrations — we bring warmth, flavour, and artistry to every table.
          </p>
          <div className="anim-4" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button
              onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                background: "#2C2416", color: "#FDFAF5", border: "none",
                padding: "16px 44px", borderRadius: 100, fontSize: 12,
                letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600,
                cursor: "pointer", fontFamily: "'Jost', sans-serif",
                boxShadow: "0 8px 30px rgba(44,36,22,0.22)", transition: "background 0.3s",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#8B6914"}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "#2C2416"}
            >
              Explore Our Menu
            </button>
            <button
              onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                background: "rgba(253,250,245,0.65)", border: "1.5px solid rgba(44,36,22,0.18)",
                color: "#2C2416", padding: "16px 44px", borderRadius: 100, fontSize: 12,
                letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600,
                cursor: "pointer", fontFamily: "'Jost', sans-serif",
                backdropFilter: "blur(8px)", transition: "all 0.3s ease",
              }}
            >
              Our Services
            </button>
          </div>
        </div>
      </section>

      {/* ── Tagline strip ── */}
      <div style={{
        background: "#2C2416", color: "rgba(253,250,245,0.45)", textAlign: "center",
        padding: "17px 20px", fontSize: 10, letterSpacing: "0.45em", textTransform: "uppercase", fontWeight: 500,
      }}>
        Weddings &nbsp;·&nbsp; Corporate Events &nbsp;·&nbsp; Private Dining &nbsp;·&nbsp; Celebrations &nbsp;·&nbsp; Bespoke Menus
      </div>

      {/* ── About ── */}
      <section id="about" style={{ padding: "110px 60px", maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ height: 1, width: 40, background: "rgba(139,105,20,0.45)" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(139,105,20,0.65)", fontWeight: 500 }}>Our Story</span>
          </div>
          <h2 className="font-display" style={{ fontSize: "clamp(2.5rem,4vw,4rem)", fontWeight: 300, lineHeight: 1.12, marginBottom: 28, color: "#2C2416" }}>
            Every meal tells<br /><em>a story worth</em><br />remembering.
          </h2>
          <p style={{ color: "rgba(44,36,22,0.58)", lineHeight: 1.9, fontWeight: 300, fontSize: 15, marginBottom: 18 }}>
            We believe that great food is more than sustenance — it's the centrepiece of every cherished memory. Our chefs source the finest seasonal ingredients to craft menus that are as beautiful as they are delicious.
          </p>
          <p style={{ color: "rgba(44,36,22,0.45)", lineHeight: 1.9, fontWeight: 300, fontSize: 15, marginBottom: 44 }}>
            With over a decade of experience, we've had the honour of serving at weddings, corporate events, and private celebrations across the country.
          </p>
          <div style={{ display: "flex", gap: 52 }}>
            {[["500+", "Events"], ["12+", "Years"], ["98%", "Satisfaction"]].map(([num, label]) => (
              <div key={label}>
                <div className="font-display" style={{ fontSize: 38, fontWeight: 300, color: "#8B6914" }}>{num}</div>
                <div style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(44,36,22,0.38)", marginTop: 5 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "relative", height: 560 }}>
          <div style={{ borderRadius: 4, overflow: "hidden", height: "100%", position: "relative", background: "#EDE0C8" }}>
            <Image src="/images/lp1.jpg" alt="Our catering team" fill
              style={{ objectFit: "cover" }} className="img-zoom"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
            <div style={{ position: "absolute", inset: 0, zIndex: -1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 96 }}>🌿</span>
            </div>
          </div>
          <div style={{
            position: "absolute", top: -18, right: -18, width: 130, height: 130,
            border: "1px solid rgba(139,105,20,0.25)", borderRadius: 4, zIndex: -1,
          }} />
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" style={{ background: "#F5EFE3", padding: "100px 60px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 20 }}>
              <div style={{ height: 1, width: 40, background: "rgba(139,105,20,0.35)" }} />
              <span style={{ fontSize: 11, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(139,105,20,0.55)", fontWeight: 500 }}>What We Do</span>
              <div style={{ height: 1, width: 40, background: "rgba(139,105,20,0.35)" }} />
            </div>
            <h2 className="font-display" style={{ fontSize: "clamp(2.5rem,4vw,3.5rem)", fontWeight: 300, color: "#2C2416" }}>Our Services</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              { img: "/images/service-wedding.jpg", icon: "", title: "Weddings", desc: "Bespoke menus for your most treasured day. From canapés to multi-course feasts, crafted with love." },
              { img: "/images/service-corporate.jpg", icon: "", title: "Corporate", desc: "Professional catering for conferences, team lunches, and business dinners that leave an impression." },
              { img: "/images/service-private.jpg", icon: "", title: "Private Dining", desc: "An intimate restaurant experience in the comfort of your home. Our chefs come to you." },
            ].map(({ img, icon, title, desc }) => (
              <div key={title} className="card-lift" style={{ background: "#FDFAF5", borderRadius: 4, overflow: "hidden", cursor: "default" }}>
                <div style={{ position: "relative", height: 260, overflow: "hidden", background: "#EDE0C8" }}>
                  <Image src={img} alt={title} fill style={{ objectFit: "cover" }} className="img-zoom"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                  <div style={{ position: "absolute", inset: 0, zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(237,224,200,0.25)" }}>
                    <span style={{ fontSize: 64, opacity: 0.5 }}>{icon}</span>
                  </div>
                </div>
                <div style={{ padding: "30px 30px 34px" }}>
                  <h3 className="font-display" style={{ fontSize: 26, fontWeight: 400, marginBottom: 12, color: "#2C2416" }}>{title}</h3>
                  <p style={{ fontSize: 14, color: "rgba(44,36,22,0.52)", lineHeight: 1.8, fontWeight: 300 }}>{desc}</p>
                  <div style={{ marginTop: 22, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B6914", fontWeight: 600, cursor: "pointer" }}
                    onClick={() => router.push("/auth")}>Learn More →</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section id="gallery" style={{ padding: "100px 60px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 20 }}>
            <div style={{ height: 1, width: 40, background: "rgba(139,105,20,0.35)" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(139,105,20,0.55)", fontWeight: 500 }}>The Experience</span>
            <div style={{ height: 1, width: 40, background: "rgba(139,105,20,0.35)" }} />
          </div>
          <h2 className="font-display" style={{ fontSize: "clamp(2.5rem,4vw,3.5rem)", fontWeight: 300, color: "#2C2416" }}>A feast for the eyes</h2>
        </div>
        {/* Asymmetric grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gridTemplateRows: "300px 300px", gap: 10 }}>
          <div style={{ gridRow: "span 2", borderRadius: 4, overflow: "hidden", position: "relative", background: "#EDE0C8" }}>
            <Image src="/images/gallery-1.jpg" alt="Gallery" fill style={{ objectFit: "cover" }} className="img-zoom"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
            <div style={{ position: "absolute", inset: 0, zIndex: -1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 80, opacity: 0.35 }}>🥗</span>
            </div>
          </div>
          {[
            { src: "/images/gallery-2.jpg", icon: "🍰" },
            { src: "/images/gallery-3.jpg", icon: "🌸" },
            { src: "/images/gallery-4.jpg", icon: "🍷" },
            { src: "/images/gallery-5.jpg", icon: "🥂" },
          ].map(({ src, icon }, i) => (
            <div key={i} style={{ borderRadius: 4, overflow: "hidden", position: "relative", background: "#EDE0C8" }}>
              <Image src={src} alt="Gallery" fill style={{ objectFit: "cover" }} className="img-zoom"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
              <div style={{ position: "absolute", inset: 0, zIndex: -1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 48, opacity: 0.35 }}>{icon}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Menu (Real DB Data) ── */}
      <section id="menu" style={{ background: "#2C2416", padding: "100px 60px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 60, flexWrap: "wrap", gap: 24 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <div style={{ height: 1, width: 40, background: "rgba(253,250,245,0.15)" }} />
                <span style={{ fontSize: 11, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(253,250,245,0.35)", fontWeight: 500 }}>Taste the Difference</span>
              </div>
              <h2 className="font-display" style={{ fontSize: "clamp(2.5rem,4vw,3.5rem)", fontWeight: 300, color: "#FDFAF5" }}>Featured Menu</h2>
            </div>
            <button
              onClick={() => router.push("/auth")}
              style={{
                background: "transparent", border: "1.5px solid rgba(253,250,245,0.25)",
                color: "rgba(253,250,245,0.65)", padding: "12px 32px", borderRadius: 100,
                fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600,
                cursor: "pointer", fontFamily: "'Jost', sans-serif", transition: "all 0.3s ease",
              }}
              onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "#8B6914"; b.style.borderColor = "#8B6914"; b.style.color = "#FDFAF5"; }}
              onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "transparent"; b.style.borderColor = "rgba(253,250,245,0.25)"; b.style.color = "rgba(253,250,245,0.65)"; }}
            >
              View Full Menu
            </button>
          </div>
          
          {loadingMenu ? (
            <div style={{ color: "rgba(253,250,245,0.5)", textAlign: "center", padding: "40px" }}>Loading featured dishes...</div>
          ) : featuredMenu.length === 0 ? (
            <div style={{ color: "rgba(253,250,245,0.5)", textAlign: "center", padding: "40px" }}>No menu items available at the moment.</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
              {featuredMenu.map((item) => (
                <div key={item.id} className="card-lift" style={{ background: "rgba(253,250,245,0.04)", borderRadius: 4, overflow: "hidden", border: "1px solid rgba(253,250,245,0.07)" }}>
                  <div style={{ position: "relative", height: 190, background: "rgba(139,105,20,0.15)", overflow: "hidden" }}>
                    <Image 
                      src={`/images/menu/${item.name.toLowerCase().replace(/\s+/g, '-')}.jpg`} 
                      alt={item.name} fill style={{ objectFit: "cover" }} className="img-zoom"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} 
                    />
                    <div style={{ position: "absolute", inset: 0, zIndex: -1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 56, opacity: 0.4 }}>🍽️</span>
                    </div>
                  </div>
                  <div style={{ padding: "22px 22px 26px" }}>
                    <span style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "#8B6914", fontWeight: 600 }}>{item.category}</span>
                    <h4 className="font-display" style={{ fontSize: 21, fontWeight: 400, color: "#FDFAF5", margin: "8px 0 16px" }}>{item.name}</h4>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "rgba(253,250,245,0.45)", fontSize: 13, fontWeight: 300 }}>Rs {Number(item.price).toLocaleString()}</span>
                      <button
                        onClick={() => router.push("/auth")}
                        style={{
                          background: "#8B6914", color: "#FDFAF5", border: "none",
                          padding: "7px 18px", borderRadius: 100, fontSize: 10,
                          letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600,
                          cursor: "pointer", fontFamily: "'Jost', sans-serif", transition: "background 0.3s",
                        }}
                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#A07820"}
                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "#8B6914"}
                      >Order</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "#F5EFE3", padding: "120px 60px" }}>
        <div style={{ maxWidth: 660, margin: "0 auto", textAlign: "center" }}>
          <div className="font-display" style={{ fontSize: 13, letterSpacing: "0.3em", textTransform: "uppercase", color: "#8B6914", marginBottom: 24, fontStyle: "italic" }}>
            Ready to plan your event?
          </div>
          <h2 className="font-display" style={{ fontSize: "clamp(2.5rem,5vw,4.5rem)", fontWeight: 300, color: "#2C2416", lineHeight: 1.12, marginBottom: 32 }}>
            Let's create something <em>unforgettable</em> together.
          </h2>
          <p style={{ color: "rgba(44,36,22,0.52)", lineHeight: 1.9, fontWeight: 300, fontSize: 15, marginBottom: 48, maxWidth: 460, margin: "0 auto 48px" }}>
            Browse our full menu, customise your order, and let us handle every detail — so you can focus on celebrating.
          </p>
          <button
            onClick={() => router.push("/auth")}
            style={{
              background: "#2C2416", color: "#FDFAF5", border: "none",
              padding: "18px 56px", borderRadius: 100, fontSize: 12,
              letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 600,
              cursor: "pointer", fontFamily: "'Jost', sans-serif",
              boxShadow: "0 12px 40px rgba(44,36,22,0.18)", transition: "background 0.3s",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#8B6914"}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "#2C2416"}
          >
            Get Started
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "#1A140D", color: "rgba(253,250,245,0.45)", padding: "44px 60px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <span className="font-display" style={{ fontSize: 24, color: "rgba(253,250,245,0.75)", fontWeight: 300, letterSpacing: 2 }}>tiramisu.</span>
          <span style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase" }}>
            © {new Date().getFullYear()} tiramisu catering
          </span>
          <div style={{ display: "flex", gap: 28, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase" }}>
            {["services", "menu", "gallery"].map(l => (
              <a key={l} href={`#${l}`} style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "#8B6914"}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "rgba(253,250,245,0.45)"}
              >{l}</a>
            ))}
            <button onClick={() => router.push("/auth")}
              style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: "inherit", letterSpacing: "inherit", fontFamily: "'Jost', sans-serif", padding: 0, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#8B6914"}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "rgba(253,250,245,0.45)"}
            >Login</button>
          </div>
        </div>
      </footer>
    </div>
  );
}