"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
}

type CartItem = {
  item: MenuItem;
  quantity: number;
};

export default function CustomerMenu() {
  const router = useRouter();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [filter, setFilter] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [added, setAdded] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/menu/all")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error(err));

    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const filteredItems =
    filter === "All" ? items : items.filter((i) => i.category === filter);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      const updated = existing
        ? prev.map((c) => c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)
        : [...prev, { item, quantity: 1 }];
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
    setAdded(item.id);
    setTimeout(() => setAdded(null), 1500);
  };

  const totalItems = cart.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h1 className="text-4xl font-bold text-red-800">Menu Catalog</h1>
        <div className="flex items-center gap-3">
          <select
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white border-2 border-amber-800 p-2 rounded shadow-sm text-sm"
          >
            <option value="All">All Cuisines</option>
            <option value="Pakistani">Pakistani</option>
            <option value="Italian">Italian</option>
            <option value="Chinese">Chinese</option>
          </select>

          {/* Cart Button */}
          <button
            onClick={() => router.push("/customer/cart")}
            className="relative flex items-center gap-2 bg-amber-800 hover:bg-amber-900 text-white font-bold py-2 px-5 rounded-lg text-sm shadow transition-colors"
          >
            🛒 View Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-700 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-lg border-l-8 border-amber-900 shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold uppercase">{item.name}</h3>
                <span className="text-red-700 font-bold text-lg ml-2">${item.price}</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{item.description}</p>
              <span className="text-xs font-semibold bg-amber-100 px-2 py-1 rounded text-amber-900">
                {item.category}
              </span>
            </div>

            <button
              onClick={() => addToCart(item)}
              className={`mt-4 w-full font-bold py-2 rounded-lg text-sm transition-all duration-200 ${
                added === item.id
                  ? "bg-green-600 text-white"
                  : "bg-red-800 hover:bg-red-900 text-white"
              }`}
            >
              {added === item.id ? "✓ Added to Cart!" : "+ Add to Cart"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}