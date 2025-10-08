"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, BookText, Users } from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: <Home className="h-5 w-5" /> },
    { name: "Books", href: "/dashboard/books", icon: <BookOpen className="h-5 w-5" /> },
    { name: "Journals", href: "/dashboard/journals", icon: <BookText className="h-5 w-5" /> },
    { name: "Authors", href: "/dashboard/authors", icon: <Users className="h-5 w-5" /> },
  ];

  return (
    <aside className="w-64 h-screen bg-base-200 p-4 flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Management</h2>
      <ul className="space-y-1 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-primary-content"
                    : "hover:bg-base-300"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;
