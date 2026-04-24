"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type DraftEvent = {
  id: string;
  name: string;
  date: string;
  address: string;
  items: Array<{ menuItem: { id: number; name: string; price: number }; quantity: number }>;
};

export default function MyEvents() {
  const router = useRouter();
  const [user, setUser] = useState<{ fullName: string; email: string } | null>(null);
  const [drafts, setDrafts] = useState<DraftEvent[]>([]);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: "", date: "", address: "" });
  const [editingEventId, setEditingEventId] = useState<string | null>(null); // NEW: Tracks which event we are editing
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = typeof window !== "undefined" ? window.localStorage.getItem("user") : null;
    if (!storedUser) {
      router.push("/auth/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    const storedDrafts = localStorage.getItem(`drafts_${parsedUser.email}`) || "[]";
    setDrafts(JSON.parse(storedDrafts));
    setLoading(false);
  }, [router]);

  // NEW: Helper to close the modal and reset states
  const closeModal = () => {
    setShowModal(false);
    setEditingEventId(null);
    setNewEvent({ name: "", date: "", address: "" });
  };

  // NEW: Opens the modal pre-filled with the event's current details
  const handleOpenEdit = (draft: DraftEvent) => {
    setNewEvent({ name: draft.name, date: draft.date, address: draft.address });
    setEditingEventId(draft.id);
    setShowModal(true);
  };

  // UPDATED: Handles both Create AND Edit depending on the state
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    
    // SATISFIES TC-03: Validate that the date is not in the past
    const selectedDate = new Date(newEvent.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison

    if (selectedDate < today) {
      alert("Invalid Date: Event date cannot be in the past.");
      return; // Stops the code from creating the event!
    }
    
    let updatedDrafts;
    
    if (editingEventId) {
      // We are editing an existing event!
      updatedDrafts = drafts.map(draft => 
        draft.id === editingEventId 
          ? { ...draft, name: newEvent.name, date: newEvent.date, address: newEvent.address }
          : draft
      );
    } else {
      // We are creating a brand new event!
      const newDraft: DraftEvent = {
        id: Date.now().toString(),
        name: newEvent.name,
        date: newEvent.date,
        address: newEvent.address,
        items: []
      };
      updatedDrafts = [...drafts, newDraft];
    }

    setDrafts(updatedDrafts);
    localStorage.setItem(`drafts_${user?.email}`, JSON.stringify(updatedDrafts));
    closeModal();
  };

  const handleDeleteDraft = (id: string) => {
    if (!confirm("Are you sure you want to delete this event plan?")) return;
    const updatedDrafts = drafts.filter(d => d.id !== id);
    setDrafts(updatedDrafts);
    localStorage.setItem(`drafts_${user?.email}`, JSON.stringify(updatedDrafts));
  };

  const updateQuantity = (draftId: string, itemIndex: number, delta: number) => {
    const updatedDrafts = drafts.map(draft => {
      if (draft.id === draftId) {
        const newItems = [...draft.items];
        newItems[itemIndex].quantity = Math.max(1, newItems[itemIndex].quantity + delta);
        return { ...draft, items: newItems };
      }
      return draft;
    });
    setDrafts(updatedDrafts);
    localStorage.setItem(`drafts_${user?.email}`, JSON.stringify(updatedDrafts));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmEvent = async (draft: DraftEvent) => {
    if (draft.items.length === 0) {
      alert("Please add menu items to this event before confirming.");
      return;
    }
    if (!confirm(`Are you ready to finalize billing for ${draft.name}?`)) return;

    setIsSubmitting(true);

    const total = draft.items.reduce((sum, i) => sum + (Number(i.menuItem.price) * i.quantity), 0);

    const payload = {
      customerName: user?.fullName,
      contact: user?.email || "No contact provided",
      eventName: draft.name,
      eventDate: draft.date,
      deliveryAddress: draft.address,
      totalCost: total,
      items: draft.items.map(i => ({
        quantity: i.quantity,
        menuItem: { id: i.menuItem.id }
      }))
    };

    try {
      const res = await fetch("http://localhost:8080/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to place order");
      }

      const updatedDrafts = drafts.filter(d => d.id !== draft.id);
      setDrafts(updatedDrafts);
      localStorage.setItem(`drafts_${user?.email}`, JSON.stringify(updatedDrafts));

      router.push("/customer/orders"); 
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Backend Error:", errorMessage);
      alert("Error confirming event: " + errorMessage);
      setIsSubmitting(false); 
    }
  };

  if (loading) return <div style={{ background: "#FDFAF5", minHeight: "100vh" }} />;

  return (
    <div style={{ background: "#FDFAF5", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Jost', sans-serif", color: "#2C2416" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Cormorant Garamond', serif; }
        .modern-input { width: 100%; padding: 12px; border: 1px solid rgba(44,36,22,0.15); border-radius: 4px; font-family: 'Jost', sans-serif; background: transparent; outline: none; transition: border-color 0.3s; margin-top: 6px; }
        .modern-input:focus { border-color: #2C2416; }
        .btn-primary { background: #2C2416; color: #FDFAF5; border: none; padding: 10px 24px; border-radius: 100px; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; cursor: pointer; transition: background 0.3s; }
        .btn-primary:hover { background: #8B6914; }
        .btn-primary:disabled { background: rgba(44,36,22,0.5); cursor: not-allowed; }
        .btn-outline { background: transparent; border: 1.5px solid rgba(44,36,22,0.2); color: #2C2416; padding: 8px 20px; border-radius: 100px; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; cursor: pointer; transition: all 0.3s; }
        .btn-outline:hover { border-color: #2C2416; }
      `}</style>

      {/* ── Hero Banner ── */}
      <section style={{ position: "relative", height: 320, overflow: "hidden", background: "#2C2416", flexShrink: 0 }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(44,36,22,0.8) 0%, rgba(44,36,22,0.4) 100%)" }} />
        <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", padding: "0 60px", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
            <div style={{ height: 1, width: 40, background: "rgba(253,250,245,0.3)" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(253,250,245,0.45)", fontWeight: 500 }}>Plan</span>
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2.8rem,6vw,5.5rem)", fontWeight: 300, color: "#FDFAF5", lineHeight: 1, marginBottom: 16 }}>
            Event Planning
          </h1>
          <p style={{ fontSize: 14, color: "rgba(253,250,245,0.5)", fontWeight: 300, letterSpacing: "0.05em", maxWidth: 400 }}>
            Build your catering menus and confirm bookings.
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 24px", flex: "1 0 auto", width: "100%" }}>
        
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 32 }}>
          <button onClick={() => setShowModal(true)} className="btn-primary">+ Create New Event</button>
        </div>

        <section style={{ marginBottom: 60 }}>
          {drafts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "rgba(44,36,22,0.35)", background: "#fff", border: "1px dashed rgba(44,36,22,0.15)", borderRadius: 8 }}>
              <p className="font-display" style={{ fontSize: 22, fontWeight: 300 }}>No events currently in planning.</p>
              <p style={{ fontSize: 14, marginTop: 8 }}>Click the button above to start building your menu.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 24 }}>
              {drafts.map(draft => {
                const total = draft.items.reduce((sum, i) => sum + (Number(i.menuItem.price) * i.quantity), 0);
                return (
                  <div key={draft.id} style={{ background: "#fff", border: "1px solid rgba(44,36,22,0.08)", padding: 32, borderRadius: 8, boxShadow: "0 10px 30px rgba(44,36,22,0.03)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                      <div>
                        <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B6914", fontWeight: 600 }}>Draft Phase</span>
                        <h3 className="font-display" style={{ fontSize: 26, margin: "8px 0" }}>{draft.name}</h3>
                        <p style={{ fontSize: 14, color: "rgba(44,36,22,0.6)" }}>{new Date(draft.date).toLocaleDateString()} • {draft.address}</p>
                      </div>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <button onClick={() => router.push(`/customer/menu?eventId=${draft.id}`)} className="btn-outline">+ Add Food</button>
                        <button disabled={isSubmitting} onClick={() => handleConfirmEvent(draft)} className="btn-primary">
                          {isSubmitting ? "Processing..." : "Confirm & Bill"}
                        </button>
                        {/* NEW: Edit Details Button */}
                        <button onClick={() => handleOpenEdit(draft)} style={{ background: "none", border: "none", color: "#8B6914", fontSize: 11, cursor: "pointer", textDecoration: "underline", marginLeft: 8 }}>Edit</button>
                        <button onClick={() => handleDeleteDraft(draft.id)} style={{ background: "none", border: "none", color: "#a83232", fontSize: 11, cursor: "pointer", textDecoration: "underline", marginLeft: 8 }}>Delete</button>
                      </div>
                    </div>

                    {/* Food Items List */}
                    {draft.items.length > 0 && (
                      <div style={{ borderTop: "1px dashed rgba(44,36,22,0.15)", paddingTop: 20 }}>
                        <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, color: "rgba(44,36,22,0.4)", marginBottom: 16 }}>Selected Menu Items</p>
                        {draft.items.map((item, idx) => (
                          <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, fontSize: 14 }}>
                            <div>
                              <span style={{ fontWeight: 500 }}>{item.menuItem.name}</span>
                              <span style={{ color: "rgba(44,36,22,0.5)", marginLeft: 8 }}>@ Rs {Number(item.menuItem.price).toFixed(2)} / person</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid rgba(44,36,22,0.15)", borderRadius: 100, padding: "4px 12px" }}>
                                <button onClick={() => updateQuantity(draft.id, idx, -1)} style={{ background: "none", border: "none", cursor: "pointer", color: "#2C2416" }}>-</button>
                                <span style={{ fontSize: 13, fontWeight: 600, minWidth: 36, textAlign: "center" }}>{item.quantity} pax</span>
                                <button onClick={() => updateQuantity(draft.id, idx, 1)} style={{ background: "none", border: "none", cursor: "pointer", color: "#2C2416" }}>+</button>
                              </div>
                              <span style={{ fontWeight: 600, width: 80, textAlign: "right", fontFamily: "'Jost', sans-serif" }}>Rs {(Number(item.menuItem.price) * item.quantity).toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                        <div style={{ borderTop: "1px solid rgba(44,36,22,0.1)", marginTop: 16, paddingTop: 16, display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: 18 }}>
                          <span>Estimated Total</span>
                          <span style={{ color: "#8B6914", fontFamily: "'Jost', sans-serif" }}>Rs {total.toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* ── Footer ── */}
      <footer style={{ background: "#1A140D", color: "rgba(253,250,245,0.4)", padding: "40px 60px", flexShrink: 0 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <span className="font-display" style={{ fontSize: 22, color: "rgba(253,250,245,0.7)", fontWeight: 300, letterSpacing: 2 }}>tiramisu.</span>
          <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" }}>© {new Date().getFullYear()} tiramisu.</span>
        </div>
      </footer>

      {/* Modal (Used for both Create & Edit) */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(44,36,22,0.4)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#FDFAF5", padding: 40, borderRadius: 8, width: "100%", maxWidth: 450 }}>
            {/* Title changes dynamically */}
            <h2 className="font-display" style={{ fontSize: 32, marginBottom: 24 }}>
              {editingEventId ? "Edit Event" : "New Event"}
            </h2>
            <form onSubmit={handleSaveEvent} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div><label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>Event Name</label><input required type="text" placeholder="e.g., Sarah's Wedding" value={newEvent.name} onChange={e => setNewEvent({...newEvent, name: e.target.value})} className="modern-input" /></div>
              <div>
                <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
                  Event Date
                </label>
                <input 
                  required 
                  type="date" 
                  value={newEvent.date} 
                  // NEW: Greys out past dates in the calendar picker!
                  min={new Date().toISOString().split("T")[0]} 
                  onChange={e => setNewEvent({...newEvent, date: e.target.value})} 
                  className="modern-input" 
                />
              </div>
              <div><label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>Venue Address</label><input required type="text" placeholder="123 Main St." value={newEvent.address} onChange={e => setNewEvent({...newEvent, address: e.target.value})} className="modern-input" /></div>
              <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                {/* Button text changes dynamically */}
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  {editingEventId ? "Save Changes" : "Create"}
                </button>
                <button type="button" onClick={closeModal} className="btn-outline" style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}