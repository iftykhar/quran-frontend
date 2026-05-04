"use client";

import React from "react";
import Link from "next/link";
import { Home, LayoutGrid,  Bookmark, Grid2X2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: LayoutGrid, label: "Surah", href: "/surah" },
  { icon: Send, label: "Jump", id: "jump-to-ayah" },
  { icon: Bookmark, label: "Bookmarks", href: "/bookmarks" },
  { icon: Grid2X2, label: "Apps", href: "/apps" },
];

export function IconSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed bottom-0 left-0 z-50 flex h-16 w-full flex-row items-center justify-around border-t border-border bg-background/80 backdrop-blur-md px-6 lg:left-0 lg:top-0 lg:h-screen lg:w-20 lg:flex-col lg:justify-center lg:border-r lg:border-t-0 lg:bg-card lg:py-6 lg:px-0">
      <div className="hidden lg:flex">
        <Link href="/">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-transparent">
              <img 
                src="/images/logo.png" 
                alt="Quran Mazid" 
                className="h-11 w-11 object-contain"
              />
            </div>
        </Link>
      </div>

      <nav className="flex flex-row flex-1 items-center justify-center w-full lg:flex-col lg:gap-8 lg:justify-center lg:w-auto">
        {navItems.map((item) => {
          // Handle locale prefix in pathname (e.g., /en/surah -> /surah)
          const normalizedPathname = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/") || "/";
          const isActive = item.href ? (
            item.href === "/" 
              ? normalizedPathname === "/" 
              : normalizedPathname.startsWith(item.href)
          ) : false;
          const isButton = !item.href;

          const content = (
            <>
              <item.icon className={cn("h-6 w-6 transition-transform group-hover:scale-110")} />
              {isActive && (
                <span className="hidden lg:block absolute left-0 h-6 w-1 rounded-r-full bg-primary" />
              )}
              {isActive && (
                <span className="lg:hidden absolute bottom-0 h-1 w-6 rounded-t-full bg-primary" />
              )}
            </>
          );

          const className = cn(
            "group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300",
            isActive 
              ? "text-primary bg-primary/10 shadow-[0_0_20px_rgba(34,197,94,0.15)] ring-1 ring-primary/20" 
              : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
          );

          if (isButton) {
            return (
              <button
                key={item.label}
                onClick={() => {
                  if (item.id === "jump-to-ayah") {
                    window.dispatchEvent(new CustomEvent("toggle-jump-modal"));
                  }
                }}
                className={className}
              >
                {content}
              </button>
            );
          }

          return (
            <Link key={item.label} href={item.href!} className={className}>
              {content}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
