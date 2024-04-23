import {
  AsyncThunk,
  PayloadAction,
  createAsyncThunk,
  isRejectedWithValue,
} from '@reduxjs/toolkit';
import {quranAxios} from '../../utils/axios';
import {slicesNames} from '../../store/constants';
import {VerseAPI, VerseInfoAPI} from '../../types/verses.types';

const _fetchVersesInfo = (pageNumber: number) =>
  quranAxios.get<{verses: VerseInfoAPI[]}>(
    `/verses/by_page/${pageNumber}?words=true`,
  );

const _fetchVerses = (pageNumber: number) =>
  quranAxios.get<{verses: VerseAPI[]}>(
    `/quran/verses/uthmani?page_number=${pageNumber}`,
  );

export const fetchVersesFullInfo = createAsyncThunk(
  `${slicesNames.chapter}/verses`,
  async (
    chapterNumber: number,
  ): Promise<{verses: VerseAPI[]; versesInfo: VerseInfoAPI[]} | boolean> => {
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
  verses: VerseAPI[];
  versesInfo: VerseInfoAPI[];
}>;
