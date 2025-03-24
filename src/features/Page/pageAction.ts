import {
  PayloadAction,
  createAsyncThunk,
  isRejectedWithValue,
} from '@reduxjs/toolkit';
import {quranAxios} from '../../utils/axios';
import {slicesNames} from '../../store/constants';
import {APITypes} from '../../types/api.types';
import {setPageVerses} from './pageSlice';

const _fetchVersesInfo = (pageNumber: number) =>
  quranAxios.get<{verses: APITypes.VerseInfo[]}>(
    `/verses/by_page/${pageNumber}?words=true`,
  );

const _fetchVerses = (pageNumber: number) =>
  quranAxios.get<{verses: APITypes.Verse[]}>(
    `/quran/verses/uthmani?page_number=${pageNumber}`,
  );

const _fetchChapterInfo = (chapterNumber: number) =>
  quranAxios.get<{chapter: APITypes.Chapter}>(`/chapters/${chapterNumber}`);

export const fetchVersesFullInfo = createAsyncThunk(
  `${slicesNames.page}/verses`,
  async (
    chapterNumber: number,
    {dispatch},
  ): Promise<
    {verses: APITypes.Verse[]; versesInfo: APITypes.VerseInfo[]} | boolean
  > => {
    try {
      const [verses, versesInfo] = await Promise.all([
        _fetchVerses(chapterNumber),
        _fetchVersesInfo(chapterNumber),
      ]);

      const _verses = verses.data.verses;
      const _versesInfo = versesInfo.data.verses;

      dispatch(
        setPageVerses({
          verses: _verses,
          versesInfo: _versesInfo,
          pageNumber: chapterNumber,
        }),
      );

      return {
        verses: _verses,
        versesInfo: _versesInfo,
      };
    } catch (error) {
      return isRejectedWithValue(error);
    }
  },
);

export const fetchChapterInfo = async (
  chapterNumber: number,
): Promise<APITypes.Chapter | undefined> => {
  try {
    const response = await _fetchChapterInfo(chapterNumber);
    return response.data.chapter;
  } catch (error) {}
};

export type FetchVersesFullInfoPayloadAction = PayloadAction<{
  pageNumber: number;
  verses: APITypes.Verse[];
  versesInfo: APITypes.VerseInfo[];
}>;

export type FetchChapterInfoPayloadAction = PayloadAction<{
  chapterInfo: APITypes.Chapter;
}>;
