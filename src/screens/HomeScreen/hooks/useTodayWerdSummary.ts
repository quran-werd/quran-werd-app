import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from '../../../store/hooks';
import {selectTodayWerd} from '../../../features/RevisionLog/revisionLogSlice';
import {getJuzNumber, getPageForVerse, toArabicNumerals} from '../../../content';

export function useTodayWerdSummary() {
  const {i18n} = useTranslation();
  const today = useAppSelector(selectTodayWerd);

  const werd = today?.werd;
  const status = today?.status || 'pending';
  const isCompleted = status === 'completed';

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
    ayahCount,
    juzNumber,
    pageNumber,
    formatNumber,
  };
}
