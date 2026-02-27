import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <nav className="bg-blue-600 p-4 text-white shadow-md">
          <div className="max-w-4xl mx-auto flex justify-between font-semibold">
            <span>Catering Manager</span>
            <div className="space-x-4">
              <Link href="/" className="hover:underline">Menu Catalog</Link>
              <Link href="/menu/add" className="hover:underline">Add Item</Link>
            </div>
          </div>
        </nav>
        <main className="p-8">{children}</main>
      </body>
    </html>
  );
}