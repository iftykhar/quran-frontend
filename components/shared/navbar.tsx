"use client";

import * as React from "react";
import Link from "next/link";
import { Settings, Moon, Sun, ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Read Quran", href: "/surah" },
  { label: "Prayer Time", href: "/prayer-time" },
  { label: "Ramadan 2026", href: "/ramadan" },
];

import { SettingsPanel } from "./settings-panel";

export function Navbar() {
  const [theme, setTheme] = React.useState<"dark" | "light">("dark");

  return (
    <header className="sticky top-0 z-40 h-20 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-full items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-4 lg:gap-10">
          {/* Hamburger for Sidebar */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-10 w-10 rounded-xl bg-muted/50 text-muted-foreground hover:text-primary"
            onClick={() => {
              // We need a way to trigger the sidebar. 
              // Since it's a separate component, I'll use a custom event for now 
              // or just assume the user will implement a global state.
              window.dispatchEvent(new CustomEvent('toggle-sidebar'));
            }}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary">
               <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7 text-white"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                <path d="M8 7h6" />
                <path d="M8 11h8" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-foreground">Quran Mazid</span>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest leading-none">
                Read, Study, and Learn The Quran
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-muted/50 text-muted-foreground hover:text-primary"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          
          <SettingsPanel />
        </div>
      </div>
    </header>
  );
}
