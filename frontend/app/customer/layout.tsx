import Link from "next/link";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f5dc" }}>
      <nav className="bg-amber-800 p-4 text-white shadow-md">
        <div className="max-w-5xl mx-auto flex justify-between items-center font-semibold">

          <Link href="/" className="text-lg font-bold tracking-wide hover:text-amber-200 transition-colors">
  Catering Management System
</Link>

          <div className="flex items-center gap-6">
           
            <Link href="/customer/menu" className="hover:underline hover:text-amber-200 text-sm font-semibold">
              Menu Catalog
            </Link>
            <Link href="/customer/checkout" className="hover:underline hover:text-amber-200 text-sm font-semibold">
              Place Order
            </Link>
            <Link href="/customer/orders" className="hover:underline hover:text-amber-200 text-sm font-semibold">
              My Orders
            </Link>
          </div>

        </div>
      </nav>
      <main className="p-8">{children}</main>
    </div>
  );
}