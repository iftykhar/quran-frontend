export interface Surah {
  sura_no: number;
  sura_name: string;
  para: number;
  meaning: string;
  total_ayat: number;
  total_ruku: number;
  eng_name: string;
  hindi: string;
}

export interface Ayah {
  sura_no: number;
  ayah_no: number;
  arabic_text: string;
  english_text: string;
  bengali_text: string;
  audio_url: string;
}
