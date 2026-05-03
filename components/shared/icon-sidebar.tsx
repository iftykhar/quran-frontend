"use client";

import React from "react";
import Link from "next/link";
import { Home, LayoutGrid, Compass, Bookmark, Grid2X2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: LayoutGrid, label: "Surah", href: "/surah" },
  { icon: Compass, label: "Navigation", href: "/navigation" },
  { icon: Bookmark, label: "Bookmarks", href: "/bookmarks" },
  { icon: Grid2X2, label: "Apps", href: "/apps" },
];

export function IconSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-20 flex-col items-center border-r border-border bg-card py-6">
      <div className="mb-10">
        <Link href="/">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
            {/* The logo in the screenshot is a white book on green square */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-white"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              <path d="M8 7h6" />
              <path d="M8 11h8" />
            </svg>
          </div>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-8">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 hover:bg-primary/10",
                isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-6 w-6 transition-transform group-hover:scale-110")} />
              {isActive && (
                <span className="absolute left-0 h-6 w-1 rounded-r-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
