import React, {useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Verse} from '../types';
import {getLineDataFromVerses} from '../utils/groupLinesByVerses';
import {colors} from '../../../styles/colors';
import Line from './Line';
import {toArabicNumerals} from '../../../content';
import {useAppSelector} from '../../../store/hooks';
import {selectSelectedVerseKeys} from '../../../features/Memorization/verseSelectionSlice';

const SMALLER_PAGES = [1, 2];

interface PageProps {
  verses: Verse[];
  pageNumber: number;
  fontFamily: string;
  fontSize?: number;
  showPageFooter?: boolean;
  highlightedLineKeys?: Set<string>;
  selectionMode?: boolean;
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
  highlightedLineKeys: externalHighlightedLineKeys,
  selectionMode = false,
}) => {
  // Get selected verse keys from Redux when in selection mode
  const selectedVerseKeysFromRedux = useAppSelector(selectSelectedVerseKeys);
  const selectedVerseKeys = useMemo(() => {
    if (selectionMode) {
      return selectedVerseKeysFromRedux;
    }
    return new Set<string>();
  }, [selectionMode, selectedVerseKeysFromRedux]);

  // Group verses into lines for proper Mushaf layout
  const lines = useMemo(
    () => (verses.length > 0 ? getLineDataFromVerses(verses) : []),
    [verses],
  );

  const isSmallerPage = useMemo(
    () => SMALLER_PAGES.includes(pageNumber),
    [pageNumber],
  );

  // For selection mode, pass selected verse keys; otherwise use line keys for backwards compatibility
  const highlightedLineKeys = useMemo(() => {
    if (selectionMode) {
      // In selection mode, we don't use line keys
      return undefined;
    }
    if (externalHighlightedLineKeys) {
      return externalHighlightedLineKeys;
    }
    return undefined;
  }, [selectionMode, externalHighlightedLineKeys]);

  return (
    <View style={[styles.container, selectionMode && styles.containerWithSelection]}>
      <View style={styles.versesContainer}>
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={[styles.linesContainer, {flexGrow: isSmallerPage ? 0.35 : 1}]}>
          {lines.map(line => (
            <Line
              key={line.lineKey}
              lineKey={line.lineKey}
              words={line.words}
              pageNumber={line.pageNumber}
              lineNumber={line.lineNumber}
              fontFamily={fontFamily}
              fontSize={fontSize}
              highlightedLineKeys={highlightedLineKeys}
              selectionMode={selectionMode}
              selectedVerseKeys={selectedVerseKeys}
            />
          ))}
        </View>
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
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    gap: 8,
  },
  containerWithSelection: {
    paddingBottom: 80, // Space for action buttons (48px buttons + 20px bottom + 12px gap)
  },
  versesContainer: {
    flex: 1,
  },
  linesContainer: {
    justifyContent: 'space-evenly',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
});

export default Page;
