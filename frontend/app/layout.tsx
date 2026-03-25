import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Catering Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">

        {/* Navbar */}
        <nav className="bg-amber-800 p-4 text-white shadow-md">
          <div className="max-w-5xl mx-auto flex justify-between items-center font-semibold">

            <span className="text-lg font-bold tracking-wide">
              Catering Manager
            </span>

            <div className="space-x-4 text-sm">
              <Link href="/" className="hover:underline hover:text-amber-200">
                Menu Catalog
              </Link>
              <Link href="/menu/add" className="hover:underline hover:text-amber-200">
                Add Item
              </Link>
              <Link href="/checkout" className="hover:underline hover:text-amber-200">
                Place Order
              </Link>
              <Link href="/orders" className="hover:underline hover:text-amber-200">
                My Orders
              </Link>
              <Link
                href="/manager/orders"
                className="bg-red-800 hover:bg-red-900 text-white px-3 py-1 rounded transition-colors"
              >
                Manager Dashboard
              </Link>
            </div>

          </div>
        </nav>

        {/* Main Content */}
        <main className="p-8">{children}</main>

      </body>
    </html>
  );
}