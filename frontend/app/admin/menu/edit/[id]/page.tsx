"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
}

export default function EditMenuItem() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState<MenuItem>({
    id: 0,
    name: "",
    description: "",
    price: 0,
    category: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8080/api/menu/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch item");
        return res.json();
      })
      .then(data => {
        setForm(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "price" ? (parseFloat(value) || 0) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:8080/api/menu/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update item");
      router.push("/admin/menu");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto mt-16 text-center text-amber-800 font-semibold text-lg">
        Loading item...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <button
        onClick={() => router.back()}
        className="mb-6 text-amber-800 hover:text-amber-900 font-semibold text-sm uppercase"
      >
        ← Back to Menu
      </button>

      <div className="bg-white rounded-lg shadow-md border-l-8 border-amber-900 p-8">
        <h1 className="text-3xl font-bold text-red-800 mb-6">Edit Menu Item</h1>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 rounded p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase text-amber-900 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border-2 border-amber-200 focus:border-amber-800 rounded px-3 py-2 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-amber-900 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full border-2 border-amber-200 focus:border-amber-800 rounded px-3 py-2 outline-none transition resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-amber-900 mb-1">Price ($)</label>
            <input
              type="number"
              name="price"
              value={form.price.toString()}
              onChange={handleChange}
              required
              min={0}
              step={0.01}
              className="w-full border-2 border-amber-200 focus:border-amber-800 rounded px-3 py-2 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-amber-900 mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full border-2 border-amber-200 focus:border-amber-800 rounded px-3 py-2 outline-none transition bg-white"
            >
              <option value="">Select a category</option>
              <option value="Pakistani">Pakistani</option>
              <option value="Italian">Italian</option>
              <option value="Chinese">Chinese</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 border-2 border-amber-800 text-amber-800 hover:bg-amber-50 font-semibold py-2 rounded transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-red-800 hover:bg-red-900 text-white font-semibold py-2 rounded transition disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
