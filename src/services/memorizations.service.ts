import {werdApiRequest} from './werdApi';

export type VerseRange = {
  from: number;
  to: number;
};

export type MemorizationData = {
  _id: string;
  userId: string;
  ranges: Record<string, VerseRange[]>;
};

export const getMemorizations = (): Promise<MemorizationData> =>
  werdApiRequest<MemorizationData>('/memorizations');

export const addRange = (surah: number, from: number, to: number) =>
  werdApiRequest<MemorizationData>('/memorizations/range', {
    method: 'POST',
    data: {surah, from, to},
  });

export const deleteRange = (surah: number, from: number, to: number) =>
  werdApiRequest<MemorizationData>(
    `/memorizations/range/${surah}/${from}/${to}`,
    {method: 'DELETE'},
  );
