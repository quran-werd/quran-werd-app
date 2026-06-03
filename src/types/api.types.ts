import {Word} from './quran-pager.types';

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiErrorResponse = {
  success: false;
  error: string;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export namespace APITypes {
  export interface Verse {
    id: number;
    verse_key: string;
    text_uthmani: string;
  }

  export interface VerseInfo {
    verse_key: string;
    id: number;
    verse_number: number;
    hizb_number: number;
    rub_el_hizb_number: number;
    ruku_number: number;
    manzil_number: number;
    sajdah_number: number;
    page_number: number;
    juz_number: number;
    words: Word[];
  }

  export interface Chapter {
    id: number;
    revelation_place: string;
    revelation_order: number;
    bismillah_pre: boolean;
    name_simple: string;
    name_complex: string;
    name_arabic: string;
    verses_count: number;
    pages: number[];
    translated_name: TranslatedName;
  }
}

interface TranslatedName {
  language_name: string;
  name: string;
}

export interface Translation {
  text: null | string;
  language_name: LanguageName;
}

export enum LanguageName {
  English = 'english',
}
