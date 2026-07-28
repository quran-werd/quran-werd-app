import React, {useMemo} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {useTranslation} from 'react-i18next';
import BottomSheet from '../../shared/BottomSheet';
import Button from '../../shared/Button';
import Typography from '../../shared/Typography';
import {colors} from '../../../styles/colors';
import {Verse} from '../../../types/quran-pager.types';
import {
  MemorizedRange,
  SaveMemorizationRange,
} from '../../../types/memorization.types';
import {useAppSelector, useAppDispatch} from '../../../store/hooks';
import {
  selectRanges,
  removeRange,
} from '../../../features/Memorization/memorizationSelectionSlice';
import {
  parseVerseKey,
  getVerseTextFromWords,
  calculateRangeStats,
} from '../utils/verseSelection.utils';
import {getSurahNameArabic} from '../../../content';
import MemorizedRangeItem from '../../MemorizedRangeItem';
import {mapMemorizedRangesToSaveMemorizationRequest} from '../../../utils/helpers.utils';

interface MemorizationSelectionSheetProps {
  visible: boolean;
  onClose: () => void;
  onSave: (ranges: SaveMemorizationRange[]) => void | Promise<void>;
  verses: Verse[]; // All verses from current page(s) for text extraction
}

/**
 * Bottom sheet component for displaying and managing selected memorization ranges
 */
export const MemorizationSelectionSheet: React.FC<
  MemorizationSelectionSheetProps
> = ({visible, onClose, onSave, verses}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const ranges = useAppSelector(selectRanges);

  const handleRemoveRange = (rangeId: string) => {
    dispatch(removeRange(rangeId));
  };

  // Convert VerseRange[] to MemorizedRange[] format
  const memorizedRanges: MemorizedRange[] = useMemo(() => {
    return ranges.map(range => {
      const startParsed = parseVerseKey(range.startVerseKey);
      const endParsed = parseVerseKey(range.endVerseKey);

      // Find start and end verses to extract text
      const startVerse = verses.find(v => v.verseKey === range.startVerseKey);
      const endVerse = verses.find(v => v.verseKey === range.endVerseKey);

      const startText = startVerse
        ? getVerseTextFromWords(startVerse.words)
        : '';
      const endText = endVerse ? getVerseTextFromWords(endVerse.words) : '';

      const stats = calculateRangeStats(range, verses);
      const surahName = getSurahNameArabic(range.surahId);

      return {
        id: range.id,
        startVerse: startParsed.verseNumber,
        endVerse: endParsed.verseNumber,
        startText: startText || `${surahName} - ${startParsed.verseNumber}`,
        endText: endText || `${surahName} - ${endParsed.verseNumber}`,
        wordsCount: stats.wordCount,
        versesCount: stats.verseCount,
        chapterNumber: range.chapterNumber,
      };
    });
  }, [ranges, verses]);

  // Group ranges by surah for display (docs/design.md §2.11)
  const groupedRanges = useMemo(() => {
    const groups = new Map<number, MemorizedRange[]>();
    memorizedRanges.forEach(range => {
      const group = groups.get(range.chapterNumber) ?? [];
      group.push(range);
      groups.set(range.chapterNumber, group);
    });
    return Array.from(groups.entries()).sort(([a], [b]) => a - b);
  }, [memorizedRanges]);

  // Calculate summary stats
  const totalStats = useMemo(() => {
    return memorizedRanges.reduce(
      (acc, range) => ({
        verseCount: acc.verseCount + range.versesCount,
        wordCount: acc.wordCount + range.wordsCount,
      }),
      {verseCount: 0, wordCount: 0},
    );
  }, [memorizedRanges]);

  const handleDelete = (rangeId: string) => {
    handleRemoveRange(rangeId);
  };

  const handleSave = async () => {
    try {
      await onSave(
        mapMemorizedRangesToSaveMemorizationRequest(memorizedRanges),
      );
      onClose();
    } catch (error) {
      // Save failed, don't close the sheet
      console.error('Failed to save memorization ranges:', error);
    }
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title={t('memorization.selection.title')}>
      {memorizedRanges.length > 0 ? (
        <View style={styles.summary}>
          <Typography variant="small" color="muted">
            {t('memorization.selection.totalSummary', {
              rangeCount: memorizedRanges.length,
              verseCount: totalStats.verseCount,
            })}
          </Typography>
        </View>
      ) : null}

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {memorizedRanges.length === 0 ? (
          <View style={styles.emptyState}>
            <Typography variant="body" color="muted" align="center">
              {t('memorization.selection.emptyState')}
            </Typography>
          </View>
        ) : (
          groupedRanges.map(([chapterNumber, group]) => (
            <View key={chapterNumber} style={styles.group}>
              <Typography variant="small" family="amiriBold" style={styles.groupLabel}>
                {getSurahNameArabic(chapterNumber)}
              </Typography>
              <View style={styles.groupItems}>
                {group.map(range => (
                  <MemorizedRangeItem
                    key={range.id}
                    range={range}
                    surahNumber={range.chapterNumber}
                    onDelete={() => handleDelete(range.id)}
                    showDeleteButton
                  />
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {memorizedRanges.length > 0 ? (
        <View style={styles.footer}>
          <Button
            title={t('memorization.selection.saveButton')}
            onPress={handleSave}
            fullWidth
          />
        </View>
      ) : null}
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  summary: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.goldBorderFaint,
  },
  scrollView: {
    maxHeight: 380,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  group: {
    gap: 8,
  },
  groupLabel: {
    paddingHorizontal: 4,
  },
  groupItems: {
    gap: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
    borderTopWidth: 1,
    borderTopColor: colors.goldBorderFaint,
  },
});
