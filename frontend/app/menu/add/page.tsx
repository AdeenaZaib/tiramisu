"use client";
import { useState } from "react";

export default function AddItem() {
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "" });

  const submit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:8080/api/menu/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    alert("Menu Item Added Successfully!");
    setForm({ name: "", description: "", price: "", category: "" });
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-2xl border border-amber-800">
      <h2 className="text-3xl font-bold mb-6 text-amber-900 border-b-2 border-red-800 pb-2">Add New Dish</h2>
      <form onSubmit={submit} className="space-y-4">
        <input placeholder="Dish Name" className="w-full p-3 border rounded border-gray-300 focus:border-red-800 outline-none" 
               value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <textarea placeholder="Description" className="w-full p-3 border rounded border-gray-300 focus:border-red-800 outline-none"
               value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
        <input type="number" placeholder="Price" className="w-full p-3 border rounded border-gray-300 focus:border-red-800 outline-none"
               value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
        <select className="w-full p-3 border rounded border-gray-300 bg-white"
                value={form.category} onChange={e => setForm({...form, category: e.target.value})} required>
          <option value="">Select Cuisine</option>
          <option value="Pakistani">Pakistani</option>
          <option value="Italian">Italian</option>
          <option value="Chinese">Chinese</option>
        </select>
        <button className="w-full bg-red-800 text-white font-bold p-4 rounded hover:bg-red-900 transition-colors">
          CONFIRM ADDITION
        </button>
      </form>
    </div>
  );
}