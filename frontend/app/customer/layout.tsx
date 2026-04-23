import Link from "next/link";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: "#FDFAF5", minHeight: "100vh" }}>
      {/* ── Global La Tavola Navigation ── */}
      <nav style={{ 
        background: "rgba(253,250,245,0.96)", 
        backdropFilter: "blur(14px)", 
        borderBottom: "1px solid rgba(44,36,22,0.07)", 
        padding: "20px 48px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        position: "sticky", 
        top: 0, 
        zIndex: 50, 
        fontFamily: "'Jost', sans-serif" 
      }}>
        
        {/* Brand Logo */}
        <Link href="/" style={{ textDecoration: "none", color: "#2C2416" }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, letterSpacing: 2 }}>
            tiramisu.
          </span>
        </Link>

        {/* Navigation Links */}
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          <Link href="/customer/menu" style={{ textDecoration: "none", color: "#2C2416", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>
            Menu Catalog
          </Link>
          <Link href="/customer/events" style={{ textDecoration: "none", color: "#8B6914", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>
            My Events
          </Link>
          <Link href="/customer/orders" style={{ textDecoration: "none", color: "#2C2416", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>
            Confirmed Bookings
          </Link>
        </div>
      </nav>

      {/* ── Page Content ── */}
      {children}
    </div>
  );
}