"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Surah } from "@/types/quran";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";

const API_BASE_URL = "http://localhost:5000/api/v1/quran";

export function SurahSidebar() {
  const [activeTab, setActiveTab] = useState<"surah" | "juz" | "page">("surah");
  const [searchQuery, setSearchQuery] = useState("");
  const params = useParams();
  const currentSurahId = params.id ? parseInt(params.id as string) : null;

  const { data: surahs, isLoading } = useQuery({
    queryKey: ["surahs"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/surahs`);
      return response.data.data as Surah[];
    },
  });

  const filteredSurahs = surahs?.filter(
    (s) =>
      s.eng_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sura_no.toString().includes(searchQuery)
  );

  return (
    <div className="fixed left-20 top-20 flex h-[calc(100vh-80px)] w-80 flex-col border-r border-border bg-background">
      <div className="p-4 space-y-4">
        {/* Tab Switcher */}
        <div className="flex p-1 bg-card rounded-xl border border-border">
          {["surah", "juz", "page"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "flex-1 py-2 text-xs font-semibold capitalize rounded-lg transition-all",
                activeTab === tab
                  ? "bg-muted text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search Surah"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-muted/50 border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Surah List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 custom-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          filteredSurahs?.map((surah) => {
            const isActive = currentSurahId === surah.sura_no;
            return (
              <Link
                key={surah.sura_no}
                href={`/surah/${surah.sura_no}`}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 group",
                  isActive
                    ? "bg-card border-primary/50 shadow-sm"
                    : "bg-card/30 border-transparent hover:bg-card hover:border-border"
                )}
              >
                {/* Surah Number Hexagon */}
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                  <div 
                    className={cn(
                      "absolute inset-0 rotate-45 rounded-lg transition-colors",
                      isActive ? "bg-primary" : "bg-muted group-hover:bg-muted-foreground/20"
                    )} 
                  />
                  <span className={cn(
                    "relative text-xs font-bold",
                    isActive ? "text-white" : "text-foreground"
                  )}>
                    {surah.sura_no}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className={cn(
                    "text-sm font-bold truncate transition-colors",
                    isActive ? "text-primary" : "text-foreground group-hover:text-primary"
                  )}>
                    {surah.eng_name}
                  </h4>
                  <p className="text-[10px] text-muted-foreground truncate font-medium">
                    {surah.meaning}
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-quran text-lg leading-none">
                    {surah.sura_name}
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
