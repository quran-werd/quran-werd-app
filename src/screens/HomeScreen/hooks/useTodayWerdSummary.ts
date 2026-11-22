import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from '../../../store/hooks';
import {
  selectRevisionSessionCurrent,
  selectRevisionSessionNext,
  selectRevisionSessionPlanStatus,
} from '../../../features/RevisionSession/revisionSessionSlice';
import {
  getJuzNumber,
  getJuzOrdinalWord,
  getPageForVerse,
  toArabicNumerals,
} from '../../../content';

export function useTodayWerdSummary() {
  const {i18n} = useTranslation();
  const current = useAppSelector(selectRevisionSessionCurrent);
  const nextWerd = useAppSelector(selectRevisionSessionNext);
  const planStatus = useAppSelector(selectRevisionSessionPlanStatus);

  const werd = current?.werd ?? null;
  const isCompleted = current?.isCompleted ?? false;
  const isFinished = planStatus === 'finished' && current !== null;
  const isPlanComplete = planStatus === 'finished' && current === null;

  const ayahCount = werd ? werd.range.to - werd.range.from + 1 : 0;
  const juzNumber = werd ? getJuzNumber(werd.surah, werd.range.from) : 0;
  const juzOrdinal = getJuzOrdinalWord(juzNumber);
  const pageNumber = werd ? getPageForVerse(werd.surah, werd.range.from) : 0;

  const formatNumber = useCallback(
    (num: number) =>
      i18n.language === 'ar' ? toArabicNumerals(num) : String(num),
    [i18n.language],
  );

  return {
    werd,
    isCompleted,
    isFinished,
    isPlanComplete,
    ayahCount,
    juzNumber,
    juzOrdinal,
    pageNumber,
    nextWerd,
    formatNumber,
  };
}
