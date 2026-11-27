import React, {useEffect, useMemo} from 'react';
import {ActivityIndicator, Pressable, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {LinearGradient} from 'expo-linear-gradient';
import {Verse} from '../../../types/quran-pager.types';
import {groupMushafWordsIntoVerses} from '../utils/mushafWordsToVerses';
import {useMushafLocalStoreData} from '../../../services/mushafLocalStore';
import {usePageFont} from '../../../services/qcfFonts';
import Typography from '../../shared/Typography';
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

  const {t} = useTranslation();
  // QCF fonts are downloaded at runtime; until this page's font is
  // registered, rendering its glyph codes would show garbage, so show a
  // placeholder instead (the hook fetches this page ahead of the queue).
  const {
    fontFamily,
    isReady: isFontReady,
    error: fontError,
    retry,
  } = usePageFont(pageNumber);

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
      {!isFontReady ? (
        <Pressable
          style={styles.placeholder}
          onPress={fontError ? retry : undefined}
          disabled={!fontError}>
          {!fontError && <ActivityIndicator color={colors.mushafBrownFaded} />}
          <Typography
            variant="label"
            align="center"
            style={styles.placeholderText}>
            {t(
              fontError
                ? 'mushafStore.pageFontError'
                : 'mushafStore.pageFontLoading',
            )}
          </Typography>
        </Pressable>
      ) : (
        <Page
          verses={verses}
          pageNumber={pageNumber}
          fontFamily={fontFamily}
          fontSize={fontSize}
          showPageFooter={showPageFooter}
          selectionMode={selectionMode}
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  placeholderText: {
    color: colors.mushafBrownFaded,
  },
});
