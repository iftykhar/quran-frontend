"use client";

import React from "react";
import { Ayah, Surah } from "@/types/quran";
import { AyahCard } from "@/components/shared/ayah-card";
import { useSettings } from "@/provider/app-provider";

interface SurahReaderProps {
  initialData: { surah: Surah; ayahs: Ayah[] };
  id: string;
}

export function SurahReader({ initialData }: SurahReaderProps) {
  const { arabicFontSize, translationFontSize, activeFontFamily } = useSettings();
  const { surah, ayahs } = initialData;

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
            key={ayah.ayah_no} 
            ayah={ayah} 
            settings={{ arabicFontSize, translationFontSize, activeFontFamily }}
          />
        ))}
      </div>
    </div>
  );
}
