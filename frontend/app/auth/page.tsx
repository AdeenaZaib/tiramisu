"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const url = isLogin ? "http://localhost:8080/api/auth/login" : "http://localhost:8080/api/auth/signup";
    
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Authentication failed");
      }
      
      const userData = await res.json();
      
      // Save user details and ROLE to localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("role", userData.role);

      // Role-Based Routing
      if (userData.role === "Manager") {
        router.push("/admin/dashboard"); // Route to your Manager Dashboard
      } else {
        router.push("/customer/menu"); // Route to your Customer Menu
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <div className="bg-white p-8 rounded-xl shadow-lg border-t-8 border-red-800 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-amber-900 mb-6">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Full Name</label>
              <input type="text" name="fullName" onChange={handleChange} required className="w-full border-2 rounded px-3 py-2" />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Email</label>
            <input type="email" name="email" onChange={handleChange} required className="w-full border-2 rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Password</label>
            <input type="password" name="password" onChange={handleChange} required className="w-full border-2 rounded px-3 py-2" />
          </div>
          <button type="submit" className="w-full bg-red-800 text-white font-bold py-3 rounded hover:bg-red-900 transition">
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-red-800 font-bold hover:underline">
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </p>
      </div>
    </div>
  );
}