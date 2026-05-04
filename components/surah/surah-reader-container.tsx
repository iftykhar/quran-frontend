import React from "react";
import { getSurahById } from "@/lib/api";
import { SurahReader } from "./surah-reader";
import { notFound } from "next/navigation";

interface SurahReaderContainerProps {
  id: string;
}

export async function SurahReaderContainer({ id }: SurahReaderContainerProps) {
  const surahData = await getSurahById(id);

  if (!surahData) {
    notFound();
  }

  return <SurahReader initialData={surahData} id={id} />;
}
