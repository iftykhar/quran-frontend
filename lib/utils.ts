import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAyahAudioUrl(surahNumber: number, ayahNumber: number, reciterIdentifier: string = "Abdul_Basit_Murattal_64kbps") {
  const s = surahNumber.toString().padStart(3, "0");
  const a = ayahNumber.toString().padStart(3, "0");
  return `https://www.everyayah.com/data/${reciterIdentifier}/${s}${a}.mp3`;
}
