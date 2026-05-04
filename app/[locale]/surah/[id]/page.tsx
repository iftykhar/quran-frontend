import React from "react";
import axios from "axios";
import { SurahReader } from "@/components/shared/surah-reader";

// const API_BASE_URL = "http://localhost:5000/api/v1/quran";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/quran` : "http://localhost:5000/api/v1/quran";

export async function generateStaticParams() {
  try {
    const response = await axios.get(`${API_BASE_URL}/surahs`);
    const surahs = response.data.data;
    return surahs.map((surah: any) => ({
      id: surah.sura_no.toString(),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function SurahPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Pre-fetch data for SEO/SSG
  const response = await axios.get(`${API_BASE_URL}/surah/${id}`);
  const initialData = response.data.data;

  return <SurahReader initialData={initialData} id={id} />;
}
