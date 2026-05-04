"use client";

import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface HeroSectionProps {
  onSearch: (query: string) => void;
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  const ayahs = [
    {
      text: "The example of Paradise, which the righteous have been promised, is [that] beneath it rivers flow. Its fruit is lasting, and its shade. That is the consequence for the righteous, and the consequence for the disbelievers is the Fire.",
      reference: "Ar Rad : 35"
    },
    {
      text: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth.",
      reference: "Al Baqara : 255"
    },
    {
      text: "O My servants who have transgressed against themselves [by sinning], do not despair of the mercy of Allah. Indeed, Allah forgives all sins. Indeed, it is He who is the Forgiving, the Merciful.",
      reference: "Az Zumar : 53"
    }
  ];

  const popularSurahs = [
    { id: 67, name: "Al Mulk" },
    { id: 36, name: "Yasin" },
    { id: 18, name: "Al Kahf" },
    { id: 112, name: "Al Ikhlas" },
  ];

  const [searchValue, setSearchValue] = useState("");
  const [currentAyah, setCurrentAyah] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("hero-search")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentAyah((prev) => (prev + 1) % ayahs.length);
        setIsAnimating(false);
      }, 500);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative pt-20 pb-16 px-6 lg:px-8 flex flex-col items-center text-center overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        {/* Soft Radial Gradient for Light Mode */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(68.94%_0.1218_225.48/0.05),transparent_70%)] dark:opacity-0" />
        
        {/* Decorative Blur Orbs */}
        <div className="absolute top-10 left-10 h-64 w-64 bg-primary/10 blur-[100px] rounded-full opacity-50" />
        <div className="absolute bottom-10 right-10 h-64 w-64 bg-secondary/10 blur-[100px] rounded-full opacity-50" />
      </div>

      {/* Main Title */}
      <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-12 tracking-tighter uppercase font-serif">
        Quran Mazid
      </h1>

      {/* Search Bar Container */}
      <div className="w-full max-w-3xl relative group mb-8">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input
          id="hero-search"
          type="text"
          placeholder="What do you want to read?"
          value={searchValue}
          onChange={handleChange}
          className="w-full h-16 pl-16 pr-24 bg-card border border-border rounded-full text-lg focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-muted-foreground/30 shadow-2xl"
        />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 px-3 py-1 bg-muted rounded-lg border border-border text-xs text-muted-foreground font-mono">
          Ctrl+k
        </div>
      </div>

      {/* Popular Chips */}
      <div className="flex flex-wrap justify-center gap-3 mb-16">
        {popularSurahs.map((surah) => (
          <Link
            key={surah.id}
            href={`/surah/${surah.id}`}
            className="px-8 py-2.5 rounded-full bg-card border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-muted transition-all"
          >
            {surah.name}
          </Link>
        ))}
      </div>

      {/* Ayah of the Day Slider */}
      <div className="max-w-2xl min-h-[160px] flex flex-col justify-center gap-6 relative">
        <div className={cn(
          "transition-all duration-500 space-y-6",
          isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
        )}>
          <p className="text-lg md:text-xl text-muted-foreground/80 leading-relaxed font-medium italic">
            "{ayahs[currentAyah].text}"
          </p>
          <div className="flex items-center justify-center gap-3 text-muted-foreground text-sm font-bold uppercase tracking-widest">
            <span className="h-[1px] w-8 bg-muted-foreground/20" />
            <span>[ {ayahs[currentAyah].reference} ]</span>
            <span className="h-[1px] w-8 bg-muted-foreground/20" />
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {ayahs.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIsAnimating(true);
                setTimeout(() => {
                  setCurrentAyah(i);
                  setIsAnimating(false);
                }, 500);
              }}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                currentAyah === i ? "w-8 bg-primary" : "w-2 bg-muted-foreground/20 hover:bg-muted-foreground/40"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
