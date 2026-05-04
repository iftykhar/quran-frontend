"use client";

import React, { useState, useEffect } from "react";
import { Search, Menu, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Surah } from "@/types/quran";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getSurahs, getJuzList } from "@/lib/api";
import { Button } from "@/components/ui/button";

interface SidebarItemProps {
  number: number;
  title: string;
  subtitle: string;
  arabicName?: string;
  isActive: boolean;
  href: string;
  onClick?: () => void;
}

function SidebarItem({ number, title, subtitle, arabicName, isActive, href, onClick }: SidebarItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 group relative overflow-hidden",
        isActive
          ? "bg-[#1E1E1E] border-[#2E2E2E] shadow-lg ring-1 ring-primary/20"
          : "bg-transparent border-transparent hover:bg-[#1A1A1A] hover:border-[#2E2E2E]"
      )}
    >
      {/* Active Indicator Glow */}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
      )}

      {/* Diamond Number Badge */}
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
        <div 
          className={cn(
            "absolute inset-0 rotate-45 rounded-lg transition-all duration-300",
            isActive 
              ? "bg-primary scale-110 shadow-[0_0_20px_rgba(34,197,94,0.3)]" 
              : "bg-[#2A2A2A] group-hover:bg-[#3A3A3A] group-hover:rotate-[135deg]"
          )} 
        />
        <span className={cn(
          "relative text-xs font-bold transition-colors duration-300",
          isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground"
        )}>
          {number.toString().padStart(2, '0')}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <h4 className={cn(
          "text-sm font-bold truncate transition-colors duration-300",
          isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
        )}>
          {title}
        </h4>
        <p className="text-[10px] text-muted-foreground/60 truncate font-medium group-hover:text-muted-foreground transition-colors">
          {subtitle}
        </p>
      </div>

      {arabicName && (
        <div className="text-right">
          <span className={cn(
            "font-quran text-xl leading-none transition-colors duration-300",
            isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
          )}>
            {arabicName}
          </span>
        </div>
      )}
    </Link>
  );
}

function SidebarSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A]/50 animate-pulse">
      <div className="h-10 w-10 shrink-0 rotate-45 rounded-lg bg-[#2A2A2A]" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-24 bg-[#2A2A2A] rounded-md" />
        <div className="h-2 w-16 bg-[#2A2A2A] rounded-md" />
      </div>
      <div className="h-6 w-12 bg-[#2A2A2A] rounded-md" />
    </div>
  );
}

export function SurahSidebar() {
  const [activeTab, setActiveTab] = useState<"surah" | "juz" | "page">("surah");
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();
  const currentSurahId = params.id ? parseInt(params.id as string) : null;

  const { data: surahs, isLoading: isLoadingSurahs } = useQuery({
    queryKey: ["surahs"],
    queryFn: getSurahs,
  });

  const { data: juzList, isLoading: isLoadingJuz } = useQuery({
    queryKey: ["juzList"],
    queryFn: getJuzList,
    enabled: activeTab === "juz",
  });

  // Pages are currently a virtual list 1-604
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

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggle-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-sidebar', handleToggle);
  }, []);

  return (
    <>
      {/* Sidebar Container */}
      <div className={cn(
        "fixed left-20 top-20 flex h-[calc(100vh-80px)] w-80 flex-col border-r border-border bg-[#0F0F0F] transition-transform duration-300 z-40",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Backdrop for mobile */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden -z-10 translate-x-80" 
            onClick={() => setIsOpen(false)}
          />
        )}

        <div className="p-6 space-y-6">
          {/* Tab Switcher - Pill Style */}
          <div className="flex p-1.5 bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A]">
            {["surah", "juz", "page"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab as any);
                  setSearchQuery("");
                }}
                className={cn(
                  "flex-1 py-2.5 text-xs font-bold capitalize rounded-xl transition-all duration-300",
                  activeTab === tab
                    ? "bg-[#2A2A2A] text-foreground shadow-lg scale-105"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder={`Search ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/40"
            />
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3 custom-scrollbar">
          {isLoadingSurahs || (activeTab === "juz" && isLoadingJuz) ? (
            Array.from({ length: 8 }).map((_, i) => <SidebarSkeleton key={i} />)
          ) : (
            filteredItems.map((item: any) => {
              if (activeTab === "surah") {
                const surah = item as Surah;
                return (
                  <SidebarItem
                    key={`surah-${surah.sura_no}`}
                    number={surah.sura_no}
                    title={surah.eng_name}
                    subtitle={surah.meaning}
                    arabicName={surah.sura_name}
                    isActive={currentSurahId === surah.sura_no}
                    href={`/surah/${surah.sura_no}`}
                    onClick={() => setIsOpen(false)}
                  />
                );
              }
              if (activeTab === "juz") {
                return (
                  <SidebarItem
                    key={`juz-${item.juz_no}`}
                    number={item.juz_no}
                    title={`Juz ${item.juz_no}`}
                    subtitle={`${item.first_surah_name} & More • ${item.surah_count} Surahs`}
                    isActive={false} // Handle Juz active state if needed
                    href={`/juz/${item.juz_no}`}
                    onClick={() => setIsOpen(false)}
                  />
                );
              }
              return (
                <SidebarItem
                  key={`page-${item.page_no}`}
                  number={item.page_no}
                  title={`Page ${item.page_no}`}
                  subtitle="Quran Madani Mushaf"
                  isActive={false}
                  href={`/page/${item.page_no}`}
                  onClick={() => setIsOpen(false)}
                />
              );
            })
          )}
          
          {filteredItems.length === 0 && !isLoadingSurahs && (
            <div className="text-center py-10">
              <p className="text-sm text-muted-foreground font-medium">No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
