import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f5dc" }}>
      <nav className="bg-amber-800 p-4 text-white shadow-md">
        <div className="max-w-5xl mx-auto flex justify-between items-center font-semibold">

            <Link href="/" className="text-lg font-bold tracking-wide hover:text-amber-200 transition-colors">
  Catering Management System
</Link>

          <div className="space-x-4 text-sm">
            <Link href="/admin/menu" className="hover:underline hover:text-amber-200">
              Menu Catalog
            </Link>
            <Link href="/admin/menu/add" className="hover:underline hover:text-amber-200">
              Add Item
            </Link>
            <Link
              href="/admin"
              className="hover:underline hover:text-amber-200"
            >
              Manager Dashboard
            </Link>
          </div>

        </div>
      </nav>
      <main className="p-8">{children}</main>
    </div>
  );
}