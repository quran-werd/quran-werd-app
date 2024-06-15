export namespace PageTypes {
  export type Page = Chapter[];

  export type Chapter = {
    chapterNumber: number;
    lines: Line[];
  };

  export type Line = {
    lineNumber: number;
    words: Word[];
  };

  export type Word = {
    id: number;
    text: string;
    isVerseEnd: boolean;
    verseNumber: number;
  };
}
