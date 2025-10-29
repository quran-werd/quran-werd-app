import React, {useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Verse} from './types';
import {getLineDataFromVerses} from './utils/groupLinesByVerses';
import Line from './Line';
import {toArabicNumerals} from '../../content';

interface PageProps {
  verses: Verse[];
  pageNumber: number;
  fontFamily: string;
  fontSize?: number;
  showPageFooter?: boolean;
}

/**
 * Page component - Renders a single Quran page with all its lines
 * Adapted from quran.com-frontend-next ReadingView/Page.tsx
 *
 * A page contains multiple lines organized by the Mushaf layout
 * Lines are distributed evenly within the available screen space
 */
const Page: React.FC<PageProps> = ({
  verses,
  pageNumber,
  fontFamily,
  fontSize = 26,
  showPageFooter = true,
}) => {
  // Group verses into lines for proper Mushaf layout
  const lines = useMemo(
    () => (verses.length > 0 ? getLineDataFromVerses(verses) : []),
    [verses],
  );

  return (
    <View style={styles.container}>
      <View style={styles.linesContainer}>
        {lines.map(line => (
          <Line
            key={line.lineKey}
            lineKey={line.lineKey}
            words={line.words}
            pageNumber={line.pageNumber}
            lineNumber={line.lineNumber}
            fontFamily={fontFamily}
            fontSize={fontSize}
          />
        ))}
      </View>

      {showPageFooter && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>{toArabicNumerals(pageNumber)}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFCE7',
    paddingHorizontal: 16,
    gap: 8,
  },
  linesContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
});

export default Page;
