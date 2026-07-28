import React, {useState, useRef, useCallback, useMemo, useEffect} from 'react';
import {View, StyleSheet, SafeAreaView, Pressable} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import PagerView from 'react-native-pager-view';
import Svg, {Path} from 'react-native-svg';
import {PageContainer} from './components';
import {
  getJuzNumber,
  getPageData,
  getSurahNameArabic,
  getSurahPages,
  toArabicNumerals,
  totalPagesCount,
} from '../../content';
import {colors} from '../../styles/colors';
import {radius} from '../../styles/radius';
import Typography from '../shared/Typography';
import Button from '../shared/Button';
import Toast from '../shared/Toast';
import type {Verse} from '../../types/quran-pager.types';
import {LineSelectionProvider} from './context';
import {MemorizationSelectionSheet} from './components/MemorizationSelectionSheet';
import {JumpSheet} from './components/JumpSheet';
import {SaveMemorizationRange} from '../../types/memorization.types';
import {useAppSelector, useAppDispatch} from '../../store/hooks';
import {
  undo,
  redo,
  selectCanUndo,
  selectCanRedo,
  selectPendingStartVerse,
  selectSelectedVerseKeys,
  selectMergeEvent,
  clearMergeEvent,
} from '../../features/Memorization/memorizationSelectionSlice';

function CloseIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 6l12 12M18 6 6 18"
        stroke={colors.mutedForeground}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function UndoIcon({disabled}: {disabled?: boolean}) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 7 4 12l5 5M4 12h11a5 5 0 0 1 0 10h-1"
        stroke={disabled ? colors.mutedForeground : colors.foreground}
        strokeOpacity={disabled ? 0.4 : 1}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function RedoIcon({disabled}: {disabled?: boolean}) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 7l5 5-5 5M20 12H9a5 5 0 0 0 0 10h1"
        stroke={disabled ? colors.mutedForeground : colors.foreground}
        strokeOpacity={disabled ? 0.4 : 1}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function IconButton({
  onPress,
  disabled,
  size = 36,
  children,
}: {
  onPress: () => void;
  disabled?: boolean;
  size?: number;
  children: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.iconButton,
        {width: size, height: size, borderRadius: size / 2},
        disabled && styles.iconButtonDisabled,
      ]}>
      {children}
    </Pressable>
  );
}

interface QuranPagerProps {
  initialPage?: number;
  fontSize?: number;
  showHeader?: boolean;
  onPageChange?: (page: number) => void;
  selectionMode?: boolean;
  onSave?: (ranges: SaveMemorizationRange[]) => void | Promise<void>;
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
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [jumpSheetVisible, setJumpSheetVisible] = useState(false);
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
  const pendingStartVerse = useAppSelector(selectPendingStartVerse);
  const selectedVerseKeys = useAppSelector(selectSelectedVerseKeys);
  const mergeEvent = useAppSelector(selectMergeEvent);
  const handleUndo = useCallback(() => {
    dispatch(undo());
  }, [dispatch]);
  const handleRedo = useCallback(() => {
    dispatch(redo());
  }, [dispatch]);

  // Auto-dismiss the merge-success toast (docs/design.md §4.4)
  useEffect(() => {
    if (!mergeEvent) {
      return;
    }
    const timeout = setTimeout(() => dispatch(clearMergeEvent()), 2800);
    return () => clearTimeout(timeout);
  }, [mergeEvent, dispatch]);

  // Jump to page
  const handleJumpToPage = useCallback(
    (pageNum: number) => {
      // Navigate to the target page (convert to 0-based index)
      pagerRef.current?.setPage(pageNum - 1);
      setCurrentPage(pageNum);
      onPageChange?.(pageNum);
      setJumpSheetVisible(false);
    },
    [onPageChange],
  );

  // Jump to chapter
  const handleJumpToChapter = useCallback(
    (chapterNumber: number) => {
      const surahPages = getSurahPages(chapterNumber);
      if (surahPages.length > 0) {
        const targetPage = surahPages[0]; // Jump to first page of the surah
        pagerRef.current?.setPage(targetPage - 1);
        setCurrentPage(targetPage);
        onPageChange?.(targetPage);
        setJumpSheetVisible(false);
      }
    },
    [onPageChange],
  );

  const handleOpenJumpSheet = useCallback(() => {
    setJumpSheetVisible(true);
  }, []);

  const handleCloseJumpSheet = useCallback(() => {
    setJumpSheetVisible(false);
  }, []);

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

  const content = (
    <SafeAreaView style={styles.container}>
      {showHeader && (
        <View style={styles.header}>
          <IconButton onPress={() => navigation.goBack()}>
            <CloseIcon />
          </IconButton>
          <View style={styles.headerCenter}>
            <Typography variant="body" family="amiriBold" style={styles.surahNameArabic}>
              {surahNameArabic}
            </Typography>
            <Typography variant="small" color="muted">
              {t('quran.juz', {number: toArabicNumerals(juzNumber)})}
            </Typography>
          </View>
          {selectionMode ? (
            <View style={styles.headerActions}>
              <IconButton onPress={handleUndo} disabled={!canUndo} size={32}>
                <UndoIcon disabled={!canUndo} />
              </IconButton>
              <IconButton onPress={handleRedo} disabled={!canRedo} size={32}>
                <RedoIcon disabled={!canRedo} />
              </IconButton>
            </View>
          ) : (
            <View style={styles.headerActionsSpacer} />
          )}
        </View>
      )}

      {selectionMode ? (
        <View style={styles.notificationsLayer} pointerEvents="box-none">
          <Toast
            visible={!!pendingStartVerse && !mergeEvent}
            variant="pending"
            title={t('memorization.selection.pendingToastTitle')}
          />
          <Toast
            visible={!!mergeEvent}
            variant="merge"
            title={t('memorization.selection.mergeToastTitle')}
          />
        </View>
      ) : null}

      <View style={styles.pagerContainer}>
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
      </View>

      {/* Bottom sheet for selection mode */}
      {selectionMode && onSave && (
        <MemorizationSelectionSheet
          visible={bottomSheetVisible}
          onClose={() => setBottomSheetVisible(false)}
          onSave={onSave}
          verses={allVerses}
        />
      )}

      {/* Bottom toolbar for selection mode */}
      {selectionMode && (
        <View style={styles.toolbar}>
          <Button
            title={t('memorization.selection.jump')}
            onPress={handleOpenJumpSheet}
            variant="ghost"
          />
          <Button
            title={
              selectedVerseKeys.size > 0
                ? t('memorization.selection.showSelectionCount', {
                    count: selectedVerseKeys.size,
                  })
                : t('memorization.selection.showSelection')
            }
            onPress={() => setBottomSheetVisible(!bottomSheetVisible)}
            variant={bottomSheetVisible ? 'ghostActive' : 'ghost'}
          />
        </View>
      )}

      {/* Jump Sheet */}
      {selectionMode && (
        <JumpSheet
          visible={jumpSheetVisible}
          onClose={handleCloseJumpSheet}
          onJumpToChapter={handleJumpToChapter}
          onJumpToPage={handleJumpToPage}
        />
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 12,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  surahNameArabic: {
    fontSize: 18,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerActionsSpacer: {
    width: 36,
  },
  iconButton: {
    backgroundColor: colors.mutedTintSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonDisabled: {
    opacity: 0.3,
  },
  notificationsLayer: {
    position: 'absolute',
    top: 56,
    left: 12,
    right: 12,
    zIndex: 40,
  },
  pagerContainer: {
    flex: 1,
    marginHorizontal: 12,
    marginVertical: 8,
    overflow: 'hidden',
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    backgroundColor: colors.mushafPageTop,
    borderRadius: radius.xl,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
});

export default QuranPager;
