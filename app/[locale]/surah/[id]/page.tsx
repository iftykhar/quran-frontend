import React, { Suspense } from "react";
import { getSurahs } from "@/lib/api";
import { SurahReaderContainer } from "@/components/shared/surah-reader-container";

export async function generateStaticParams() {
  const surahs = await getSurahs();
  return surahs.map((surah) => ({
    id: surah.sura_no.toString(),
  }));
}

export default async function SurahPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading Surah...</div>}>
      <SurahReaderContainer id={id} />
    </Suspense>
  );
}
