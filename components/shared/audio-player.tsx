"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { Play, Pause, X, SkipBack, SkipForward, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/provider/app-provider";
import { useQuery } from "@tanstack/react-query";
import { getSurahs } from "@/lib/api";
import { cn } from "@/lib/utils";

export function AudioPlayer() {
  const { playingAyahKey, isPlaying, playAyah, stopAyah, audioRef } = useSettings();
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [duration, setDuration] = useState("00:00");
  
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Fetch surahs to display the real name (e.g., "Al-Fatihah")
  const { data: surahs } = useQuery({
    queryKey: ["surahs"],
    queryFn: getSurahs,
  });

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const p = (audio.currentTime / audio.duration) * 100;
      setProgress(p || 0);
      setCurrentTime(formatTime(audio.currentTime));
      setDuration(formatTime(audio.duration));
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateProgress);
    
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateProgress);
    };
  }, [playingAyahKey, audioRef]);

  // Safely extract metadata and lookup surah name
  const metadata = useMemo(() => {
    if (!playingAyahKey) return null;
    const parts = playingAyahKey.split(":");
    if (parts.length < 2) return null;
    
    const [suraNo, ayahNo] = parts;
    const surah = surahs?.find(s => s.sura_no === parseInt(suraNo));
    
    return {
      suraNo,
      ayahNo,
      suraName: surah?.eng_name || `Surah ${suraNo}`
    };
  }, [playingAyahKey, surahs]);

  if (!metadata) return null;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    audio.currentTime = percentage * audio.duration;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-[#111111]/95 backdrop-blur-xl border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom duration-500">
      {/* Progress Bar Container - Smooth glide with CSS transitions */}
      <div 
        ref={progressBarRef}
        className="absolute -top-0.5 left-0 right-0 h-1 bg-white/5 cursor-pointer group"
        onClick={handleSeek}
      >
        <div 
          className="h-full bg-primary relative transition-all duration-300 ease-linear shadow-[0_0_15px_rgba(34,197,94,0.4)]"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform shadow-lg" />
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Left Side: Metadata (Matching Screenshot style) */}
        <div className="flex items-center gap-4 min-w-[150px] lg:min-w-[250px]">
          <div className="hidden sm:flex h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 items-center justify-center">
             <span className="text-primary font-bold text-xs">{metadata.suraNo}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground truncate max-w-[180px]">
              {metadata.suraName} : {metadata.ayahNo}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Madani Mushaf</span>
          </div>
        </div>

        {/* Center: Controls */}
        <div className="flex flex-col items-center gap-1 flex-1">
          <div className="flex items-center gap-2 sm:gap-6">
            <span className="text-[10px] font-mono text-muted-foreground/60 w-10 text-right">{currentTime}</span>
            
            <div className="flex items-center gap-1 sm:gap-4">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-muted-foreground/80 hover:text-foreground hover:bg-white/5 transition-colors">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
              
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-muted-foreground/80 hover:text-foreground hover:bg-white/5 transition-colors">
                <SkipBack className="h-5 w-5" />
              </Button>

              <Button 
                onClick={() => playingAyahKey && playAyah(playingAyahKey, "")}
                className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
              >
                {isPlaying ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current ml-1" />}
              </Button>

              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-muted-foreground/80 hover:text-foreground hover:bg-white/5 transition-colors">
                <SkipForward className="h-5 w-5" />
              </Button>

              <Button 
                onClick={stopAyah}
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-full text-muted-foreground/80 hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <span className="text-[10px] font-mono text-muted-foreground/60 w-10">{duration}</span>
          </div>
        </div>

        {/* Right Side: Status */}
        <div className="hidden md:flex items-center justify-end gap-4 min-w-[150px] lg:min-w-[250px]">
           <p className="text-[10px] text-muted-foreground/40 font-medium italic">Reading Study Learn...</p>
        </div>
      </div>
    </div>
  );
}
