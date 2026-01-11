"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Transfer", href: "/dashboard/transfer" },
    { name: "Transactions", href: "/dashboard/transactions" },
  ];

  return (
    <div className="w-64 bg-slate-100 min-h-screen p-6">
      <div className="text-xl font-bold mb-8">Menu</div>
      <nav className="space-y-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-2 rounded transition-colors ${
              pathname === item.href
                ? "bg-blue-500 text-white font-semibold"
                : "text-slate-700 hover:bg-slate-200"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
