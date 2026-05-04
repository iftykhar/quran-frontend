import React from "react";
import { getJuzById } from "@/lib/api";
import { QuranReader } from "./quran-reader";
import { notFound } from "next/navigation";

interface JuzReaderContainerProps {
  id: string;
}

export async function JuzReaderContainer({ id }: JuzReaderContainerProps) {
  const juzData = await getJuzById(id);

  if (!juzData) {
    notFound();
  }

  return <QuranReader initialData={juzData} id={id} type="juz" />;
}
