"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
  item: { id: number; name: string; price: number };
  quantity: number;
};

export default function CheckoutDetails() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [form, setForm] = useState({
    customerName: "",
    contactNumber: "",
    eventDate: "",
    deliveryAddress: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (!saved || JSON.parse(saved).length === 0) {
      router.replace("/customer/menu");
      return;
    }
    setCart(JSON.parse(saved));
    const savedForm = localStorage.getItem("checkoutForm");
    if (savedForm) setForm(JSON.parse(savedForm));
  }, [router]);

  const subtotal = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(form.eventDate) <= today) {
      alert("Invalid Date: Event date must be in the future.");
      return;
    }
    localStorage.setItem("checkoutForm", JSON.stringify(form));
    router.push("/customer/confirm");
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-red-800 text-center mb-8">Event Details</h1>

      {/* Step Indicator */}
      <div className="flex items-center mb-10">
        {["Select Items", "Event Details", "Confirmation"].map((step, i) => (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center ${
                i === 0 ? "bg-green-700 text-white" : i === 1 ? "bg-red-800 text-white" : "bg-gray-200 text-gray-500"
              }`}>
                {i === 0 ? "✓" : i + 1}
              </div>
              <span className={`text-sm font-semibold hidden md:block ${
                i === 0 ? "text-green-700" : i === 1 ? "text-red-800" : "text-gray-400"
              }`}>{step}</span>
            </div>
            {i < 2 && <div className={`flex-1 h-px mx-3 ${i === 0 ? "bg-green-700" : "bg-gray-300"}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-amber-200 shadow-md space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-amber-900 mb-1">Customer Name</label>
              <input placeholder="e.g. John Doe" className="w-full p-3 border rounded border-gray-300 focus:border-red-800 outline-none" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-amber-900 mb-1">Contact Number</label>
              <input placeholder="e.g. 03001234567" className="w-full p-3 border rounded border-gray-300 focus:border-red-800 outline-none" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-amber-900 mb-1">Event Date</label>
              <input type="date" className="w-full p-3 border rounded border-gray-300 focus:border-red-800 outline-none" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-amber-900 mb-1">Delivery Address</label>
              <textarea placeholder="Full delivery address" className="w-full p-3 border rounded border-gray-300 focus:border-red-800 outline-none resize-none" rows={3} value={form.deliveryAddress} onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })} required />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => router.push("/customer/cart")} className="flex-1 border-2 border-amber-800 text-amber-900 font-bold py-3 rounded hover:bg-amber-50">Back to Cart</button>
              <button type="submit" className="flex-1 bg-red-800 text-white font-bold py-3 rounded hover:bg-red-900">Review Order</button>
            </div>
          </form>
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white rounded-xl border border-amber-200 shadow-md p-6 sticky top-6">
            <h2 className="text-lg font-bold text-amber-900 uppercase tracking-wide mb-4 border-b border-amber-100 pb-2">Order Summary</h2>
            <div className="space-y-2 mb-4">
              {cart.map((c) => (
                <div key={c.item.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">{c.item.name} × {c.quantity}</span>
                  <span className="font-semibold">${(c.item.price * c.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-1 text-sm">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-500"><span>Tax (10%)</span><span>${tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-red-800 text-lg border-t pt-3 mt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}