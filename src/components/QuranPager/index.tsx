import React, {useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import PageContainer from './PageContainer';
import {getJuzNumber, getPageData, getSurahNameArabic} from '../../content';

interface QuranPagerProps {
  initialPage?: number;
  fontSize?: number;
  showHeader?: boolean;
}

/**
 * QuranPager - Static single page display
 * Adapted from quran.com-frontend-next ReadingView structure
 *
 * Features:
 * - Single page rendering with proper line layout
 * - Verse grouping matching physical Mushaf
 * - Page-specific QCF fonts
 * - Clean header with chapter name and Juz information
 */
const QuranPager: React.FC<QuranPagerProps> = ({
  initialPage = 3,
  fontSize = 26,
  showHeader = true,
}) => {
  const [currentPage] = useState(initialPage);

  // Get chapter and Juz information for the current page
  const currentPageData = getPageData(currentPage);
  const firstSurah = currentPageData[0].surah;
  const firstVerse = currentPageData[0].start;
  const juzNumber = getJuzNumber(firstSurah, firstVerse);
  const surahNameArabic = getSurahNameArabic(firstSurah);

  // Convert Juz number to Arabic numerals
  const toArabicNumerals = (num: number): string => {
    const arabicNumbers: Record<string, string> = {
      '0': '٠',
      '1': '۱',
      '2': '۲',
      '3': '۳',
      '4': '٤',
      '5': '٥',
      '6': '٦',
      '7': '۷',
      '8': '۸',
      '9': '۹',
    };
    return num
      .toString()
      .split('')
      .map(digit => arabicNumbers[digit])
      .join('');
  };

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

      <View style={styles.pageWrapper}>
        <PageContainer
          pageNumber={currentPage}
          fontSize={fontSize}
          showPageFooter={true}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCE7',
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    backgroundColor: '#FFFCE7',
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
    color: '#1a1a1a',
    textAlign: 'left',
  },
  juzText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#1a1a1a',
    textAlign: 'right',
  },
  pageWrapper: {
    flex: 1,
  },
});

export default QuranPager;
