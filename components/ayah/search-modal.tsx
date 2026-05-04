"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, History, Compass, Book, Hash, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { navigationSearch, textSearch } from "@/lib/api";

interface SearchResult {
  type: "surah" | "juz" | "page" | "ayah";
  id: number;
  title: string;
  subtitle: string;
  arabic?: string;
  surah_id?: number;
}

export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentNav, setRecentNav] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load recent navigation from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recent_nav");
    if (saved) {
      setRecentNav(JSON.parse(saved));
    }
  }, [isOpen]);

  const addToRecent = (item: SearchResult) => {
    const updated = [item, ...recentNav.filter((r) => r.id !== item.id || r.type !== item.type)].slice(0, 5);
    setRecentNav(updated);
    localStorage.setItem("recent_nav", JSON.stringify(updated));
  };

  const handleSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    // Fetch both navigation and text search
    const [navData, textData] = await Promise.all([
      navigationSearch(q),
      q.length > 3 ? textSearch(q) : Promise.resolve([])
    ]);

    const formattedTextResults = textData.map((t: any) => ({
      type: "ayah",
      id: t.ayah_number,
      surah_id: t.surah_id,
      title: `${t.eng_name} ${t.surah_id}:${t.ayah_number}`,
      subtitle: t.matched_text,
      arabic: t.arabic_text
    }));

    setResults([...navData, ...formattedTextResults]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  const handleSelect = (item: any) => {
    addToRecent(item);
    onClose();
    if (item.type === "surah") router.push(`/surah/${item.id}`);
    if (item.type === "juz") router.push(`/juz/${item.id}`);
    if (item.type === "page") router.push(`/page/${item.id}`);
    if (item.type === "ayah") router.push(`/surah/${item.surah_id}#ayah-${item.id}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-[#0F0F0F] border border-[#1F1F1F] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Header */}
        <div className="flex items-center px-6 py-5 border-b border-[#1F1F1F]">
          <Search className="h-5 w-5 text-muted-foreground mr-4" />
          <input
            autoFocus
            type="text"
            placeholder="Find wisdom in the Quran (Surah, Juz, or text...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && onClose()}
            className="flex-1 bg-transparent border-none outline-none text-lg text-foreground placeholder:text-muted-foreground/40"
          />
          <div className="flex items-center gap-3">
            <div className="px-2 py-1 bg-[#1A1A1A] rounded-md text-[10px] text-muted-foreground font-mono">ESC</div>
            <button onClick={onClose} className="p-1 hover:bg-[#1A1A1A] rounded-full transition-colors">
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Search Body */}
        <div className="flex-1 overflow-y-auto max-h-[60vh] p-4 custom-scrollbar">
          {!query && (
            <div className="space-y-8 p-2">
              {/* Try to Navigate */}
              <section>
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 px-2">
                  Try to navigate
                </h4>
                <div className="flex flex-wrap gap-2 px-2">
                  {[
                    { type: "surah", id: 1, title: "Al-Fatiha" },
                    { type: "juz", id: 30, title: "Juz 30" },
                    { type: "surah", id: 36, title: "Surah Yasin" },
                    { type: "page", id: 1, title: "Page 1" },
                  ].map((item) => (
                    <button
                      key={item.id + item.type}
                      onClick={() => handleSelect(item)}
                      className="px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              </section>

              {/* Recent Navigation */}
              <section>
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-2 flex items-center gap-2">
                  <History className="h-3 w-3" />
                  Recent Navigation
                </h4>
                {recentNav.length > 0 ? (
                  <div className="space-y-1">
                    {recentNav.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelect(item)}
                        className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-[#1A1A1A] transition-all group"
                      >
                        <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#1A1A1A] text-muted-foreground group-hover:text-primary">
                          {item.type === "surah" && <Book className="h-4 w-4" />}
                          {item.type === "juz" && <Compass className="h-4 w-4" />}
                          {item.type === "page" && <Hash className="h-4 w-4" />}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-foreground">{item.title}</p>
                          <p className="text-[10px] text-muted-foreground">{item.subtitle}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground/60 px-2 py-4 text-center">No recent navigation</p>
                )}
              </section>
            </div>
          )}

          {query && (
            <div className="space-y-1">
              {results.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-[#1A1A1A] transition-all group border border-transparent hover:border-[#2A2A2A]"
                >
                  <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-[#1A1A1A] text-muted-foreground group-hover:text-primary transition-colors">
                    {item.type === "surah" && <Book className="h-5 w-5" />}
                    {item.type === "juz" && <Compass className="h-5 w-5" />}
                    {item.type === "page" && <Hash className="h-5 w-5" />}
                    {item.type === "ayah" && <Search className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-bold text-foreground flex items-center gap-2">
                      {item.title}
                      {item.type === "ayah" && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">Ayah</span>}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{item.subtitle}</p>
                  </div>
                  {item.arabic && (
                    <span className="font-quran text-lg text-foreground/60 group-hover:text-primary ml-2">
                      {item.arabic}
                    </span>
                  )}
                </button>
              ))}
              
              {isLoading && results.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <p className="text-sm text-muted-foreground animate-pulse">Searching the heavens...</p>
                </div>
              )}

              {!isLoading && results.length === 0 && query && (
                <div className="py-20 text-center">
                  <p className="text-muted-foreground">No matches found for "{query}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0A0A0A] border-t border-[#1F1F1F] flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 bg-[#1F1F1F] rounded">↑↓</span> Navigate
            </span>
            <span className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 bg-[#1F1F1F] rounded">ENTER</span> Select
            </span>
          </div>
          <p>Global Search v1.0</p>
        </div>
      </div>
    </div>
  );
}
