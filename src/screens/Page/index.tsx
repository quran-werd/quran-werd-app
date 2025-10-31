import React, {useMemo} from 'react';
import {ChapterProps} from '../../routes/ChaptersStack';
import QuranPager from '../../components/QuranPager';
import {getPageNumber} from '../../content';

export default function Page({route}: ChapterProps) {
  const {chapterNumber} = route.params;

  const pageNumber = useMemo(
    () => getPageNumber(chapterNumber, 1),
    [chapterNumber],
  );

  return <QuranPager initialPage={pageNumber} />;
}
