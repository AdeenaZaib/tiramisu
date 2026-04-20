"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f5f5dc] flex flex-col items-center justify-center relative overflow-hidden">

      {/* Background decorative circles */}
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full bg-amber-800 opacity-10" />
      <div className="absolute bottom-[-100px] right-[-60px] w-96 h-96 rounded-full bg-amber-900 opacity-10" />
      <div className="absolute top-1/2 left-[-40px] w-40 h-40 rounded-full bg-red-800 opacity-5" />

      {/* Main Card */}
      <div className="relative z-10 text-center px-6 max-w-2xl w-full">

        {/* Top line decoration */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-16 bg-amber-800 opacity-50" />
          <span className="text-amber-800 text-xs uppercase tracking-[0.3em] font-semibold opacity-70">
            Welcome
          </span>
          <div className="h-px w-16 bg-amber-800 opacity-50" />
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-bold text-amber-900 mb-3 leading-tight">
          Catering
        </h1>
        <h1 className="text-5xl md:text-6xl font-bold text-red-800 mb-3 leading-tight">
          Management
        </h1>
        <h1 className="text-5xl md:text-6xl font-bold text-amber-900 mb-8 leading-tight">
          System
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-base mb-12 tracking-wide">
          Please select how you would like to continue
        </p>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Customer Card */}
          <button
            onClick={() => router.push("/auth")}
            className="group bg-white border-2 border-amber-800 rounded-2xl p-8 shadow-md hover:shadow-xl hover:bg-amber-800 transition-all duration-300 text-left"
          >
            <div className="text-4xl mb-4">🍽️</div>
            <h2 className="text-2xl font-bold text-amber-900 group-hover:text-white transition-colors duration-300 mb-2">
              Customer
            </h2>
            <p className="text-gray-500 group-hover:text-amber-100 text-sm transition-colors duration-300">
              Browse the menu, place catering orders and track your order status
            </p>
            <div className="mt-6 flex items-center gap-2 text-amber-800 group-hover:text-white font-semibold text-sm transition-colors duration-300">
              Enter as Customer
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </div>
          </button>

          {/* Admin Card */}
          <button
           onClick={() => router.push("/auth")}
            className="group bg-white border-2 border-red-800 rounded-2xl p-8 shadow-md hover:shadow-xl hover:bg-red-800 transition-all duration-300 text-left"
          >
            <div className="text-4xl mb-4">⚙️</div>
            <h2 className="text-2xl font-bold text-red-800 group-hover:text-white transition-colors duration-300 mb-2">
              Admin
            </h2>
            <p className="text-gray-500 group-hover:text-red-100 text-sm transition-colors duration-300">
              Manage menu items, update order statuses and oversee all catering operations
            </p>
            <div className="mt-6 flex items-center gap-2 text-red-800 group-hover:text-white font-semibold text-sm transition-colors duration-300">
              Enter as Admin
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </div>
          </button>

        </div>

        {/* Bottom decoration */}
        <div className="mt-12 flex items-center justify-center gap-3">
          <div className="h-px w-16 bg-amber-800 opacity-30" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-800 opacity-30" />
          <div className="h-px w-16 bg-amber-800 opacity-30" />
        </div>

      </div>
    </div>
  );
}