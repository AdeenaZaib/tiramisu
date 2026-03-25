"use client";
import { useState, useEffect } from "react";

type MenuItem = {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
};

type CartItem = {
  item: MenuItem;
  quantity: number;
};

export default function Checkout() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [form, setForm] = useState({
    customerName: "",
    contactNumber: "",
    eventDate: "",
    deliveryAddress: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/menu/all")
      .then((res) => res.json())
      .then((data) => setMenuItems(data))
      .catch((err) => console.error("Failed to load menu:", err));
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.item.id === itemId ? { ...c, quantity: c.quantity - 1 } : c))
        .filter((c) => c.quantity > 0)
    );
  };

  const TAX_RATE = 0.1;
  const subtotal = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const eventDate = new Date(form.eventDate);
    if (eventDate <= new Date()) {
      alert("Invalid Date: Event date must be in the future.");
      return;
    }

    if (cart.length === 0) {
      alert("Please add at least one item to your order.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customerName: form.customerName,
        contactNumber: form.contactNumber,
        eventDate: form.eventDate,
        deliveryAddress: form.deliveryAddress,
        items: cart.map((c) => ({ menuItemId: c.item.id, quantity: c.quantity })),
      };

      const res = await fetch("http://localhost:8080/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to place order");
      const data = await res.json();
      setSuccessMessage(`Order placed! Your Order ID is: ${data.orderId || data.id}`);
      setCart([]);
      setForm({ customerName: "", contactNumber: "", eventDate: "", deliveryAddress: "" });
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-red-800 text-center mb-8">Place Your Order</h1>

      {successMessage && (
        <div className="bg-green-100 border border-green-500 text-green-800 p-4 rounded-lg mb-6 font-semibold text-center">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Menu Selection */}
        <div>
          <h2 className="text-2xl font-bold text-amber-900 mb-4 border-b-2 border-red-800 pb-2">
            Select Items
          </h2>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {menuItems.map((item) => {
              const cartEntry = cart.find((c) => c.item.id === item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-lg border-l-4 border-amber-800 shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold uppercase text-sm">{item.name}</p>
                    <p className="text-gray-500 text-xs">{item.category}</p>
                    <p className="text-red-700 font-semibold">${item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {cartEntry ? (
                      <>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-8 h-8 rounded-full bg-red-800 text-white font-bold hover:bg-red-900 flex items-center justify-center"
                        >
                          −
                        </button>
                        <span className="font-bold w-6 text-center">{cartEntry.quantity}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="w-8 h-8 rounded-full bg-amber-800 text-white font-bold hover:bg-amber-900 flex items-center justify-center"
                        >
                          +
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-amber-800 text-white text-sm px-3 py-1 rounded hover:bg-amber-900 transition-colors"
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Order Form + Summary */}
        <div>
          <h2 className="text-2xl font-bold text-amber-900 mb-4 border-b-2 border-red-800 pb-2">
            Event Details
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              placeholder="Customer Name"
              className="w-full p-3 border rounded border-gray-300 focus:border-red-800 outline-none bg-white"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              required
            />
            <input
              placeholder="Contact Number"
              className="w-full p-3 border rounded border-gray-300 focus:border-red-800 outline-none bg-white"
              value={form.contactNumber}
              onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
              required
            />
            <input
              type="date"
              className="w-full p-3 border rounded border-gray-300 focus:border-red-800 outline-none bg-white"
              value={form.eventDate}
              onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
              required
            />
            <textarea
              placeholder="Delivery Address"
              className="w-full p-3 border rounded border-gray-300 focus:border-red-800 outline-none bg-white"
              value={form.deliveryAddress}
              onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
              required
            />

            {/* Order Summary */}
            {cart.length > 0 && (
              <div className="bg-white p-4 rounded-lg border border-amber-200 shadow-sm">
                <h3 className="font-bold text-amber-900 mb-2 uppercase text-sm tracking-wide">Order Summary</h3>
                {cart.map((c) => (
                  <div key={c.item.id} className="flex justify-between text-sm py-1">
                    <span>{c.item.name} × {c.quantity}</span>
                    <span className="font-semibold">${(c.item.price * c.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 mt-2 pt-2 space-y-1 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (10%)</span><span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-red-800 text-base pt-1 border-t border-gray-200">
                    <span>Total</span><span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-800 text-white font-bold p-4 rounded hover:bg-red-900 transition-colors disabled:opacity-60"
            >
              {loading ? "Placing Order..." : "CONFIRM ORDER"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}