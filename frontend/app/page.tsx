"use client";
import { useEffect, useState } from "react";

export default function MenuCatalog() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("All");

  const fetchItems = () => {
    fetch("http://localhost:8080/api/menu/all")
      .then(res => res.json())
      .then(data => setItems(data));
  };

  useEffect(fetchItems, []);

  const deleteItem = async (id) => {
    if(confirm("Are you sure?")) {
      await fetch(`http://localhost:8080/api/menu/delete/${id}`, { method: 'DELETE' });
      fetchItems();
    }
  };

  const filteredItems = filter === "All" ? items : items.filter(i => i.category === filter);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-red-800">Our Menu</h1>
        <select 
          onChange={(e) => setFilter(e.target.value)}
          className="bg-white border-2 border-amber-800 p-2 rounded shadow-sm"
        >
          <option value="All">All Cuisines</option>
          <option value="Pakistani">Pakistani</option>
          <option value="Italian">Italian</option>
          <option value="Chinese">Chinese</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-lg border-l-8 border-amber-900 shadow-md">
            <div className="flex justify-between">
              <h3 className="text-xl font-bold uppercase">{item.name}</h3>
              <span className="text-red-700 font-bold text-lg">${item.price}</span>
            </div>
            <p className="text-gray-700 my-2">{item.description}</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs font-semibold bg-amber-100 px-2 py-1 rounded text-amber-900">{item.category}</span>
              <button 
                onClick={() => deleteItem(item.id)}
                className="text-red-600 hover:text-red-800 text-sm font-bold uppercase"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}