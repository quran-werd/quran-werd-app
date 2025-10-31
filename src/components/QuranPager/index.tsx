import React, {useState, useRef, useCallback, useMemo} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import PagerView from 'react-native-pager-view';
import {PageContainer} from './components';
import {
  getJuzNumber,
  getPageData,
  getSurahNameArabic,
  toArabicNumerals,
  totalPagesCount,
} from '../../content';
import {colors} from '../../styles/colors';
import type {Verse} from './types';

interface QuranPagerProps {
  initialPage?: number;
  fontSize?: number;
  showHeader?: boolean;
  onPageChange?: (page: number) => void;
}

interface PageCache {
  [pageNumber: number]: {
    verses: Verse[];
    fontFamily: string;
  };
}

/**
 * QuranPager - Swipeable page display
 * Adapted from quran.com-frontend-next ReadingView structure
 *
 * Features:
 * - Swipeable pages with gesture support
 * - Verse grouping matching physical Mushaf
 * - Page-specific QCF fonts
 * - Clean header with chapter name and Juz information
 * - Optimized rendering with windowed pages
 */
const QuranPager: React.FC<QuranPagerProps> = ({
  initialPage = 1,
  fontSize = 23,
  showHeader = true,
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const pagerRef = useRef<PagerView>(null);

  // Cache for storing fetched page data
  const pageCacheRef = useRef<PageCache>({});

  // Window size: render current page + 2 before + 2 after = 5 pages total
  const WINDOW_SIZE = 2;

  // Callback to cache page data after fetching
  const handlePageDataLoaded = useCallback(
    (pageNumber: number, verses: Verse[], fontFamily: string) => {
      pageCacheRef.current[pageNumber] = {verses, fontFamily};
    },
    [],
  );

  // Handle page selection change
  const handlePageSelected = useCallback(
    (e: any) => {
      const newPage = e.nativeEvent.position + 1; // Convert 0-based to 1-based
      setCurrentPage(newPage);
      onPageChange?.(newPage);
    },
    [onPageChange],
  );

  // Get chapter and Juz information for the current page
  const currentPageData = getPageData(currentPage);
  const firstSurah = currentPageData[0].surah;
  const firstVerse = currentPageData[0].start;
  const juzNumber = getJuzNumber(firstSurah, firstVerse);
  const surahNameArabic = getSurahNameArabic(firstSurah);

  // Check if a page should be rendered (within window)
  const shouldRenderPage = useCallback(
    (pageNumber: number) => {
      return Math.abs(pageNumber - currentPage) <= WINDOW_SIZE;
    },
    [currentPage],
  );

  // Render pages with windowing for performance
  // Only render content for current page +/- WINDOW_SIZE
  // Memoized to avoid re-creating all 604 page elements on every render
  const pages = useMemo(() => {
    const pagesArray = [];
    for (let i = 1; i <= totalPagesCount; i++) {
      const isInWindow = shouldRenderPage(i);
      const cachedData = pageCacheRef.current[i];

      pagesArray.push(
        <View key={i} style={styles.page}>
          {isInWindow ? (
            <PageContainer
              pageNumber={i}
              fontSize={fontSize}
              showPageFooter={true}
              cachedVerses={cachedData?.verses}
              cachedFontFamily={cachedData?.fontFamily}
              onDataLoaded={handlePageDataLoaded}
            />
          ) : (
            // Placeholder for pages outside window
            <View style={styles.placeholder} />
          )}
        </View>,
      );
    }
    return pagesArray;
  }, [fontSize, shouldRenderPage, handlePageDataLoaded]);

  return (
    <SafeAreaView style={styles.container}>
      {showHeader && (
        <View style={styles.header}>
          {/* Left: Chapter name in Arabic */}
          <View style={styles.headerLeft}>
            <Text style={styles.surahNameArabic}>{surahNameArabic}</Text>
          </View>

          {/* Right: Juz and page number */}
          <View style={styles.headerRight}>
            <Text style={styles.juzText}>
              الجزء {toArabicNumerals(juzNumber)}
            </Text>
          </View>
        </View>
      )}

      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={initialPage - 1} // Convert 1-based to 0-based
        onPageSelected={handlePageSelected}
        orientation="horizontal"
        overdrag={false}
        offscreenPageLimit={2}>
        {pages}
      </PagerView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: colors.background,
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  surahNameArabic: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text.primary,
    textAlign: 'left',
  },
  juzText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text.primary,
    textAlign: 'right',
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

export default QuranPager;
