import React, {useEffect, useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Verse} from '../../../types/quran-pager.types';
import {groupMushafWordsIntoVerses} from '../utils/mushafWordsToVerses';
import {getPageQCFontName} from '../../../content';
import {useMushafLocalStoreData} from '../../../services/mushafLocalStore';
import {colors} from '../../../styles/colors';
import {radius} from '../../../styles/radius';
import {shadows} from '../../../styles/shadows';
import Page from './Page';

interface PageContainerProps {
  pageNumber: number;
  fontSize?: number;
  showPageFooter?: boolean;
  onDataLoaded?: (
    pageNumber: number,
    verses: Verse[],
    fontFamily: string,
  ) => void;
  selectionMode?: boolean;
}

/**
 * PageContainer - Prepares verse data for a single page from the Mushaf
 * Local Store. The store is fully built and in memory by the time this
 * renders (QuranPager only mounts under MushafLocalStoreGate once ready),
 * so this is a synchronous lookup, not a fetch.
 */
export const PageContainer: React.FC<PageContainerProps> = ({
  pageNumber,
  fontSize,
  showPageFooter = true,
  onDataLoaded,
  selectionMode = false,
}) => {
  const store = useMushafLocalStoreData();

  const fontFamily = useMemo(() => getPageQCFontName(pageNumber), [pageNumber]);

  const verses = useMemo(
    () => groupMushafWordsIntoVerses(store.pages[pageNumber] ?? []),
    [store, pageNumber],
  );

  // Notify the parent's page cache, matching the previous fetch-based
  // contract so callers (QuranPager's windowing/allVerses cache) don't need
  // to change.
  useEffect(() => {
    onDataLoaded?.(pageNumber, verses, fontFamily);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, verses, fontFamily]);

  return (
    <LinearGradient
      colors={[colors.mushafPageTop, colors.mushafPageBottom]}
      style={[styles.card, shadows.mushafPage]}>
      <Page
        verses={verses}
        pageNumber={pageNumber}
        fontFamily={fontFamily}
        fontSize={fontSize}
        showPageFooter={showPageFooter}
        selectionMode={selectionMode}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
});
