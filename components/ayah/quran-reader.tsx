"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Ayah, Surah } from "@/types/quran";
import { AyahCard } from "@/components/surah/ayah-card";
import { useSettings } from "@/provider/app-provider";
import { getSurahById, getJuzById, getPageById, SurahData, JuzData, PageData } from "@/lib/api";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ReaderType = "surah" | "juz" | "page";

interface QuranReaderProps {
  initialData: any;
  id: string;
  type: ReaderType;
}

export function QuranReader({ initialData, id, type }: QuranReaderProps) {
  const { 
    arabicFontSize, 
    translationFontSize, 
    activeFontFamily, 
    playFullSurah, 
    playAyah,
    playbackMode,
    setPlaybackMode,
    playingAyahKey 
  } = useSettings();
  const [ayahs, setAyahs] = useState<Ayah[]>(initialData.ayahs);
  const [bismillah, setBismillah] = useState<Ayah | null>((initialData as any).bismillah || null);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialData.ayahs.length >= 20);
  const observerTarget = useRef<HTMLDivElement>(null);

  // ... (fetcher and other hooks) ...

  const handlePlayFullSurah = () => {
    if (bismillah) {
      // Start with bismillah (ayah 0)
      playAyah(`${bismillah.sura_no}:0`, bismillah.audio_url || "");
      setPlaybackMode("surah");
    } else {
      // Regular start from ayah 1
      const surahId = parseInt(id);
      playFullSurah(surahId);
    }
  };

  const fetcher = useCallback(async (nextPage: number) => {
    switch (type) {
      case "surah": return getSurahById(id, nextPage, 20);
      case "juz": return getJuzById(id, nextPage, 20);
      case "page": return getPageById(id, nextPage, 20);
      default: return null;
    }
  }, [id, type]);

  // Listen for auto-play next event from AppProvider
  useEffect(() => {
    const handleNext = async (e: any) => {
      const { surahId, ayahId } = e.detail;
      const nextAyahId = ayahId + 1;
      const nextKey = `${surahId}:${nextAyahId}`;
      
      // Find if we have the next ayah in current list
      const nextAyahExists = ayahs.find(a => a.ayah_no === nextAyahId);
      
      if (!nextAyahExists && hasMore) {
        // Load next page if needed
        setIsLoadingMore(true);
        const data = await fetcher(page + 1);
        if (data && data.ayahs.length > 0) {
          setAyahs(prev => [...prev, ...data.ayahs]);
          setPage(prev => prev + 1);
          if (data.ayahs.length < 20) setHasMore(false);
        }
        setIsLoadingMore(false);
      }

      // Construct URL and play
      const s = surahId.toString().padStart(3, '0');
      const a = nextAyahId.toString().padStart(3, '0');
      const url = `https://everyayah.com/data/Mishary_Rashid_Alafasy_24kbps/${s}${a}.mp3`;
      
      // We only play if the surah hasn't ended (this is a simple check, better to check total_ayat)
      // For now, if the fetch fails or we run out of ayahs, it will just stop
      playAyah(nextKey, url);
    };

    window.addEventListener("play-next-ayah", handleNext);
    return () => window.removeEventListener("play-next-ayah", handleNext);
  }, [ayahs, page, hasMore, fetcher, playAyah]);

  // Auto-scroll to active ayah during continuous playback
  useEffect(() => {
    if (playbackMode === "surah" && playingAyahKey) {
      const ayahNo = parseInt(playingAyahKey.split(":")[1]);
      const el = document.getElementById(`ayah-${ayahNo}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [playingAyahKey, playbackMode]);


  const loadMoreAyahs = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;
    const data = await fetcher(nextPage);

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
  }, [fetcher, page, isLoadingMore, hasMore]);

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

  useEffect(() => {
    setAyahs(initialData.ayahs);
    setPage(1);
    setHasMore(initialData.ayahs.length >= 20);

    // Handle Jump to Ayah from Hash
    const handleInitialJump = async () => {
      const hash = window.location.hash;
      if (hash.startsWith("#ayah-")) {
        const ayahNo = parseInt(hash.replace("#ayah-", ""));
        
        // If the ayah is beyond current loaded set
        if (ayahNo > initialData.ayahs.length) {
          setIsLoadingMore(true);
          const targetPage = Math.ceil(ayahNo / 20);
          
          const fetchPromises = [];
          for (let p = 2; p <= targetPage; p++) {
            fetchPromises.push(fetcher(p));
          }
          
          const results = await Promise.all(fetchPromises);
          const extraAyahs = results.flatMap(r => r?.ayahs || []);
          
          setAyahs(prev => [...prev, ...extraAyahs]);
          setPage(targetPage);
          if (results.length > 0 && (results[results.length - 1]?.ayahs?.length || 0) < 20) {
            setHasMore(false);
          }
          setIsLoadingMore(false);
          
          // Wait for DOM to update then scroll
          setTimeout(() => {
            const el = document.getElementById(`ayah-${ayahNo}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 500);
        } else {
          // It's in the first page, just scroll
          setTimeout(() => {
            const el = document.getElementById(`ayah-${ayahNo}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 500);
        }
      }
    };

    handleInitialJump();
  }, [id, initialData, fetcher]);

  // Handle Hash Changes (Universal Observer)
  useEffect(() => {
    const handleJumpAction = async () => {
      const hash = window.location.hash;
      if (!hash.startsWith("#ayah-")) return;
      
      const ayahNo = parseInt(hash.replace("#ayah-", ""));
      const el = document.getElementById(`ayah-${ayahNo}`);

      if (el) {
        // Element exists, scroll to it
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (hasMore) {
        // Element doesn't exist, calculate page and fetch
        const targetPage = Math.ceil(ayahNo / 20);
        if (targetPage > page) {
          setIsLoadingMore(true);
          const fetchPromises = [];
          for (let p = page + 1; p <= targetPage; p++) {
            fetchPromises.push(fetcher(p));
          }
          const results = await Promise.all(fetchPromises);
          const extraAyahs = results.flatMap(r => r?.ayahs || []);
          setAyahs(prev => [...prev, ...extraAyahs]);
          setPage(targetPage);
          if (results.length > 0 && (results[results.length - 1]?.ayahs?.length || 0) < 20) {
            setHasMore(false);
          }
          setIsLoadingMore(false);
          
          // Retry scrolling after state update
          setTimeout(() => {
            const newEl = document.getElementById(`ayah-${ayahNo}`);
            if (newEl) newEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 600);
        }
      }
    };

    // Listen for both hashchange events and manual triggers
    window.addEventListener("hashchange", handleJumpAction);
    
    // Periodically check hash for a few seconds after a page change 
    // to catch Next.js client-side navigations that might miss the event
    const interval = setInterval(handleJumpAction, 1000);
    setTimeout(() => clearInterval(interval), 5000);

    return () => {
      window.removeEventListener("hashchange", handleJumpAction);
      clearInterval(interval);
    };
  }, [ayahs, page, hasMore, fetcher, id]); // Added id as dependency

  const currentPageNo = parseInt(id, 10);

  const renderHeader = () => {
    if (type === "surah") {
      const { surah } = initialData as SurahData;
      return (
        <div className="mb-14 text-center space-y-6">
          <div className="flex items-center justify-center gap-4">
            <div className="inline-block px-8 py-3 rounded-full bg-primary/10 text-primary font-bold text-sm tracking-wide border border-primary/20 shadow-lg">
              Surah {surah?.eng_name}
            </div>
            <button
              onClick={handlePlayFullSurah}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20"
            >
              <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary-foreground text-primary">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              Play Surah
            </button>
          </div>
          <div className="space-y-4">
            <h1 className="font-quran text-6xl text-foreground leading-tight">{surah?.sura_name}</h1>
            <p className="text-xl font-bold text-muted-foreground uppercase tracking-[0.2em]">{surah?.eng_name}</p>
          </div>
          
          {/* Bismillah Preamble */}
          {bismillah && (
            <div className="pt-12 pb-6">
              <p className="font-quran text-4xl text-foreground/90 text-center tracking-wide">
                {bismillah.arabic_text}
              </p>
            </div>
          )}
          <div className="flex items-center justify-center gap-4 text-[#8BA1B3] text-xs font-bold uppercase tracking-widest">
            <span>{surah?.revelation_place}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
            <span>{surah?.total_ayat} Verses</span>
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
            <span>Para {surah?.para}</span>
          </div>
        </div>
      );
    }

    if (type === "juz") {
      const { juz } = initialData as JuzData;
      return (
        <div className="mb-14 text-center space-y-6">
          <div className="inline-block px-8 py-3 rounded-full bg-[#132313] text-primary font-bold text-sm tracking-wide border border-primary/20 shadow-lg">
            Juz {juz?.juz_no}
          </div>
          <div className="space-y-2">
            <h1 className="font-bold text-4xl text-foreground">Juz {juz?.juz_no}</h1>
            <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
              Contains {juz?.surah_count} Surahs
            </p>
          </div>
        </div>
      );
    }

    // Page type - show surah names and prev/next navigation
    const pageData = initialData as PageData;
    const surahNames = pageData.surahs?.map(s => s.eng_name).join(' \u2022 ') || '';
    return (
      <div className="mb-14 text-center space-y-6">
        <div className="inline-block px-8 py-3 rounded-full bg-[#132313] text-primary font-bold text-sm tracking-wide border border-primary/20 shadow-lg">
          Page {id}
        </div>
        <div className="space-y-2">
          <h1 className="font-bold text-4xl text-foreground">Page {id}</h1>
          <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
            {surahNames || 'Mushaf Al-Madina'}
          </p>
        </div>
        {/* Prev / Next Page Navigation */}
        <div className="flex items-center justify-center gap-4 pt-2">
          {currentPageNo > 1 && (
            <Link
              href={`/page/${currentPageNo - 1}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-300"
            >
              <ChevronLeft className="h-4 w-4" />
              Page {currentPageNo - 1}
            </Link>
          )}
          {currentPageNo < 604 && (
            <Link
              href={`/page/${currentPageNo + 1}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-300"
            >
              Page {currentPageNo + 1}
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {renderHeader()}

      <div className="flex flex-col gap-4">
        {ayahs.map((ayah) => (
          <AyahCard 
            key={`${ayah.sura_no}-${ayah.ayah_no}`} 
            ayah={ayah} 
            settings={{ arabicFontSize, translationFontSize, activeFontFamily }}
          />
        ))}
      </div>

      {/* Bottom navigation for page type */}
      {type === "page" && (
        <div className="flex items-center justify-between mt-10 pt-8 border-t border-[#2A2A2A]">
          {currentPageNo > 1 ? (
            <Link
              href={`/page/${currentPageNo - 1}`}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] text-sm font-bold text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-[#1E1E1E] transition-all duration-300"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous Page
            </Link>
          ) : <div />}
          {currentPageNo < 604 ? (
            <Link
              href={`/page/${currentPageNo + 1}`}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] text-sm font-bold text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-[#1E1E1E] transition-all duration-300"
            >
              Next Page
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : <div />}
        </div>
      )}

      <div ref={observerTarget} className="h-20 flex items-center justify-center">
        {isLoadingMore && (
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        )}
      </div>
    </div>
  );
}
