"use client";

import React from "react";
import { useSettings } from "@/provider/app-provider";
import { AyahCard } from "@/components/shared/ayah-card";
import { Bookmark, Search } from "lucide-react";
import Link from "next/link";

export default function BookmarksPage() {
  const { bookmarks, arabicFontSize, translationFontSize, activeFontFamily } = useSettings();

  return (
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <div className="flex flex-col gap-8 mb-12">
        <div className="flex items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-foreground tracking-tight flex items-center gap-4">
              <Bookmark className="h-10 w-10 text-primary" />
              Bookmarks
            </h1>
            <p className="text-muted-foreground font-medium">Your saved ayahs and reflections</p>
          </div>
          
          <div className="text-right hidden sm:block">
            <div className="text-3xl font-bold text-foreground">{bookmarks.length}</div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Saved Ayahs</div>
          </div>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
          <div className="h-24 w-24 rounded-full bg-[#111111] border border-[#222222] flex items-center justify-center">
            <Bookmark className="h-10 w-10 text-muted-foreground/40" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">No bookmarks yet</h3>
            <p className="text-muted-foreground max-w-xs mx-auto">
              Save your favorite ayahs to access them quickly here.
            </p>
          </div>
          <Link
            href="/surah"
            className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-lg shadow-primary/20"
          >
            <Search className="h-5 w-5" />
            Explore Quran
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {bookmarks.map((ayah) => (
            <AyahCard
              key={`${ayah.sura_no}-${ayah.ayah_no}`}
              ayah={ayah}
              settings={{ arabicFontSize, translationFontSize, activeFontFamily }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
