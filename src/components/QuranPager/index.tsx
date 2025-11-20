import React, {useState, useRef, useCallback, useMemo} from 'react';
import {View, Text, StyleSheet, SafeAreaView, Pressable} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Icon} from '@ui-kitten/components';
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
import {LineSelectionProvider} from './context';
import {MemorizationSelectionSheet} from './components/MemorizationSelectionSheet';
import {MemorizedRange} from '../../types/memorization.types';
import {useAppSelector, useAppDispatch} from '../../store/hooks';
import {
  undo,
  redo,
  selectCanUndo,
  selectCanRedo,
} from '../../features/Memorization/verseSelectionSlice';

// Icon wrapper components for UI Kitten
const UndoIcon = (props: any) => (
  <Icon {...props} name="corner-up-left-outline" />
);
const RedoIcon = (props: any) => (
  <Icon {...props} name="corner-up-right-outline" />
);

interface QuranPagerProps {
  initialPage?: number;
  fontSize?: number;
  showHeader?: boolean;
  onPageChange?: (page: number) => void;
  selectionMode?: boolean;
  onSave?: (ranges: MemorizedRange[]) => void;
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
  fontSize,
  showHeader = true,
  onPageChange,
  selectionMode = false,
  onSave,
}) => {
  const {t} = useTranslation();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
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

  // Collect all verses from cached pages for bottom sheet
  // Note: We update this whenever currentPage changes as cache updates
  const allVerses = useMemo(() => {
    const verses: Verse[] = [];
    Object.values(pageCacheRef.current).forEach(pageData => {
      if (pageData.verses) {
        verses.push(...pageData.verses);
      }
    });
    return verses;
    // currentPage is used as a dependency to trigger re-computation when cache might update
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Undo/Redo functionality for selection mode
  const dispatch = useAppDispatch();
  const canUndo = useAppSelector(selectCanUndo);
  const canRedo = useAppSelector(selectCanRedo);
  const handleUndo = useCallback(() => {
    dispatch(undo());
  }, [dispatch]);
  const handleRedo = useCallback(() => {
    dispatch(redo());
  }, [dispatch]);

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
              selectionMode={selectionMode}
            />
          ) : (
            // Placeholder for pages outside window
            <View style={styles.placeholder} />
          )}
        </View>,
      );
    }
    return pagesArray;
  }, [fontSize, shouldRenderPage, handlePageDataLoaded, selectionMode]);

  // Handle save action from bottom sheet
  const handleSave = useCallback(
    (ranges: MemorizedRange[]) => {
      // Call the onSave callback if provided
      onSave?.(ranges);
      // TODO: Replace with actual API call when backend is ready
      console.log('Saving memorization ranges:', ranges);
      // API call placeholder:
      // await saveMemorizationRanges(ranges);
      setBottomSheetVisible(false);
    },
    [onSave],
  );

  const content = (
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

      {/* Bottom sheet for selection mode */}
      {selectionMode && (
        <MemorizationSelectionSheet
          visible={bottomSheetVisible}
          onClose={() => setBottomSheetVisible(false)}
          onSave={handleSave}
          verses={allVerses}
        />
      )}

      {/* Action buttons for selection mode */}
      {selectionMode && (
        <View style={styles.selectionActions}>
          <Pressable
            style={[styles.undoButton, !canUndo && styles.undoButtonDisabled]}
            onPress={handleUndo}
            disabled={!canUndo}>
            <UndoIcon
              style={styles.icon}
              fill={!canUndo ? colors.text.secondary : colors.white}
            />
          </Pressable>
          <Pressable
            style={[styles.redoButton, !canRedo && styles.redoButtonDisabled]}
            onPress={handleRedo}
            disabled={!canRedo}>
            <RedoIcon
              style={styles.icon}
              fill={!canRedo ? colors.text.secondary : colors.white}
            />
          </Pressable>
          <Pressable
            style={styles.toggleSheetButton}
            onPress={() => setBottomSheetVisible(!bottomSheetVisible)}>
            <Text style={styles.toggleSheetButtonText}>
              {bottomSheetVisible
                ? t('memorization.selection.hideSelection')
                : t('memorization.selection.showSelection')}
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );

  // Wrap with line selection provider (verse selection is handled by Redux)
  if (!selectionMode) {
    return <LineSelectionProvider>{content}</LineSelectionProvider>;
  }

  // In selection mode, no provider needed - using Redux instead
  return content;
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
  selectionActions: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    gap: 10,
  },
  undoButton: {
    backgroundColor: colors.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  undoButtonDisabled: {
    backgroundColor: colors.border,
    opacity: 0.5,
  },
  redoButton: {
    backgroundColor: colors.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  redoButtonDisabled: {
    backgroundColor: colors.border,
    opacity: 0.5,
  },
  icon: {
    width: 24,
    height: 24,
  },
  toggleSheetButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleSheetButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default QuranPager;
