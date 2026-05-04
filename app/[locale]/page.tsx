"use client";

import { getSurahs } from "@/lib/api";
import { HeroSection } from "@/components/home/hero-section";
import { SurahGrid } from "@/components/home/surah-grid";
import React from "react";

// Use client side state for search filtering
export default function Home() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [surahs, setSurahs] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      const data = await getSurahs();
      setSurahs(data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <HeroSection onSearch={setSearchQuery} />
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <SurahGrid surahs={surahs} searchQuery={searchQuery} />
      )}
    </main>
  );
}
