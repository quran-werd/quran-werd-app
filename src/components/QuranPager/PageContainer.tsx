import React, {useEffect, useState} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {Verse} from './types';
import {getPageVerses} from './utils/transformPageData';
import {getPageQCFontName} from '../../content';
import Page from './Page';

interface PageContainerProps {
  pageNumber: number;
  fontSize?: number;
  showPageFooter?: boolean;
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
const PageContainer: React.FC<PageContainerProps> = ({
  pageNumber,
  fontSize = 18,
  showPageFooter = true,
}) => {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fontFamily, setFontFamily] = useState<string>('');

  useEffect(() => {
    const loadPageData = async () => {
      try {
        setIsLoading(true);

        // Get the font name for this page
        const pageFontName = getPageQCFontName(pageNumber);
        setFontFamily(pageFontName);

        // Fetch verses from API
        const pageVerses = await getPageVerses(pageNumber);
        setVerses(pageVerses);
      } catch (error) {
        console.error(`Failed to load page ${pageNumber}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPageData();
  }, [pageNumber]);

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
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFCE7',
    paddingHorizontal: 16,
  },
});

export default PageContainer;
