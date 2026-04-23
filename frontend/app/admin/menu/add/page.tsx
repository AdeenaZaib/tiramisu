"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CUISINES = ["Pakistani", "Italian", "Chinese", "Continental", "Arabic", "Other"];
const ITEM_TYPES = ["Starter", "Main", "Dessert", "Beverage", "Side", "Special"];

const ITEM_TYPE_ICONS: Record<string, string> = {
  Starter:  "",
  Main:     "",
  Dessert:  "",
  Beverage: "",
  Side:     "",
  Special:  "",
};

export default function AddDishPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    itemType: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8080/api/menu/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: parseFloat(form.price) }),
      });
      if (!res.ok) throw new Error("Failed to add menu item");
      setSuccess(true);
      setForm({ name: "", description: "", price: "", category: "", itemType: "" });
      setTimeout(() => setSuccess(false), 3500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  };

  const isComplete = form.name && form.price && form.category && form.itemType;

  return (
    <div style={{ background: "#FDFAF5", minHeight: "100vh", fontFamily: "'Jost', sans-serif", color: "#2C2416" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Cormorant Garamond', serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-1 { animation: fadeUp 0.7s ease forwards; opacity: 0; }
        .anim-2 { animation: fadeUp 0.7s 0.1s ease forwards; opacity: 0; }

        @keyframes popIn {
          from { opacity: 0; transform: scale(0.94) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .pop-in { animation: popIn 0.4s cubic-bezier(.34,1.56,.64,1) forwards; }

        .field-label {
          display: block;
          font-size: 9px;
          letter-spacing: 0.38em;
          text-transform: uppercase;
          color: rgba(44,36,22,0.4);
          font-weight: 600;
          margin-bottom: 7px;
        }
        .field-input {
          width: 100%;
          background: #FDFAF5;
          border: 1.5px solid rgba(44,36,22,0.13);
          border-radius: 3px;
          padding: 11px 14px;
          font-size: 14px;
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          color: #2C2416;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s;
          box-sizing: border-box;
        }
        .field-input:focus {
          border-color: #8B6914;
          box-shadow: 0 0 0 3px rgba(139,105,20,0.08);
        }
        .field-input::placeholder { color: rgba(44,36,22,0.25); }

        .type-pill {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 10px 16px;
          border-radius: 100px;
          border: 1.5px solid rgba(44,36,22,0.13);
          background: transparent;
          cursor: pointer;
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          color: rgba(44,36,22,0.45);
          text-transform: uppercase;
          transition: all 0.22s ease;
          white-space: nowrap;
        }
        .type-pill:hover { border-color: rgba(44,36,22,0.3); color: #2C2416; }
        .type-pill.selected { background: #2C2416; border-color: #2C2416; color: #FDFAF5; }

        .submit-btn {
          width: 100%;
          background: #2C2416;
          color: #FDFAF5;
          border: none;
          padding: 16px;
          border-radius: 100px;
          font-size: 11px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Jost', sans-serif;
          transition: background 0.3s ease;
          box-shadow: 0 8px 28px rgba(44,36,22,0.16);
        }
        .submit-btn:hover:not(:disabled) { background: #8B6914; }
        .submit-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        .success-bar {
          background: rgba(60,110,60,0.08);
          border: 1px solid rgba(60,110,60,0.22);
          color: #3A6E3A;
          padding: 13px 18px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.03em;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .error-bar {
          background: rgba(180,50,30,0.06);
          border: 1px solid rgba(180,50,30,0.18);
          color: #B4321E;
          padding: 13px 18px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 300;
        }
        .cuisine-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(44,36,22,0.3)'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
        }
      `}</style>

      {/* ── Header ── */}
      <header style={{
        background: "rgba(253,250,245,0.96)", backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(44,36,22,0.07)",
        position: "sticky", top: 0, zIndex: 40,
      }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 32px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button
            onClick={() => router.push("/admin/menu")}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, color: "rgba(44,36,22,0.45)", fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500, padding: 0, transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#2C2416"}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "rgba(44,36,22,0.45)"}
          >← Menu</button>

          <span className="font-display" style={{ fontSize: 26, letterSpacing: 2, color: "#2C2416", fontWeight: 400, cursor: "pointer" }} onClick={() => router.push("/admin/dashboard")}>
            tiramisu.
          </span>

          <span style={{ fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(44,36,22,0.3)", fontWeight: 600 }}>Admin</span>
        </div>
      </header>

      {/* ── Centered layout ── */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 32px 100px" }}>

        {/* Heading above card */}
        <div className="anim-1" style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div style={{ height: 1, width: 36, background: "rgba(139,105,20,0.4)" }} />
            <span style={{ fontSize: 10, letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(139,105,20,0.65)", fontWeight: 600 }}>Menu Management</span>
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2.6rem,5vw,4rem)", fontWeight: 300, color: "#2C2416", lineHeight: 1.05 }}>
            Add a new <em style={{ color: "#8B6914" }}>dish.</em>
          </h1>
        </div>

        {/* Wide form card */}
        <div className="anim-2" style={{
          background: "#fff",
          border: "1px solid rgba(44,36,22,0.07)",
          borderRadius: 6,
          padding: "44px 52px",
          boxShadow: "0 20px 60px rgba(44,36,22,0.07)",
        }}>

          {success && (
            <div className="success-bar pop-in" style={{ marginBottom: 28 }}>
              <span style={{ fontSize: 16 }}>✓</span>
              Dish added to menu successfully.
            </div>
          )}
          {error && (
            <div className="error-bar" style={{ marginBottom: 28 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

              {/* Name */}
              <div>
                <label className="field-label">Dish Name *</label>
                <input
                  className="field-input"
                  placeholder="e.g. Lamb Biryani"
                  value={form.name}
                  onChange={e => set("name", e.target.value)}
                  required
                />
              </div>

              {/* Price + Cuisine side by side */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                <div>
                  <label className="field-label">Price (Rs) *</label>
                  <input
                    className="field-input"
                    type="number" min={0} step={0.01}
                    placeholder="0.00"
                    value={form.price}
                    onChange={e => set("price", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="field-label">Cuisine *</label>
                  <select
                    className="field-input cuisine-select"
                    value={form.category}
                    onChange={e => set("category", e.target.value)}
                    required
                  >
                    <option value="">Select</option>
                    {CUISINES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Item Type pill selector */}
              <div>
                <label className="field-label">Item Type *</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                  {ITEM_TYPES.map(t => (
                    <button
                      key={t} type="button"
                      className={`type-pill${form.itemType === t ? " selected" : ""}`}
                      onClick={() => set("itemType", t)}
                    >
                      <span style={{ fontSize: 13 }}>{ITEM_TYPE_ICONS[t]}</span>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="field-label">Description</label>
                <textarea
                  className="field-input"
                  rows={3}
                  placeholder="A short, appetising description of the dish…"
                  style={{ resize: "none" }}
                  value={form.description}
                  onChange={e => set("description", e.target.value)}
                />
              </div>

              {/* Live preview strip */}
              {(form.name || form.price || form.itemType) && (
                <div className="pop-in" style={{
                  background: "#F5EFE3",
                  borderRadius: 4,
                  padding: "16px 20px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  gap: 12,
                }}>
                  <div>
                    <div style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(44,36,22,0.35)", fontWeight: 600, marginBottom: 4 }}>Preview</div>
                    <div className="font-display" style={{ fontSize: 20, fontWeight: 400, color: "#2C2416" }}>
                      {form.name || "Dish name"}
                    </div>
                    {form.itemType && (
                      <div style={{ fontSize: 10, color: "#8B6914", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, marginTop: 3 }}>
                        {ITEM_TYPE_ICONS[form.itemType]} {form.itemType}
                        {form.category ? ` · ${form.category}` : ""}
                      </div>
                    )}
                  </div>
                  {form.price && (
                    <div className="font-display" style={{ fontSize: 24, fontWeight: 300, color: "#2C2416" }}>
                      Rs {parseFloat(form.price).toLocaleString()}
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 4 }}>
                <button className="submit-btn" type="submit" disabled={submitting || !isComplete}>
                  {submitting ? "Adding dish…" : "Add to Menu"}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/admin/menu")}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "rgba(44,36,22,0.35)", fontSize: 11, letterSpacing: "0.2em",
                    textTransform: "uppercase", fontWeight: 500, fontFamily: "'Jost', sans-serif",
                    textAlign: "center", padding: "4px 0", transition: "color 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#2C2416"}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "rgba(44,36,22,0.35)"}
                >
                  Cancel — back to menu
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer style={{ background: "#1A140D", color: "rgba(253,250,245,0.35)", padding: "36px 60px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="font-display" style={{ fontSize: 20, color: "rgba(253,250,245,0.6)", fontWeight: 300, letterSpacing: 2 }}>tiramisu.</span>
          <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" }}>Admin Console · {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}