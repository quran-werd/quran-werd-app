import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, SafeAreaView, Pressable} from 'react-native';
import PageContainer from './PageContainer';
import {totalPagesCount, getJuzNumber, getPageData} from '../../content';

interface QuranPagerProps {
  initialPage?: number;
  fontSize?: number;
  showPageFooter?: boolean;
  showHeader?: boolean;
  onPageChange?: (page: number) => void;
}

/**
 * QuranPager - Static single page display (simplified version)
 * Adapted from quran.com-frontend-next ReadingView structure
 *
 * Features:
 * - Single page rendering with proper line layout
 * - Verse grouping matching physical Mushaf
 * - Page-specific QCF fonts
 * - Header with page and Juz information
 * - Previous/Next navigation buttons
 */
const QuranPager: React.FC<QuranPagerProps> = ({
  initialPage = 3,
  fontSize = 18,
  showPageFooter = true,
  showHeader = true,
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      onPageChange?.(newPage);
    }
  }, [currentPage, onPageChange]);

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPagesCount) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      onPageChange?.(newPage);
    }
  }, [currentPage, onPageChange]);

  // Get Juz information for the current page
  const currentPageData = getPageData(currentPage);
  const firstSurah = currentPageData[0].surah;
  const firstVerse = currentPageData[0].start;
  const juzNumber = getJuzNumber(firstSurah, firstVerse);

  return (
    <SafeAreaView style={styles.container}>
      {showHeader && (
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Page {currentPage} | Juz {juzNumber}
          </Text>
          <Text style={styles.headerSubText}>
            {currentPage} / {totalPagesCount}
          </Text>
        </View>
      )}

      <View style={styles.pageWrapper}>
        <PageContainer
          pageNumber={currentPage}
          fontSize={fontSize}
          showPageFooter={showPageFooter}
        />
      </View>

      {/* Navigation buttons */}
      <View style={styles.navigationContainer}>
        <Pressable
          style={[
            styles.navButton,
            currentPage === 1 && styles.navButtonDisabled,
          ]}
          onPress={goToPreviousPage}
          disabled={currentPage === 1}>
          <Text style={styles.navButtonText}>← Previous</Text>
        </Pressable>

        <Pressable
          style={[
            styles.navButton,
            currentPage === totalPagesCount && styles.navButtonDisabled,
          ]}
          onPress={goToNextPage}
          disabled={currentPage === totalPagesCount}>
          <Text style={styles.navButtonText}>Next →</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCE7',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  headerSubText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  pageWrapper: {
    flex: 1,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
  navButtonDisabled: {
    backgroundColor: '#ccc',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default QuranPager;
