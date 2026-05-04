"use client";

import React, { useState } from "react";
import { Surah } from "@/types/quran";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SurahCardProps {
  surah: Surah;
}

function SurahCard({ surah }: SurahCardProps) {
  return (
    <Link
      href={`/surah/${surah.sura_no}`}
      className="flex items-center gap-5 p-5 rounded-2xl border border-[#1A1A1A] bg-[#0A0A0A] transition-all duration-300 hover:border-primary/40 hover:bg-[#111111] hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/5 group relative overflow-hidden"
    >
      {/* Diamond Number Badge */}
      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
        <div className="absolute inset-0 rotate-45 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] group-hover:border-primary/30 group-hover:rotate-[135deg] transition-all duration-500" />
        <span className="relative text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors">
          {surah.sura_no}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">
          {surah.eng_name}
        </h3>
        <p className="text-xs text-muted-foreground/60 font-medium truncate group-hover:text-muted-foreground transition-colors">
          {surah.meaning}
        </p>
      </div>

      <div className="text-right">
        <span className="font-quran text-2xl text-foreground/80 group-hover:text-primary transition-colors">
          {surah.sura_name}
        </span>
      </div>
    </Link>
  );
}

interface SurahGridProps {
  surahs: Surah[];
  searchQuery: string;
}

export function SurahGrid({ surahs, searchQuery }: SurahGridProps) {
  const [activeTab, setActiveTab] = useState<"surah" | "juz" | "page">("surah");

  const filteredSurahs = React.useMemo(() => {
    const query = searchQuery.toLowerCase();
    return surahs.filter(
      (s) =>
        s.eng_name.toLowerCase().includes(query) ||
        s.meaning.toLowerCase().includes(query) ||
        s.sura_no.toString().includes(query)
    );
  }, [surahs, searchQuery]);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <h2 className="text-3xl font-bold text-foreground tracking-tight">
          Quran Mazid
        </h2>

        {/* Tab Switcher */}
        <div className="flex p-1.5 bg-[#111111] rounded-2xl border border-[#222222]">
          {["surah", "juz", "page"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "px-8 py-2.5 text-sm font-bold capitalize rounded-xl transition-all duration-300",
                activeTab === tab
                  ? "bg-[#1A1A1A] text-foreground shadow-xl ring-1 ring-white/5"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSurahs.map((surah) => (
          <SurahCard key={surah.sura_no} surah={surah} />
        ))}
      </div>

      {filteredSurahs.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground font-medium">No Surahs found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}
