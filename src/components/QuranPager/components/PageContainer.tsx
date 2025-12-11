import React, {useEffect, useState} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {Verse} from '../../../types/quran-pager.types';
import {getPageVerses} from '../utils/transformPageData';
import {getPageQCFontName} from '../../../content';
import {colors} from '../../../styles/colors';
import Page from './Page';

interface PageContainerProps {
  pageNumber: number;
  fontSize?: number;
  showPageFooter?: boolean;
  cachedVerses?: Verse[];
  cachedFontFamily?: string;
  onDataLoaded?: (
    pageNumber: number,
    verses: Verse[],
    fontFamily: string,
  ) => void;
  selectionMode?: boolean;
}

/**
 * PageContainer - Fetches and prepares verse data for a single page
 * Matches quran.com-frontend-next ReadingView/PageContainer.tsx
 *
 * This component handles:
 * - Fetching data from Quran.com API
 * - Transforming API response into verse/word structure
 * - Providing the correct font for the page
 * - Showing loading states
 * - Uses REAL line numbers from API (not simulated)
 */
export const PageContainer: React.FC<PageContainerProps> = ({
  pageNumber,
  fontSize,
  showPageFooter = true,
  cachedVerses,
  cachedFontFamily,
  onDataLoaded,
  selectionMode = false,
}) => {
  const [verses, setVerses] = useState<Verse[]>(cachedVerses || []);
  const [isLoading, setIsLoading] = useState(!cachedVerses);
  const [fontFamily, setFontFamily] = useState<string>(cachedFontFamily || '');

  useEffect(() => {
    // If we have cached data, use it and don't fetch
    if (cachedVerses && cachedFontFamily) {
      setVerses(cachedVerses);
      setFontFamily(cachedFontFamily);
      setIsLoading(false);
      return;
    }

    const loadPageData = async () => {
      try {
        setIsLoading(true);

        // Get the font name for this page
        const pageFontName = getPageQCFontName(pageNumber);
        setFontFamily(pageFontName);

        // Fetch verses from API
        const pageVerses = await getPageVerses(pageNumber);
        setVerses(pageVerses);

        // Cache the data for future use
        onDataLoaded?.(pageNumber, pageVerses, pageFontName);
      } catch (error) {
        console.error(`Failed to load page ${pageNumber}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPageData();
  }, [pageNumber, cachedVerses, cachedFontFamily, onDataLoaded]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#666" />
      </View>
    );
  }

  return (
    <Page
      verses={verses}
      pageNumber={pageNumber}
      fontFamily={fontFamily}
      fontSize={fontSize}
      showPageFooter={showPageFooter}
      selectionMode={selectionMode}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
  },
});
