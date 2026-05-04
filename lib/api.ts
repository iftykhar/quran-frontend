import axios from "axios";
import { Surah, Ayah } from "@/types/quran";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const QURAN_API_URL = `${API_URL}/quran`;

const api = axios.create({
  baseURL: QURAN_API_URL,
  withCredentials: true,
});

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface SurahData {
  surah: Surah;
  ayahs: Ayah[];
}

/**
 * Fetches the list of all surahs from the database.
 */
export async function getSurahs(): Promise<Surah[]> {
  try {
    const response = await api.get<ApiResponse<Surah[]>>("/surahs");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching surahs:", error);
    return [];
  }
}

/**
 * Fetches a specific surah by its ID, including paginated ayahs.
 */
export async function getSurahById(id: string, page: number = 1, limit: number = 20): Promise<SurahData | null> {
  try {
    const response = await api.get<ApiResponse<SurahData>>(`/surah/${id}?page=${page}&limit=${limit}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching surah ${id} page ${page}:`, error);
    return null;
  }
}

/**
 * Fetches the list of all 30 Juz.
 */
export async function getJuzList(): Promise<any[]> {
  try {
    const response = await api.get<ApiResponse<any[]>>("/juz");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching juz list:", error);
    return [];
  }
}
