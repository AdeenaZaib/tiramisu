"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
  item: { id: number; name: string; price: number; category: string };
  quantity: number;
};

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const updateQty = (id: number, delta: number) => {
    setCart((prev) => {
      const updated = prev
        .map((c) => c.item.id === id ? { ...c, quantity: c.quantity + delta } : c)
        .filter((c) => c.quantity > 0);
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const removeItem = (id: number) => {
    setCart((prev) => {
      const updated = prev.filter((c) => c.item.id !== id);
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const subtotal = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  const totalItems = cart.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <div className="max-w-5xl mx-auto">

      {/* Step Indicator */}
      <div className="flex items-center mb-10">
        {["Select Items", "Event Details", "Confirmation"].map((step, i) => (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center ${
                i === 0 ? "bg-red-800" : "bg-gray-200 text-gray-500"
              }`}>
                <span className={i === 0 ? "text-white" : "text-gray-500"}>{i + 1}</span>
              </div>
              <span className={`text-sm font-semibold hidden md:block ${
                i === 0 ? "text-red-800" : "text-gray-400"
              }`}>{step}</span>
            </div>
            {i < 2 && <div className="flex-1 h-px bg-gray-300 mx-3" />}
          </div>
        ))}
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-amber-200 shadow-md">
          <p className="text-5xl mb-4">🛒</p>
          <p className="text-gray-500 text-lg mb-6">Your cart is empty.</p>
          <button
            onClick={() => router.push("/customer/menu")}
            className="bg-amber-800 hover:bg-amber-900 text-white font-bold py-2 px-8 rounded-lg"
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT: Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((c) => (
              <div
                key={c.item.id}
                className="bg-white p-5 rounded-lg border-l-8 border-amber-900 shadow-md"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold uppercase text-base">{c.item.name}</p>
                    <p className="text-red-700 font-bold text-lg">${c.item.price}</p>
                    <span className="text-xs bg-amber-100 px-2 py-0.5 rounded text-amber-900 font-semibold">
                      {c.item.category}
                    </span>
                  </div>
                  <button
                    onClick={() => removeItem(c.item.id)}
                    className="text-gray-300 hover:text-red-700 text-xl font-bold transition-colors"
                    title="Remove"
                  >✕</button>
                </div>

                <div className="flex items-center justify-between mt-2">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQty(c.item.id, -1)}
                      className="w-8 h-8 rounded-full bg-red-800 text-white font-bold hover:bg-red-900 flex items-center justify-center text-lg"
                    >−</button>
                    <span className="font-bold text-lg w-6 text-center">{c.quantity}</span>
                    <button
                      onClick={() => updateQty(c.item.id, 1)}
                      className="w-8 h-8 rounded-full bg-red-800 text-white font-bold hover:bg-red-900 flex items-center justify-center text-4xl"
                    >+</button>
                  </div>
                  <p className="font-bold text-base">
                    ${(c.item.price * c.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}

            <button
              onClick={() => router.push("/customer/menu")}
              className="text-amber-800 hover:text-amber-900 font-semibold text-sm underline"
            >
              Add more items
            </button>
          </div>

          {/* RIGHT: Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-amber-200 shadow-md p-6 sticky top-6">
              <h2 className="text-lg font-bold text-amber-900 uppercase tracking-wide mb-4 border-b border-amber-100 pb-2">
                Your Cart ({totalItems})
              </h2>

              <div className="space-y-2 mb-4">
                {cart.map((c) => (
                  <div key={c.item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">{c.item.name} × {c.quantity}</span>
                    <span className="font-semibold">${(c.item.price * c.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-1 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Tax (10%)</span><span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-red-800 text-lg border-t border-gray-100 pt-3 mt-2">
                  <span>Total</span><span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => router.push("/customer/checkout")}
                className="w-full mt-6 bg-red-800 hover:bg-red-900 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Proceed to Details
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}