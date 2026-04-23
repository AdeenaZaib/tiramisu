"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });

  useEffect(() => {
    setVisible(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const url = isLogin
      ? "http://localhost:8080/api/auth/login"
      : "http://localhost:8080/api/auth/signup";
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isLogin
            ? { email: form.email, password: form.password }
            : { fullName: form.fullName, email: form.email, password: form.password, role: "Customer" }
        ),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Authentication failed");
      }
      const userData = await res.json();
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("role", userData.role);
      if (userData.role === "Manager") {
        router.push("/admin/dashboard");
      } else {
        router.push("/customer/menu");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FDFAF5",
        color: "#2C2416",
        fontFamily: "'Jost', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Cormorant Garamond', serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-1 { animation: fadeUp 0.8s ease forwards; opacity: 0; }
        .anim-2 { animation: fadeUp 0.8s 0.12s ease forwards; opacity: 0; }
        .anim-3 { animation: fadeUp 0.8s 0.24s ease forwards; opacity: 0; }
        .anim-4 { animation: fadeUp 0.8s 0.36s ease forwards; opacity: 0; }
        .anim-5 { animation: fadeUp 0.8s 0.48s ease forwards; opacity: 0; }

        .auth-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1.5px solid rgba(44,36,22,0.18);
          padding: 10px 0;
          font-size: 14px;
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          color: #2C2416;
          outline: none;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
        }
        .auth-input:focus {
          border-bottom-color: #8B6914;
        }
        .auth-input::placeholder {
          color: rgba(44,36,22,0.3);
        }
        .tab-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          font-weight: 600;
          padding: 12px 0;
          transition: color 0.3s ease;
          position: relative;
        }
        .tab-btn::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1.5px;
          background: #8B6914;
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }
        .tab-btn.active::after {
          transform: scaleX(1);
        }
        .submit-btn {
          width: 100%;
          background: #2C2416;
          color: #FDFAF5;
          border: none;
          padding: 16px;
          border-radius: 100px;
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Jost', sans-serif;
          transition: background 0.3s ease;
          margin-top: 8px;
        }
        .submit-btn:hover:not(:disabled) { background: #8B6914; }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(44,36,22,0.4);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          font-family: 'Jost', sans-serif;
        }
        .back-link:hover { color: #2C2416; }

        .divider-line {
          height: 1px;
          background: rgba(44,36,22,0.1);
          flex: 1;
        }
      `}</style>

      {/* Top nav bar */}
      <nav style={{
        padding: "0 48px",
        height: 76,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(44,36,22,0.07)",
      }}>
        <button className="back-link" onClick={() => router.push("/")}>
          <span style={{ fontSize: 14 }}>←</span> Back
        </button>
        <span
          className="font-display"
          style={{ fontSize: 26, letterSpacing: 2, color: "#2C2416", fontWeight: 400, cursor: "pointer" }}
          onClick={() => router.push("/")}
        >
          tiramisu.
        </span>
        <div style={{ width: 60 }} /> {/* spacer */}
      </nav>

      {/* Main layout: left panel + right form */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "calc(100vh - 76px)" }}>

        {/* Left decorative panel */}
        <div style={{
          background: "#2C2416",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "60px 64px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Subtle decorative elements */}
          <div style={{
            position: "absolute", top: 60, right: 60,
            width: 180, height: 180,
            border: "1px solid rgba(253,250,245,0.06)",
            borderRadius: "50%",
          }} />
          <div style={{
            position: "absolute", top: 30, right: 30,
            width: 240, height: 240,
            border: "1px solid rgba(253,250,245,0.04)",
            borderRadius: "50%",
          }} />
          <div style={{
            position: "absolute", top: -20, left: "30%",
            width: 1, height: "45%",
            background: "rgba(253,250,245,0.05)",
          }} />

          {/* Tagline strip at top */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0,
            background: "#8B6914",
            padding: "10px 20px",
            fontSize: 9,
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            color: "rgba(253,250,245,0.7)",
            textAlign: "center",
            fontWeight: 500,
          }}>
            Weddings &nbsp;·&nbsp; Corporate &nbsp;·&nbsp; Private Dining &nbsp;·&nbsp; Celebrations
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
              <div style={{ height: 1, width: 36, background: "rgba(253,250,245,0.2)" }} />
              <span style={{ fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(253,250,245,0.35)", fontWeight: 500 }}>
                Premium Catering
              </span>
            </div>
            <h2
              className="font-display"
              style={{ fontSize: "clamp(2.2rem,3.5vw,3.5rem)", fontWeight: 300, color: "#FDFAF5", lineHeight: 1.05, marginBottom: 10 }}
            >
              Every detail,
            </h2>
            <h2
              className="font-display"
              style={{ fontSize: "clamp(2.2rem,3.5vw,3.5rem)", fontWeight: 300, fontStyle: "italic", color: "#8B6914", lineHeight: 1.05, marginBottom: 32 }}
            >
              perfected.
            </h2>
            <p style={{ color: "rgba(253,250,245,0.4)", fontSize: 14, lineHeight: 1.9, fontWeight: 300, maxWidth: 340, marginBottom: 52 }}>
              Join us to explore our curated menus, place orders, and let us craft an unforgettable experience for your next event.
            </p>
            {/* Stats */}
            <div style={{ display: "flex", gap: 44 }}>
              {[["500+", "Events"], ["12+", "Years"], ["98%", "Satisfaction"]].map(([num, label]) => (
                <div key={label}>
                  <div className="font-display" style={{ fontSize: 32, fontWeight: 300, color: "#FDFAF5" }}>{num}</div>
                  <div style={{ fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(253,250,245,0.28)", marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom decorative border detail */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: 3,
            background: "linear-gradient(to right, transparent, #8B6914, transparent)",
          }} />
        </div>

        {/* Right form panel */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 80px",
          background: "#FDFAF5",
        }}>
          <div style={{ width: "100%", maxWidth: 380 }}>

            {/* Tab switcher */}
            <div className="anim-1" style={{ display: "flex", gap: 32, marginBottom: 48, borderBottom: "1px solid rgba(44,36,22,0.1)" }}>
              {["Login", "Sign Up"].map((tab) => {
                const active = (tab === "Login") === isLogin;
                return (
                  <button
                    key={tab}
                    className={`tab-btn ${active ? "active" : ""}`}
                    style={{ color: active ? "#2C2416" : "rgba(44,36,22,0.35)" }}
                    onClick={() => { setIsLogin(tab === "Login"); setError(""); }}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Heading */}
            <div className="anim-2" style={{ marginBottom: 40 }}>
              <h1
                className="font-display"
                style={{ fontSize: "clamp(2rem,3vw,2.8rem)", fontWeight: 300, color: "#2C2416", lineHeight: 1.1, marginBottom: 10 }}
              >
                {isLogin ? (
                  <>Welcome<br /><em style={{ color: "#8B6914" }}>back.</em></>
                ) : (
                  <>Create your<br /><em style={{ color: "#8B6914" }}>account.</em></>
                )}
              </h1>
              <p style={{ fontSize: 13, color: "rgba(44,36,22,0.42)", fontWeight: 300, lineHeight: 1.7, marginTop: 14 }}>
                {isLogin
                  ? "Sign in to browse our menus and manage your orders."
                  : "Join us and start planning your next memorable event."}
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div style={{
                background: "rgba(139,60,20,0.07)",
                border: "1px solid rgba(139,60,20,0.18)",
                color: "#8B3C14",
                padding: "12px 16px",
                borderRadius: 4,
                fontSize: 13,
                fontWeight: 300,
                marginBottom: 24,
                letterSpacing: "0.01em",
              }}>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

                {!isLogin && (
                  <div className="anim-3">
                    <label style={{ display: "block", fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(44,36,22,0.38)", fontWeight: 600, marginBottom: 8 }}>
                      Full Name
                    </label>
                    <input
                      className="auth-input"
                      type="text"
                      name="fullName"
                      placeholder="Your full name"
                      value={form.fullName}
                      onChange={handleChange}
                      required={!isLogin}
                    />
                  </div>
                )}

                <div className={isLogin ? "anim-3" : "anim-4"}>
                  <label style={{ display: "block", fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(44,36,22,0.38)", fontWeight: 600, marginBottom: 8 }}>
                    Email Address
                  </label>
                  <input
                    className="auth-input"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={isLogin ? "anim-4" : "anim-5"}>
                  <label style={{ display: "block", fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(44,36,22,0.38)", fontWeight: 600, marginBottom: 8 }}>
                    Password
                  </label>
                  <input
                    className="auth-input"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="anim-5">
                  <button className="submit-btn" type="submit" disabled={loading}>
                    {loading ? "Please wait…" : isLogin ? "Sign In" : "Create Account"}
                  </button>
                </div>
              </div>
            </form>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "36px 0" }}>
              <div className="divider-line" />
              <span style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(44,36,22,0.25)", fontWeight: 500, whiteSpace: "nowrap" }}>
                or
              </span>
              <div className="divider-line" />
            </div>

            {/* Toggle */}
            <p style={{ textAlign: "center", fontSize: 13, color: "rgba(44,36,22,0.45)", fontWeight: 300 }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => { setIsLogin(!isLogin); setError(""); }}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#8B6914", fontWeight: 600, fontSize: 13,
                  fontFamily: "'Jost', sans-serif", padding: 0,
                  textDecoration: "underline", textUnderlineOffset: 3,
                }}
              >
                {isLogin ? "Sign Up" : "Log In"}
              </button>
            </p>

            {/* Fine print for signup */}
            {!isLogin && (
              <p style={{ textAlign: "center", fontSize: 11, color: "rgba(44,36,22,0.28)", fontWeight: 300, marginTop: 20, lineHeight: 1.7 }}>
                By signing up, you'll be registered as a customer and can start browsing our curated menus right away.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}