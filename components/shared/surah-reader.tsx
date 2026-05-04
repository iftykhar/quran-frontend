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
      <div className="mb-10 text-center space-y-4">
        <div className="inline-block px-6 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm">
          Surah {surah?.eng_name}
        </div>
        <h1 className="font-quran text-5xl text-foreground">
          {surah?.sura_name}
        </h1>
        <div className="flex items-center justify-center gap-6 text-muted-foreground text-sm font-medium">
          <span>{surah?.meaning}</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground" />
          <span>{surah?.total_ayat} Verses</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground" />
          <span>Para {surah?.para}</span>
        </div>
        
        <div className="flex justify-center pt-4">
          <div className="h-[1px] w-40 bg-gradient-to-r from-transparent via-border to-transparent" />
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
