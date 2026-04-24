"use client";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { name: "Dashboard", path: "/admin" },
    { name: "Analytics", path: "/admin/analytics" },
    { name: "Menu Catalog", path: "/admin/menu" } // Links to the public menu you just made!
  ];

  return (
    <div style={{ backgroundColor: "#FDFAF5", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Jost', sans-serif", color: "#2C2416" }}>
      
      {/* ── Admin Navigation Header ── */}
      <header style={{
        background: "rgba(253,250,245,0.96)", backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(44,36,22,0.07)",
        position: "sticky", top: 0, zIndex: 40,
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
             <span className="font-display" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, letterSpacing: 2, color: "#2C2416", fontWeight: 600 }}>tiramisu.</span>
             <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B6914", fontWeight: 700, background: "rgba(139,105,20,0.1)", padding: "4px 8px", borderRadius: 4 }}>Admin</span>
          </div>

          {/* 3 Tabs */}
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {tabs.map(tab => {
              const isActive = pathname === tab.path;
              return (
                <button key={tab.name} onClick={() => router.push(tab.path)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#8B6914" : "rgba(44,36,22,0.5)",
                    fontFamily: "'Jost', sans-serif", transition: "all 0.2s ease",
                    borderBottom: isActive ? "2px solid #8B6914" : "2px solid transparent",
                    paddingBottom: 4
                  }}
                  onMouseEnter={e => { if(!isActive) e.currentTarget.style.color = "#2C2416" }}
                  onMouseLeave={e => { if(!isActive) e.currentTarget.style.color = "rgba(44,36,22,0.5)" }}
                >
                  {tab.name}
                </button>
              );
            })}
          </div>

          <button onClick={() => router.push("/auth")}
            style={{ background: "transparent", border: "1.5px solid rgba(44,36,22,0.25)", color: "#2C2416", padding: "9px 24px", borderRadius: 100, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer", fontFamily: "'Jost', sans-serif", transition: "all 0.3s ease" }}
            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "#2C2416"; b.style.color = "#FDFAF5"; }}
            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "transparent"; b.style.color = "#2C2416"; }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* ── Page Content Injected Here ── */}
      {children}
    </div>
  );
}