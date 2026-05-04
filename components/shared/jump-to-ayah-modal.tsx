"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Surah } from "@/types/quran";
import { getSurahs } from "@/lib/api";
import { useRouter } from "next/navigation";

export function JumpToAyahModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [selectedAyah, setSelectedAyah] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSurahs() {
      const data = await getSurahs();
      setSurahs(data);
      if (data.length > 0) setSelectedSurah(data[0]);
      setIsLoading(false);
    }
    if (isOpen) loadSurahs();
  }, [isOpen]);

  const handleJump = (type: "ayah" | "tafsir") => {
    if (!selectedSurah) return;
    onClose();
    // Navigation logic
    router.push(`/surah/${selectedSurah.sura_no}#ayah-${selectedAyah}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-[#0F0F0F] border border-[#1F1F1F] rounded-[32px] shadow-2xl overflow-hidden">
        <div className="p-8 space-y-8">
          <div className="flex items-center justify-center relative">
            <h2 className="text-xl font-bold text-foreground">Jump to Ayah/Tafsir</h2>
            <button onClick={onClose} className="absolute right-0 p-2 hover:bg-[#1A1A1A] rounded-full transition-colors">
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Surah Select */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-muted-foreground ml-1">Select Surah</label>
              <div className="relative group">
                <select 
                  className="w-full h-14 bg-[#111111] border border-[#1F1F1F] rounded-2xl px-6 appearance-none text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                  value={selectedSurah?.sura_no || ""}
                  onChange={(e) => {
                    const s = surahs.find(surah => surah.sura_no === parseInt(e.target.value));
                    setSelectedSurah(s || null);
                    setSelectedAyah(1);
                  }}
                >
                  {surahs.map(s => (
                    <option key={s.sura_no} value={s.sura_no}>{s.eng_name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors" />
              </div>
            </div>

            {/* Ayah Select */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-muted-foreground ml-1">Select Ayah</label>
              <div className="relative group">
                <input 
                  type="number"
                  min={1}
                  max={selectedSurah?.total_ayat || 1}
                  placeholder={selectedSurah ? `01 - ${selectedSurah.total_ayat}` : "Select a surah"}
                  className="w-full h-14 bg-[#111111] border border-[#1F1F1F] rounded-2xl px-6 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/30"
                  value={selectedAyah}
                  onChange={(e) => setSelectedAyah(parseInt(e.target.value) || 1)}
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground uppercase tracking-widest pointer-events-none">
                  {selectedSurah ? `Max ${selectedSurah.total_ayat}` : ""}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex h-20">
          <button 
            onClick={() => handleJump("tafsir")}
            className="flex-1 bg-[#1A1A1A] hover:bg-[#222222] text-foreground font-bold text-sm transition-all border-r border-[#1F1F1F]"
          >
            Jump To Tafsir
          </button>
          <button 
            onClick={() => handleJump("ayah")}
            className="flex-1 bg-[#2E4A2E] hover:bg-[#3A5A3A] text-[#4ADE80] font-bold text-sm transition-all"
          >
            Jump To Ayah
          </button>
        </div>
      </div>
    </div>
  );
}
