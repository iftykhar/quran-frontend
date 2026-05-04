"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSurahs, getJuzList } from "@/lib/api";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Search } from "lucide-react";

interface ItemCardProps {
  number: number;
  title: string;
  subtitle: string;
  arabicName?: string;
  href: string;
}

function ItemCard({ number, title, subtitle, arabicName, href }: ItemCardProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-5 p-6 rounded-2xl border border-[#1A1A1A] bg-[#0A0A0A] transition-all duration-300 hover:border-primary/40 hover:bg-[#111111] hover:scale-[1.02] hover:shadow-2xl group"
    >
      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
        <div className="absolute inset-0 rotate-45 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] group-hover:border-primary/30 group-hover:rotate-[135deg] transition-all duration-500" />
        <span className="relative text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors">
          {number}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground/60 font-medium truncate group-hover:text-muted-foreground transition-colors">
          {subtitle}
        </p>
      </div>

      {arabicName && (
        <div className="text-right">
          <span className="font-quran text-3xl text-foreground/80 group-hover:text-primary transition-colors">
            {arabicName}
          </span>
        </div>
      )}
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="flex items-center gap-5 p-6 rounded-2xl border border-[#1A1A1A] bg-[#0A0A0A] animate-pulse">
      <div className="h-12 w-12 shrink-0 rotate-45 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A]" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-24 bg-[#1A1A1A] rounded" />
        <div className="h-3 w-16 bg-[#1A1A1A] rounded" />
      </div>
      <div className="h-8 w-16 bg-[#1A1A1A] rounded" />
    </div>
  );
}

export function SurahExplorer() {
  const [activeTab, setActiveTab] = useState<"surah" | "juz" | "page">("surah");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: surahs, isLoading: isLoadingSurahs } = useQuery({
    queryKey: ["surahs"],
    queryFn: getSurahs,
  });

  const { data: juzList, isLoading: isLoadingJuz } = useQuery({
    queryKey: ["juzList"],
    queryFn: getJuzList,
    enabled: activeTab === "juz",
  });

  const pages = Array.from({ length: 604 }, (_, i) => ({
    page_no: i + 1,
    title: `Page ${i + 1}`,
  }));

  const filteredItems = React.useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (activeTab === "surah") {
      return surahs?.filter(s => 
        s.eng_name.toLowerCase().includes(query) || 
        s.sura_no.toString().includes(query)
      ) || [];
    }
    if (activeTab === "juz") {
      return juzList?.filter(j => 
        j.juz_no.toString().includes(query) || 
        j.first_surah_name.toLowerCase().includes(query)
      ) || [];
    }
    return pages.filter(p => p.title.toLowerCase().includes(query));
  }, [activeTab, searchQuery, surahs, juzList, pages]);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <div className="flex flex-col gap-8 mb-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <h1 className="text-4xl font-bold text-foreground tracking-tight">Explore Quran</h1>
          
          <div className="flex p-1.5 bg-[#111111] rounded-2xl border border-[#222222]">
            {["surah", "juz", "page"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab as any);
                  setSearchQuery("");
                }}
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

        <div className="relative group max-w-2xl mx-auto w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 pl-16 pr-6 bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl text-lg focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoadingSurahs || (activeTab === "juz" && isLoadingJuz) ? (
          Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          filteredItems.map((item: any) => {
            if (activeTab === "surah") {
              return (
                <ItemCard
                  key={`surah-${item.sura_no}`}
                  number={item.sura_no}
                  title={item.eng_name}
                  subtitle={item.meaning}
                  arabicName={item.sura_name}
                  href={`/surah/${item.sura_no}`}
                />
              );
            }
            if (activeTab === "juz") {
              return (
                <ItemCard
                  key={`juz-${item.juz_no}`}
                  number={item.juz_no}
                  title={`Juz ${item.juz_no}`}
                  subtitle={`${item.first_surah_name} & More`}
                  href={`/juz/${item.juz_no}`}
                />
              );
            }
            return (
              <ItemCard
                key={`page-${item.page_no}`}
                number={item.page_no}
                title={`Page ${item.page_no}`}
                subtitle="Quran Madani Mushaf"
                href={`/page/${item.page_no}`}
              />
            );
          })
        )}
      </div>

      {filteredItems.length === 0 && !isLoadingSurahs && (
        <div className="text-center py-20">
          <p className="text-muted-foreground font-medium">No results found for "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}
