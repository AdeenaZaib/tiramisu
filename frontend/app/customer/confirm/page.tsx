"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast"; // <-- Now this import will work perfectly!

type CartItem = {
  item: { id: number; name: string; price: number };
  quantity: number;
};

export default function ConfirmOrder() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  // Toast States
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Helper to show toasts
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToastMsg(msg);
    setToastType(type);
  };

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    const savedForm = localStorage.getItem("checkoutForm");
    if (!savedCart || !savedForm) { router.replace("/customer/menu"); return; }
    setCart(JSON.parse(savedCart));
    setForm(JSON.parse(savedForm));
  }, [router]);

  if (!form) return null;

  const subtotal = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // 1. Safely grab the user
      const storedUser = typeof window !== "undefined" ? window.localStorage.getItem("user") : null;
      const loggedInUser = storedUser ? JSON.parse(storedUser) : null;

      // 2. The Bouncer Check
      if (!loggedInUser || !loggedInUser.fullName) {
        throw new Error("You must be logged in to place an order.");
      }
      
      // Create the payload to perfectly match the Java models
      const payload = {
        customerName: loggedInUser.fullName, 
        contact: form.contactNumber,
        eventDate: form.eventDate,
        deliveryAddress: form.deliveryAddress,
        items: cart.map((c) => ({          
          quantity: c.quantity,
          menuItem: {                      
            id: c.item.id
          }
        })),
      };

      const res = await fetch("http://localhost:8080/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        // Grab the error message from the backend if it fails
        const errorText = await res.text();
        throw new Error(errorText || "Failed to place order");
      }
      
      const data = await res.json();
      setOrderId(data.id);
      localStorage.removeItem("cart");
      localStorage.removeItem("checkoutForm");
    } catch (err: any) {
      // THE FIX: Trigger the custom error Toast instead of alert()
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Success Screen
  if (orderId) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <h1 className="text-3xl font-bold text-green-700 mb-2">Order Placed!</h1>
        <p className="text-gray-500 mb-1">Your Order ID is</p>
        <p className="text-5xl font-bold text-amber-900 mb-8">#{orderId}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => router.push("/customer/orders")} className="bg-amber-800 hover:bg-amber-900 text-white font-bold py-3 px-8 rounded-lg">View My Orders</button>
          <button onClick={() => router.push("/customer/menu")} className="border-2 border-amber-800 text-amber-900 font-bold py-3 px-8 rounded-lg hover:bg-amber-50">Back to Menu</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto relative">
      <h1 className="text-4xl font-bold text-red-800 text-center mb-8">Confirm Order</h1>

      {/* Step Indicator */}
      <div className="flex items-center mb-10">
        {["Select Items", "Event Details", "Confirmation"].map((step, i) => (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center ${
                i < 2 ? "bg-green-700 text-white" : "bg-red-800 text-white"
              }`}>
                {i < 2 ? "✓" : "3"}
              </div>
              <span className={`text-sm font-semibold hidden md:block ${i < 2 ? "text-green-700" : "text-red-800"}`}>{step}</span>
            </div>
            {i < 2 && <div className={`flex-1 h-px mx-3 ${i < 1 ? "bg-green-700" : "bg-green-700"}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-amber-200 shadow-md p-8 space-y-6">

        {/* Customer Details */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-amber-900 mb-3 border-b border-amber-100 pb-2">Customer Details</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-gray-400 text-xs uppercase mb-1">Name</p><p className="font-semibold">{form.customerName}</p></div>
            <div><p className="text-gray-400 text-xs uppercase mb-1">Contact</p><p className="font-semibold">{form.contactNumber}</p></div>
            <div><p className="text-gray-400 text-xs uppercase mb-1">Event Date</p><p className="font-semibold">{new Date(form.eventDate).toLocaleDateString()}</p></div>
            <div><p className="text-gray-400 text-xs uppercase mb-1">Delivery Address</p><p className="font-semibold">{form.deliveryAddress}</p></div>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-amber-900 mb-3 border-b border-amber-100 pb-2">Order Items</h2>
          <div className="space-y-2">
            {cart.map((c) => (
              <div key={c.item.id} className="flex justify-between text-sm">
                <span className="text-gray-700">{c.item.name} × {c.quantity}</span>
                <span className="font-semibold">${(c.item.price * c.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-3 pt-3 space-y-1 text-sm">
            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Tax (10%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-red-800 text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={() => router.push("/customer/checkout")} className="flex-1 border-2 border-amber-800 text-amber-900 font-bold py-3 rounded hover:bg-amber-50">Edit Details</button>
          <button onClick={handleConfirm} disabled={loading} className="flex-1 bg-red-800 text-white font-bold py-3 rounded hover:bg-red-900 disabled:opacity-50">
            {loading ? "Placing Order..." : "Confirm & Place Order"}
          </button>
        </div>
      </div>

      {/* Render the Toast Component */}
      <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg("")} />
    </div>
  );
}