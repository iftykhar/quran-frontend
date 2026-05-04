"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Ayah, Surah } from "@/types/quran";
import { AyahCard } from "@/components/surah/ayah-card";
import { useSettings } from "@/provider/app-provider";
import { getSurahById } from "@/lib/api";

interface SurahReaderProps {
  initialData: { surah: Surah; ayahs: Ayah[] };
  id: string;
}

import { QuranReader } from "../ayah/quran-reader";

export function SurahReader({ initialData, id }: SurahReaderProps) {
  return <QuranReader initialData={initialData} id={id} type="surah" />;
}
