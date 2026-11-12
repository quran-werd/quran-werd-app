import {werdApiRequest} from './werdApi';

export type VerseRange = {
  from: number;
  to: number;
};

export type MemorizationData = {
  ranges: Record<string, VerseRange[]>;
};

export const getMemorizations = (): Promise<MemorizationData> =>
  werdApiRequest<MemorizationData>('/memorizations');

export const addRanges = (ranges: {surah: number; from: number; to: number}[]) =>
  werdApiRequest<MemorizationData>('/memorizations/ranges', {
    method: 'POST',
    data: {ranges},
  });

export const deleteRange = (surah: number, from: number, to: number) =>
  werdApiRequest<MemorizationData>(
    `/memorizations/range/${surah}/${from}/${to}`,
    {method: 'DELETE'},
  );
