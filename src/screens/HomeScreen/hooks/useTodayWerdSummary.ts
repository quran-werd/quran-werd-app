import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from '../../../store/hooks';
import {
  selectRevisionSessionWerd,
  selectRevisionSessionStatus,
} from '../../../features/RevisionSession/revisionSessionSlice';
import {getJuzNumber, getPageForVerse, toArabicNumerals} from '../../../content';

export function useTodayWerdSummary() {
  const {i18n} = useTranslation();
  const werd = useAppSelector(selectRevisionSessionWerd);
  const status = useAppSelector(selectRevisionSessionStatus);

  const isCompleted = status === 'completed';
  const isFinished = status === 'finished';

  const ayahCount = werd ? werd.range.to - werd.range.from + 1 : 0;
  const juzNumber = werd ? getJuzNumber(werd.surah, werd.range.from) : 0;
  const pageNumber = werd ? getPageForVerse(werd.surah, werd.range.from) : 0;

  const formatNumber = useCallback(
    (num: number) =>
      i18n.language === 'ar' ? toArabicNumerals(num) : String(num),
    [i18n.language],
  );

  return {
    werd,
    status,
    isCompleted,
    isFinished,
    ayahCount,
    juzNumber,
    pageNumber,
    formatNumber,
  };
}
