"use client";

import * as React from "react";
import Link from "next/link";
import { Settings, Moon, Sun, ChevronDown, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Read Quran", href: "/surah" },
  // { label: "Prayer Time", href: "/prayer-time" },
  // { label: "Ramadan 2026", href: "/ramadan" },
];

import { SettingsPanel } from "../settings/settings-panel";
import { useSettings } from "@/provider/app-provider";

export function Navbar() {
  const { theme, setTheme } = useSettings();

  return (
    <header className="sticky top-0 z-40 h-20 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-full items-center justify-between px-3 md:px-6 lg:px-8">
        <div className="flex items-center gap-2 lg:gap-10">
          {/* Hamburger for Sidebar */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9 md:h-10 md:w-10 rounded-xl bg-muted/50 text-muted-foreground hover:text-primary"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('toggle-sidebar'));
            }}
          >
            <Menu className="h-5 w-5 md:h-6 md:w-6" />
          </Button>

          <Link href="/" className="flex items-center gap-1.5 lg:gap-3">
            <div className="flex h-8 w-8 lg:h-11 lg:w-11 items-center justify-center overflow-hidden rounded-xl bg-transparent">
              <img 
                src="/images/logo.png" 
                alt="Quran Mazid" 
                className="h-8 w-8 lg:h-11 lg:w-11 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base lg:text-xl font-bold tracking-tight text-foreground truncate">Quran Mazid</span>
              <span className="hidden md:block text-[10px] font-medium text-muted-foreground uppercase tracking-widest leading-none">
                The Noble Quran
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

        <div className="flex items-center gap-1.5 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-muted/50 text-muted-foreground hover:text-primary"
            onClick={() => window.dispatchEvent(new CustomEvent("toggle-search-modal"))}
          >
            <Search className="h-4 w-4 md:h-5 md:w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-muted/50 text-muted-foreground hover:text-primary"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Moon className="h-4 w-4 md:h-5 md:w-5" /> : <Sun className="h-4 w-4 md:h-5 md:w-5" />}
          </Button>
          
          <SettingsPanel />
        </div>
      </div>
    </header>
  );
}
