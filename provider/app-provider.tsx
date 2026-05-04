"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Navbar } from "@/components/shared/navbar";
import { IconSidebar } from "@/components/shared/icon-sidebar";
import { AudioPlayer } from "@/components/shared/audio-player";
import { cn } from "@/lib/utils";

interface SettingsContextType {
  arabicFontSize: number;
  translationFontSize: number;
  activeFontFamily: string;
  setArabicFontSize: (size: number) => void;
  setTranslationFontSize: (size: number) => void;
  setActiveFontFamily: (family: string) => void;
  playingAyahKey: string | null;
  isPlaying: boolean;
  playAyah: (key: string, url: string) => void;
  stopAyah: () => void;
  bookmarks: any[];
  addBookmark: (ayah: any) => void;
  removeBookmark: (key: string) => void;
  isBookmarked: (key: string) => boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  const [arabicFontSize, setArabicFontSize] = useState(24);
  const [translationFontSize, setTranslationFontSize] = useState(16);
  const [activeFontFamily, setActiveFontFamily] = useState("KFGQPC Uthman Taha Naskh");

  // Global Audio State
  const [playingAyahKey, setPlayingAyahKey] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const stopAyah = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setPlayingAyahKey(null);
  };

  const playAyah = (key: string, url: string) => {
    if (playingAyahKey === key) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
      return;
    }

    // Stop current audio if any
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(url);
    audioRef.current = audio;
    setPlayingAyahKey(key);
    setIsPlaying(true);

    audio.play().catch((err) => {
      console.error("Audio play failed:", err);
      setIsPlaying(false);
      setPlayingAyahKey(null);
    });

    audio.onended = () => {
      setIsPlaying(false);
      setPlayingAyahKey(null);
    };

    audio.onpause = () => setIsPlaying(false);
    audio.onplay = () => setIsPlaying(true);
  };

  // Bookmarks State
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  const addBookmark = (ayah: any) => {
    const key = `${ayah.sura_no}:${ayah.ayah_no}`;
    if (!isBookmarked(key)) {
      setBookmarks((prev) => [...prev, { ...ayah, id: key }]);
    }
  };

  const removeBookmark = (key: string) => {
    setBookmarks((prev) => prev.filter((b) => `${b.sura_no}:${b.ayah_no}` !== key));
  };

  const isBookmarked = (key: string) => {
    return bookmarks.some((b) => `${b.sura_no}:${b.ayah_no}` === key);
  };

  // Load from localStorage
  useEffect(() => {
    const savedArabicSize = localStorage.getItem("arabicFontSize");
    const savedTranslationSize = localStorage.getItem("translationFontSize");
    const savedFontFamily = localStorage.getItem("activeFontFamily");
    const savedBookmarks = localStorage.getItem("quran_bookmarks");

    if (savedArabicSize) setArabicFontSize(parseInt(savedArabicSize));
    if (savedTranslationSize) setTranslationFontSize(parseInt(savedTranslationSize));
    if (savedFontFamily) setActiveFontFamily(savedFontFamily);
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("arabicFontSize", arabicFontSize.toString());
    localStorage.setItem("translationFontSize", translationFontSize.toString());
    localStorage.setItem("activeFontFamily", activeFontFamily);
    localStorage.setItem("quran_bookmarks", JSON.stringify(bookmarks));
  }, [arabicFontSize, translationFontSize, activeFontFamily, bookmarks]);

  const pathname = usePathname();
  const currentLocale = useLocale();

  const hideNavAndFooter = [`/${currentLocale}/auth/login`, `/${currentLocale}/auth/signup`]

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsContext.Provider
        value={{
          arabicFontSize,
          translationFontSize,
          activeFontFamily,
          setArabicFontSize,
          setTranslationFontSize,
          setActiveFontFamily,
          playingAyahKey,
          isPlaying,
          playAyah,
          stopAyah,
          bookmarks,
          addBookmark,
          removeBookmark,
          isBookmarked,
          audioRef,
        }}
      >
        <div className="flex min-h-screen bg-background">
          <IconSidebar />
          <div className="flex-1 lg:pl-20 pb-16 lg:pb-0 flex flex-col">
            {!hideNavAndFooter.includes(pathname) && <Navbar />}
            <main className={cn("flex-1", playingAyahKey && "pb-20")}>
              {children}
            </main>
          </div>
          <AudioPlayer />
        </div>
      </SettingsContext.Provider>
    </QueryClientProvider>
  );
}
