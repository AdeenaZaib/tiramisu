"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  itemType: string;
};

type EditForm = Omit<MenuItem, "id">;

const CUISINES = ["Pakistani", "Italian", "Chinese", "Continental", "Arabic", "Other"];
const ITEM_TYPES = ["Starter", "Main", "Dessert", "Beverage", "Side", "Special"];

const ITEM_TYPE_STYLE: Record<string, { bg: string; color: string }> = {
  Starter:  { bg: "rgba(139,105,20,0.10)", color: "#8B6914" },
  Main:     { bg: "rgba(44,36,22,0.08)",   color: "#2C2416" },
  Dessert:  { bg: "rgba(180,100,60,0.10)", color: "#B4643C" },
  Beverage: { bg: "rgba(60,100,140,0.10)", color: "#3C648C" },
  Side:     { bg: "rgba(80,120,60,0.10)",  color: "#507830" },
  Special:  { bg: "rgba(120,50,120,0.10)", color: "#783278" },
};

export default function AdminMenuPage() {
  const router = useRouter();

  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCuisine, setActiveCuisine] = useState("All");
  const [cuisines, setCuisines] = useState<string[]>(["All"]);

  // Inline edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ name: "", description: "", price: 0, category: "", itemType: "" });
  const [saving, setSaving] = useState(false);

  // Add-new state
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState<EditForm>({ name: "", description: "", price: 0, category: "", itemType: "" });
  const [adding, setAdding] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = () => {
    setLoading(true);
    fetch("http://localhost:8080/api/menu/all")
      .then(res => { if (!res.ok) throw new Error("Failed to fetch"); return res.json(); })
      .then((data: MenuItem[]) => {
        setItems(data);
        const unique = Array.from(new Set(data.map(i => i.category).filter(Boolean)));
        setCuisines(["All", ...unique]);
        setLoading(false);
      })
      .catch(err => { setError(err.message); setLoading(false); });
  };

  const flash = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const startEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setEditForm({ name: item.name, description: item.description, price: item.price, category: item.category, itemType: item.itemType });
    setShowAdd(false);
  };

  const cancelEdit = () => { setEditingId(null); };

  const saveEdit = async (id: number) => {
    setError("");
  
    // ✅ VALIDATION FIRST
    if (!editForm.name.trim()) {
      setError("Dish name is required");
      return;
    }
  
    if (!editForm.category) {
      setError("Cuisine is required");
      return;
    }
  
    if (!editForm.itemType) {
      setError("Item type is required");
      return;
    }
  
    if (!editForm.price || editForm.price <= 0) {
      setError("Price must be greater than 0");
      return;
    }
  
    setSaving(true);
  
    try {
      const res = await fetch(`http://localhost:8080/api/menu/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editForm }),
      });
  
      if (!res.ok) throw new Error("Failed to update");
  
      setItems(prev =>
        prev.map(i => (i.id === id ? { id, ...editForm } : i))
      );
  
      setEditingId(null);
      flash("Dish updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/menu/delete/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setItems(prev => prev.filter(i => i.id !== id));
      setDeleteConfirm(null);
      flash("Dish removed from menu.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const addItem = async () => {
    setAdding(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8080/api/menu/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      if (!res.ok) throw new Error("Failed to add item");
      const newItem: MenuItem = await res.json();
      setItems(prev => [...prev, newItem]);
      setAddForm({ name: "", description: "", price: 0, category: "", itemType: "" });
      setShowAdd(false);
      flash("New dish added to menu.");
      if (!cuisines.includes(newItem.category)) {
        setCuisines(prev => [...prev, newItem.category]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setAdding(false);
    }
  };

  const filtered = activeCuisine === "All" ? items : items.filter(i => i.category === activeCuisine);

  const typeStyle = (t: string) => ITEM_TYPE_STYLE[t] || { bg: "rgba(44,36,22,0.07)", color: "rgba(44,36,22,0.5)" };

  return (
    <div style={{ background: "#FDFAF5", minHeight: "100vh", fontFamily: "'Jost', sans-serif", color: "#2C2416" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Cormorant Garamond', serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.45s ease forwards; }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .slide-down { animation: slideDown 0.35s ease forwards; }

        .cuisine-tab {
          border: 1.5px solid rgba(44,36,22,0.15);
          background: transparent;
          color: rgba(44,36,22,0.5);
          padding: 9px 20px;
          border-radius: 100px;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 500;
          cursor: pointer;
          font-family: 'Jost', sans-serif;
          transition: all 0.25s ease;
          white-space: nowrap;
        }
        .cuisine-tab:hover { border-color: rgba(44,36,22,0.35); color: rgba(44,36,22,0.8); }
        .cuisine-tab.active { background: #2C2416; border-color: #2C2416; color: #FDFAF5; }

        .menu-card {
          background: #fff;
          border-radius: 4px;
          border: 1px solid rgba(44,36,22,0.07);
          overflow: hidden;
          transition: box-shadow 0.35s ease, transform 0.35s ease;
        }
        .menu-card:not(.editing):hover {
          box-shadow: 0 14px 44px rgba(44,36,22,0.09);
          transform: translateY(-2px);
        }
        .menu-card.editing {
          border: 1.5px solid #8B6914;
          box-shadow: 0 0 0 3px rgba(139,105,20,0.08);
        }

        .field-input {
          width: 100%;
          background: #FDFAF5;
          border: 1.5px solid rgba(44,36,22,0.13);
          border-radius: 3px;
          padding: 8px 12px;
          font-size: 13px;
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          color: #2C2416;
          outline: none;
          transition: border-color 0.25s;
          box-sizing: border-box;
        }
        .field-input:focus { border-color: #8B6914; }

        .field-label {
          display: block;
          font-size: 9px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(44,36,22,0.38);
          font-weight: 600;
          margin-bottom: 5px;
        }

        .btn-save {
          background: #2C2416; color: #FDFAF5; border: none;
          padding: 9px 22px; border-radius: 100px;
          font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          font-weight: 600; cursor: pointer; font-family: 'Jost', sans-serif;
          transition: background 0.25s;
        }
        .btn-save:hover:not(:disabled) { background: #8B6914; }
        .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }

        .btn-cancel {
          background: transparent; color: rgba(44,36,22,0.45);
          border: 1.5px solid rgba(44,36,22,0.15);
          padding: 9px 22px; border-radius: 100px;
          font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          font-weight: 600; cursor: pointer; font-family: 'Jost', sans-serif;
          transition: all 0.25s;
        }
        .btn-cancel:hover { border-color: rgba(44,36,22,0.35); color: #2C2416; }

        .btn-edit {
          background: transparent; color: rgba(44,36,22,0.4);
          border: 1.5px solid rgba(44,36,22,0.12);
          padding: 7px 16px; border-radius: 100px;
          font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase;
          font-weight: 600; cursor: pointer; font-family: 'Jost', sans-serif;
          transition: all 0.25s;
        }
        .btn-edit:hover { background: #2C2416; color: #FDFAF5; border-color: #2C2416; }

        .btn-delete {
          background: transparent; color: rgba(180,50,30,0.5);
          border: 1.5px solid rgba(180,50,30,0.15);
          padding: 7px 16px; border-radius: 100px;
          font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase;
          font-weight: 600; cursor: pointer; font-family: 'Jost', sans-serif;
          transition: all 0.25s;
        }
        .btn-delete:hover { background: rgba(180,50,30,0.08); border-color: rgba(180,50,30,0.35); color: #B4321E; }

        .btn-confirm-delete {
          background: #B4321E; color: #fff; border: none;
          padding: 7px 18px; border-radius: 100px;
          font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase;
          font-weight: 600; cursor: pointer; font-family: 'Jost', sans-serif;
          transition: background 0.25s;
        }
        .btn-confirm-delete:hover { background: #8B2415; }

        .add-panel {
          background: #fff;
          border: 1.5px solid rgba(139,105,20,0.3);
          border-radius: 4px;
          padding: 32px;
          margin-bottom: 32px;
          box-shadow: 0 8px 30px rgba(44,36,22,0.07);
        }

        .toast {
          position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
          background: #2C2416; color: #FDFAF5;
          padding: 14px 32px; border-radius: 100px;
          font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 500;
          z-index: 100; box-shadow: 0 8px 30px rgba(44,36,22,0.25);
          animation: fadeUp 0.3s ease;
        }
      `}</style>

      {/* ── Header ── */}
      {/* <header style={{
        background: "rgba(253,250,245,0.96)", backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(44,36,22,0.07)",
        position: "sticky", top: 0, zIndex: 40,
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button
            onClick={() => router.push("/admin/dashboard")}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, color: "rgba(44,36,22,0.5)", fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500, padding: 0, transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#2C2416"}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "rgba(44,36,22,0.5)"}
          >← Dashboard</button>

          <span className="font-display" style={{ fontSize: 24, letterSpacing: 2, color: "#2C2416", fontWeight: 400 }}>tiramisu.</span>

          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <span style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(44,36,22,0.35)", fontWeight: 600 }}>Admin</span>
            <button
              onClick={() => { localStorage.clear(); router.push("/auth"); }}
              style={{ background: "transparent", border: "1.5px solid rgba(44,36,22,0.2)", color: "rgba(44,36,22,0.6)", padding: "8px 22px", borderRadius: 100, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer", fontFamily: "'Jost', sans-serif", transition: "all 0.3s" }}
              onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "#2C2416"; b.style.color = "#FDFAF5"; }}
              onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "transparent"; b.style.color = "rgba(44,36,22,0.6)"; }}
            >Logout</button>
          </div>
        </div>
      </header> */}

      {/* ── Hero banner ── */}
      {/*<section style={{ background: "#2C2416", padding: "56px 60px 52px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: 80, width: 220, height: 220, border: "1px solid rgba(253,250,245,0.05)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", top: -20, right: 40, width: 300, height: 300, border: "1px solid rgba(253,250,245,0.03)", borderRadius: "50%" }} />*/}
      <section style={{ background: "#2C2416", padding: "56px 60px 52px", position: "relative", overflow: "hidden" }}>
  
        {/*decorative circles should NOT block clicks */}
        <div style={{
          position: "absolute",
          top: -40,
          right: 80,
          width: 220,
          height: 220,
          border: "1px solid rgba(253,250,245,0.05)",
          borderRadius: "50%",
          pointerEvents: "none",  
          zIndex: 0
        }} />

        <div style={{
          position: "absolute",
          top: -20,
          right: 40,
          width: 300,
          height: 300,
          border: "1px solid rgba(253,250,245,0.03)",
          borderRadius: "50%",
          pointerEvents: "none",   
          zIndex: 0
        }} />
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            <div style={{ height: 1, width: 36, background: "rgba(253,250,245,0.2)" }} />
            <span style={{ fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(253,250,245,0.35)", fontWeight: 500 }}>Management Console</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
            <div>
              <h1 className="font-display" style={{ fontSize: "clamp(2.4rem,5vw,4rem)", fontWeight: 300, color: "#FDFAF5", lineHeight: 1, marginBottom: 10 }}>
                Menu <em style={{ color: "#8B6914" }}>Manager</em>
              </h1>
              <p style={{ fontSize: 13, color: "rgba(253,250,245,0.4)", fontWeight: 300 }}>
                All dishes of all cuisines available.
              </p>
            </div>
            <Link 
              href="/admin/menu/add"
              style={{
                background: "#8B6914",
                color: "#FDFAF5", border: "1.5px solid rgba(139,105,20,0.6)",
                padding: "13px 32px", borderRadius: 100, textDecoration: "none",
                fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600,
                cursor: "pointer", fontFamily: "'Jost', sans-serif", transition: "all 0.3s",
                display: "inline-block"
              }}
            >
              + Add Dish
            </Link>
          </div>
        </div>
      </section>

      {/* ── Cuisine filter tabs ── */}
      <div style={{ background: "#F5EFE3", borderBottom: "1px solid rgba(44,36,22,0.07)", position: "sticky", top: 72, zIndex: 30 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px" }}>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "16px 0", scrollbarWidth: "none" }}>
            {cuisines.map(c => (
              <button key={c} className={`cuisine-tab${activeCuisine === c ? " active" : ""}`} onClick={() => setActiveCuisine(c)}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "52px 48px 100px" }}>

        {/* Error banner */}
        {error && (
          <div style={{ background: "rgba(180,50,30,0.07)", border: "1px solid rgba(180,50,30,0.2)", color: "#B4321E", padding: "12px 20px", borderRadius: 4, fontSize: 13, fontWeight: 300, marginBottom: 24 }}>
            {error}
            <button onClick={() => setError("")} style={{ float: "right", background: "none", border: "none", cursor: "pointer", color: "#B4321E", fontSize: 16 }}>×</button>
          </div>
        )}

        {/* Add panel */}
        {showAdd && (
          <div className="add-panel slide-down">
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
              <div style={{ height: 1, width: 32, background: "rgba(139,105,20,0.4)" }} />
              <span style={{ fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase", color: "#8B6914", fontWeight: 600 }}>New Dish</span>
            </div>
            <h3 className="font-display" style={{ fontSize: 26, fontWeight: 300, marginBottom: 28, color: "#2C2416" }}>Add to Menu</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
              <div>
                <label className="field-label">Dish Name</label>
                <input className="field-input" placeholder="e.g. Lamb Biryani" value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="field-label">Price (Rs)</label>
                <input className="field-input" type="number" min={0} step={0.01} placeholder="0.00" value={addForm.price || ""} onChange={e => setAddForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div>
                <label className="field-label">Cuisine / Category</label>
                <select className="field-input" value={addForm.category} onChange={e => setAddForm(f => ({ ...f, category: e.target.value }))}>
                  <option value="">Select cuisine</option>
                  {CUISINES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Item Type</label>
                <select className="field-input" value={addForm.itemType} onChange={e => setAddForm(f => ({ ...f, itemType: e.target.value }))}>
                  <option value="">Select type</option>
                  {ITEM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label className="field-label">Description</label>
              <textarea className="field-input" rows={3} placeholder="Describe this dish…" style={{ resize: "none" }} value={addForm.description} onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn-save" onClick={addItem} disabled={adding || !addForm.name || !addForm.category}>
                {adding ? "Adding…" : "Add Dish"}
              </button>
              <button className="btn-cancel" onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Section header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h2 className="font-display" style={{ fontSize: "clamp(1.6rem,2.5vw,2.4rem)", fontWeight: 300, color: "#2C2416", marginBottom: 4 }}>
              {activeCuisine === "All" ? "All Dishes" : activeCuisine}
            </h2>
            <p style={{ fontSize: 12, color: "rgba(44,36,22,0.38)", fontWeight: 300, letterSpacing: "0.05em" }}>
              {filtered.length} {filtered.length === 1 ? "dish" : "dishes"}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ height: 1, width: 28, background: "rgba(139,105,20,0.3)" }} />
            <span style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(139,105,20,0.55)", fontWeight: 500 }}>Click Edit to modify in place</span>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#8B6914" }}>
            <div className="font-display" style={{ fontSize: 28, fontWeight: 300, marginBottom: 8 }}>Loading menu…</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {filtered.map((item, idx) => {
              const isEditing = editingId === item.id;
              const isDeleting = deleteConfirm === item.id;
              const ts = typeStyle(isEditing ? editForm.itemType : item.itemType);

              return (
                <div key={item.id} className={`menu-card fade-up${isEditing ? " editing" : ""}`} style={{ animationDelay: `${idx * 0.03}s` }}>

                  {/* Image placeholder */}
                  {!isEditing && (
                    <div style={{ position: "relative", height: 180, background: "#EDE0C8", overflow: "hidden" }}>
                      <Image
                        src={`/images/menu/${item.name.toLowerCase().replace(/\s+/g, '-')}.jpg`}
                        alt={item.name} fill style={{ objectFit: "cover" }}
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      />
                      <div style={{ position: "absolute", inset: 0, zIndex: -1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 52, opacity: 0.3 }}>🍽️</span>
                      </div>
                      {/* Item type badge on image */}
                      {item.itemType && (
                        <div style={{
                          position: "absolute", top: 12, left: 12,
                          ...typeStyle(item.itemType),
                          padding: "4px 12px", borderRadius: 100,
                          fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 600,
                          backdropFilter: "blur(6px)",
                        }}>
                          {item.itemType}
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ padding: isEditing ? "24px" : "20px 22px 22px" }}>

                    {isEditing ? (
                      /* ── Edit Mode ── */
                      <div className="slide-down">
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                          <div style={{ height: 1, width: 24, background: "rgba(139,105,20,0.4)" }} />
                          <span style={{ fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase", color: "#8B6914", fontWeight: 600 }}>Editing</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                          <div>
                            <label className="field-label">Dish Name</label>
                            <input className="field-input" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                            <div>
                              <label className="field-label">Price (Rs)</label>
                              <input className="field-input" type="number" min={0} step={0.01} value={editForm.price} onChange={e => setEditForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))} />
                            </div>
                            <div>
                              <label className="field-label">Cuisine</label>
                              <select className="field-input" value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}>
                                <option value="">Select</option>
                                {CUISINES.map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="field-label">Item Type</label>
                            <select className="field-input" value={editForm.itemType} onChange={e => setEditForm(f => ({ ...f, itemType: e.target.value }))}>
                              <option value="">Select type</option>
                              {ITEM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="field-label">Description</label>
                            <textarea className="field-input" rows={3} style={{ resize: "none" }} value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} />
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                          <button className="btn-save" onClick={() => saveEdit(item.id)} disabled={saving}>{saving ? "Saving…" : "Save"}</button>
                          <button className="btn-cancel" onClick={cancelEdit}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      /* ── View Mode ── */
                      <>
                        <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B6914", fontWeight: 600 }}>
                          {item.category}
                        </span>
                        <h3 className="font-display" style={{ fontSize: 22, fontWeight: 400, color: "#2C2416", margin: "6px 0 8px", lineHeight: 1.2 }}>
                          {item.name}
                        </h3>
                        <p style={{ fontSize: 12.5, color: "rgba(44,36,22,0.48)", lineHeight: 1.75, fontWeight: 300, marginBottom: 16, minHeight: 48 }}>
                          {item.description || "No description provided."}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                          <span className="font-display" style={{ fontSize: 22, fontWeight: 400, color: "#2C2416" }}>
                            Rs {Number(item.price).toLocaleString()}
                          </span>
                        </div>

                        {/* Action row */}
                        {isDeleting ? (
                          <div style={{ background: "rgba(180,50,30,0.05)", border: "1px solid rgba(180,50,30,0.15)", borderRadius: 4, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                            <span style={{ fontSize: 12, color: "#B4321E", fontWeight: 300 }}>Remove this dish?</span>
                            <div style={{ display: "flex", gap: 8 }}>
                              <button className="btn-confirm-delete" onClick={() => deleteItem(item.id)}>Delete</button>
                              <button className="btn-cancel" onClick={() => setDeleteConfirm(null)} style={{ padding: "7px 14px" }}>No</button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: "flex", gap: 8 }}>
                            <button className="btn-edit" onClick={() => startEdit(item)}>Edit</button>
                            <button className="btn-delete" onClick={() => setDeleteConfirm(item.id)}>Delete</button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "rgba(44,36,22,0.3)" }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🍽️</div>
            <p className="font-display" style={{ fontSize: 24, fontWeight: 300 }}>No dishes in this category</p>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer style={{ background: "#1A140D", color: "rgba(253,250,245,0.35)", padding: "36px 60px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="font-display" style={{ fontSize: 20, color: "rgba(253,250,245,0.6)", fontWeight: 300, letterSpacing: 2 }}>tiramisu.</span>
          <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" }}>Admin Console · {new Date().getFullYear()}</span>
        </div>
      </footer>

      {/* Toast */}
      {successMsg && <div className="toast">{successMsg}</div>}
    </div>
  );
}