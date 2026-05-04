"use client";

import React, { useState } from "react";
import { Ayah } from "@/types/quran";
import { Play, Pause, Bookmark, Copy, MoreHorizontal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, getAyahAudioUrl } from "@/lib/utils";
import { useSettings } from "@/provider/app-provider";

interface AyahCardProps {
  ayah: Ayah;
  settings: {
    arabicFontSize: number;
    translationFontSize: number;
    activeFontFamily: string;
  };
}

export function AyahCard({ ayah, settings }: AyahCardProps) {
  const { playingAyahKey, isPlaying, playAyah, addBookmark, removeBookmark, isBookmarked } = useSettings();
  const [isLoading, setIsLoading] = useState(false);
  
  const ayahKey = `${ayah.sura_no}:${ayah.ayah_no}`;
  const isCurrentPlaying = playingAyahKey === ayahKey;
  
  const handlePlay = async () => {
    if (isCurrentPlaying && isPlaying) {
      playAyah(ayahKey, ""); // This will toggle pause in AppProvider
      return;
    }

    setIsLoading(true);
    const audioUrl = getAyahAudioUrl(ayah.sura_no, ayah.ayah_no);
    
    // Test if audio exists, else fallback
    try {
      const response = await fetch(audioUrl, { method: "HEAD" });
      if (response.ok) {
        playAyah(ayahKey, audioUrl);
      } else {
        console.warn(`EveryAyah audio failed for ${ayahKey}, falling back to database link.`);
        playAyah(ayahKey, ayah.audio_url);
      }
    } catch (error) {
      console.error("Audio fetch error:", error);
      playAyah(ayahKey, ayah.audio_url);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="group flex gap-8 p-8 rounded-3xl bg-card/30 border border-border/40 transition-all duration-300 hover:bg-card/50 hover:border-primary/20">
      {/* Left Column: Actions */}
      <div className="flex flex-col items-center gap-4 w-12 pt-2">
        <span className="text-primary font-bold text-lg whitespace-nowrap">
          {ayah.ayah_no === 0 ? "Bismillah" : `${ayah.sura_no}:${ayah.ayah_no}`}
        </span>
        
        <div className="flex flex-col gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-10 w-10 rounded-full transition-all",
              isCurrentPlaying ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
            )}
            onClick={handlePlay}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isCurrentPlaying && isPlaying ? (
              <Pause className="h-5 w-5 fill-current" />
            ) : (
              <Play className="h-5 w-5 fill-current" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-10 w-10 rounded-full transition-all",
              isBookmarked(`${ayah.sura_no}:${ayah.ayah_no}`) ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
            )}
            onClick={() => {
              const key = `${ayah.sura_no}:${ayah.ayah_no}`;
              if (isBookmarked(key)) {
                removeBookmark(key);
              } else {
                addBookmark(ayah);
              }
            }}
          >
            <Bookmark className={cn("h-5 w-5", isBookmarked(`${ayah.sura_no}:${ayah.ayah_no}`) && "fill-current")} />
          </Button>
          
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5">
            <Copy className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Right Column: Content */}
      <div className="flex-1 space-y-8">
        {/* Arabic Text */}
        <div 
          className="text-right leading-[2.5] mb-8 text-foreground"
          style={{ 
            fontSize: `${settings.arabicFontSize}px`,
            fontFamily: settings.activeFontFamily
          }}
        >
          {ayah.arabic_text}
          <span className="inline-flex items-center justify-center px-3 h-10 ml-4 rounded-full border border-primary/30 text-[10px] font-bold text-primary font-sans align-middle uppercase">
            {ayah.ayah_no === 0 ? "Bismillah" : ayah.ayah_no}
          </span>
        </div>

        {/* Translations */}
        <div className="space-y-6">
          <div className="space-y-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">SAHEEH INTERNATIONAL</p>
            <div 
              className="text-foreground/90 leading-relaxed"
              style={{ fontSize: `${settings.translationFontSize}px` }}
            >
              {ayah.english_text}
            </div>
          </div>

          <div className="space-y-1">
             <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Bengali</p>
            <div 
              className="text-foreground/90 font-medium leading-relaxed font-bengali"
              style={{ fontSize: `${settings.translationFontSize}px` }}
            >
              {ayah.bengali_text}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
