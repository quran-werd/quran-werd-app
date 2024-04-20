import {
  AsyncThunk,
  PayloadAction,
  createAsyncThunk,
  isRejectedWithValue,
} from '@reduxjs/toolkit';
import {quranAxios} from '../../utils/axios';
import {slicesNames} from '../../store/constants';
import {Verse, VerseInfo} from '../../types/verses.types';

const _fetchVersesInfo = (chapterNumber: number) =>
  quranAxios.get<{verses: VerseInfo[]}>(
    `/verses/by_chapter/${chapterNumber}?words=true`,
  );

const _fetchVerses = (chapterNumber: number) =>
  quranAxios.get<{verses: Verse[]}>(
    `/quran/verses/uthmani?chapter_number=${chapterNumber}`,
  );

export const fetchVersesFullInfo = createAsyncThunk(
  `${slicesNames.chapter}/verses`,
  async (
    chapterNumber: number,
  ): Promise<{verses: Verse[]; versesInfo: VerseInfo[]} | boolean> => {
    try {
      const [verses, versesInfo] = await Promise.all([
        _fetchVerses(chapterNumber),
        _fetchVersesInfo(chapterNumber),
      ]);

      return {
        verses: verses.data.verses,
        versesInfo: versesInfo.data.verses,
      };
    } catch (error) {
      return isRejectedWithValue(error);
    }
  },
);

export type FetchVersesFullInfoPayloadAction = PayloadAction<{
  verses: Verse[];
  versesInfo: VerseInfo[];
}>;
