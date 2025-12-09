/**
 * API Types matching Quran.com API response structure
 * Based on quran.com-frontend-next types
 */

export interface ApiWord {
  id: number;
  position: number;
  audio_url?: string;
  char_type_name: 'word' | 'end' | 'pause' | 'sajdah' | 'rub-el-hizb';
  code_v1?: string;
  code_v2?: string;
  page_number: number;
  line_number: number;
  text?: string;
  text_uthmani?: string;
  text_indopak?: string;
  text_imlaei?: string;
  verse_key?: string; // Optional - might not be on every word
  translation?: {
    text: string;
    language_name: string;
  };
  transliteration?: {
    text: string;
    language_name: string;
  };
}

export interface ApiVerse {
  id: number;
  verse_number: number;
  verse_key: string;
  juz_number: number;
  hizb_number: number;
  rub_el_hizb_number: number;
  ruku_number?: number;
  manzil_number?: number;
  sajdah_number?: number;
  page_number: number;
  words: ApiWord[];
  text_uthmani?: string;
  text_uthmani_simple?: string;
  text_imlaei?: string;
  text_indopak?: string;
  translations?: any[];
  audio?: {
    url: string;
    segments?: any[];
  };
}

export interface ApiPagination {
  per_page: number | string;
  current_page: number;
  next_page: number | null;
  total_pages: number;
  total_records: number;
}

export interface ApiVersesResponse {
  verses: ApiVerse[];
  pagination: ApiPagination;
  meta?: {
    filters?: {
      page_number?: number;
    };
  };
}
