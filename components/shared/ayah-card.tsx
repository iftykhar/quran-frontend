"use client";

import React, { useState, useRef } from "react";
import { Ayah } from "@/types/quran";
import { Play, Pause, Bookmark, Share2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AyahCardProps {
  ayah: Ayah;
  settings: {
    arabicFontSize: number;
    translationFontSize: number;
    activeFontFamily: string;
  };
}

export function AyahCard({ ayah, settings }: AyahCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const onEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="group relative p-8 rounded-3xl bg-card/50 border border-border/50 transition-all duration-300 hover:bg-card hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5">
      <audio 
        ref={audioRef} 
        src={ayah.audio_url} 
        onEnded={onEnded}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
      
      {/* Ayah Meta & Actions */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
            {ayah.ayah_no}
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10" onClick={togglePlay}>
              {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Arabic Text */}
      <div 
        className="text-right leading-relaxed mb-8"
        style={{ 
          fontSize: `${settings.arabicFontSize}px`,
          fontFamily: settings.activeFontFamily
        }}
      >
        {ayah.arabic_text}
      </div>

      {/* Translations */}
      <div className="space-y-4 pt-6 border-t border-border/50">
        <div 
          className="text-foreground/90 font-medium leading-relaxed font-bengali"
          style={{ fontSize: `${settings.translationFontSize}px` }}
        >
          {ayah.bengali_text}
        </div>
        <div 
          className="text-muted-foreground leading-relaxed"
          style={{ fontSize: `${settings.translationFontSize - 2}px` }}
        >
          {ayah.english_text}
        </div>
      </div>
    </div>
  );
}
