"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Ayah, Surah } from "@/types/quran";
import { AyahCard } from "@/components/shared/ayah-card";
import { useSettings } from "@/provider/app-provider";
import { getSurahById } from "@/lib/api";

interface SurahReaderProps {
  initialData: { surah: Surah; ayahs: Ayah[] };
  id: string;
}

export function SurahReader({ initialData, id }: SurahReaderProps) {
  const { arabicFontSize, translationFontSize, activeFontFamily } = useSettings();
  const [ayahs, setAyahs] = useState<Ayah[]>(initialData.ayahs);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialData.ayahs.length >= 20);
  const observerTarget = useRef<HTMLDivElement>(null);

  const { surah } = initialData;

  const loadMoreAyahs = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;
    const data = await getSurahById(id, nextPage, 20);

    if (data && data.ayahs.length > 0) {
      setAyahs((prev) => [...prev, ...data.ayahs]);
      setPage(nextPage);
      if (data.ayahs.length < 20) {
        setHasMore(false);
      }
    } else {
      setHasMore(false);
    }
    setIsLoadingMore(false);
  }, [id, page, isLoadingMore, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreAyahs();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMoreAyahs, hasMore]);

  // Reset state when surah changes
  useEffect(() => {
    setAyahs(initialData.ayahs);
    setPage(1);
    setHasMore(initialData.ayahs.length >= 20);
  }, [id, initialData]);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Surah Header */}
      <div className="mb-14 text-center space-y-6">
        <div className="inline-block px-8 py-3 rounded-full bg-[#132313] text-primary font-bold text-sm tracking-wide border border-primary/20 shadow-lg">
          Surah {surah?.eng_name}
        </div>
        
        <div className="space-y-2">
          <h1 className="font-quran text-6xl text-foreground leading-tight">
            {surah?.sura_name}
          </h1>
          {/* <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
            Ayah-{surah?.total_ayat}, {surah?.revelation_place}
          </p> */}
        </div>

        <div className="flex items-center justify-center gap-4 text-[#8BA1B3] text-xs font-bold uppercase tracking-widest">
          <span>{surah?.revelation_place}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
          <span>{surah?.total_ayat} Verses</span>
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
          <span>Para {surah?.para}</span>
        </div>
        
        <div className="flex justify-center pt-4">
          <div className="h-[1px] w-64 bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        </div>
      </div>

      {/* Ayah List */}
      <div className="flex flex-col gap-4">
        {ayahs.map((ayah) => (
          <AyahCard 
            key={`${ayah.sura_no}-${ayah.ayah_no}`} 
            ayah={ayah} 
            settings={{ arabicFontSize, translationFontSize, activeFontFamily }}
          />
        ))}
      </div>

      {/* Infinite Scroll Trigger */}
      <div ref={observerTarget} className="h-20 flex items-center justify-center">
        {isLoadingMore && (
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        )}
      </div>
    </div>
  );
}
