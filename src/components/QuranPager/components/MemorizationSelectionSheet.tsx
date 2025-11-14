import React, {useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import {Icon, Button} from '@ui-kitten/components';
import {colors} from '../../../styles/colors';
import {Verse} from '../types';
import {MemorizedRange} from '../../../types/memorization.types';
import {useAppSelector, useAppDispatch} from '../../../store/hooks';
import {
  selectRanges,
  removeRange,
} from '../../../features/Memorization/verseSelectionSlice';
import {
  parseVerseKey,
  getVerseTextFromWords,
  calculateRangeStats,
} from '../utils/verseSelection.utils';
import {getSurahNameArabic} from '../../../content';
import MemorizedRangeItem from '../../MemorizedRangeItem';

interface MemorizationSelectionSheetProps {
  visible: boolean;
  onClose: () => void;
  onSave: (ranges: MemorizedRange[]) => void;
  verses: Verse[]; // All verses from current page(s) for text extraction
}

const CloseIcon = (props: any) => <Icon {...props} name="close-outline" />;

/**
 * Bottom sheet component for displaying and managing selected memorization ranges
 */
export const MemorizationSelectionSheet: React.FC<
  MemorizationSelectionSheetProps
> = ({visible, onClose, onSave, verses}) => {
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
        wordCount: stats.wordCount,
        verseCount: stats.verseCount,
      };
    });
  }, [ranges, verses]);

  // Calculate summary stats
  const totalStats = useMemo(() => {
    return memorizedRanges.reduce(
      (acc, range) => ({
        verseCount: acc.verseCount + range.verseCount,
        wordCount: acc.wordCount + range.wordCount,
      }),
      {verseCount: 0, wordCount: 0},
    );
  }, [memorizedRanges]);

  const handleDelete = (rangeId: string) => {
    handleRemoveRange(rangeId);
  };

  const handleSave = () => {
    onSave(memorizedRanges);
  };

  console.log('memorizedRanges', memorizedRanges);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.overlayPressable} onPress={onClose} />
        <View style={styles.container}>
          {/* Handle bar */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Memorization Ranges</Text>
            <Button
              appearance="ghost"
              status="basic"
              accessoryLeft={CloseIcon}
              onPress={onClose}
              style={styles.closeButton}
              size="small"
            />
          </View>

          {/* Summary */}
          {memorizedRanges.length > 0 && (
            <View style={styles.summary}>
              <Text style={styles.summaryText}>
                {memorizedRanges.length} range
                {memorizedRanges.length !== 1 ? 's' : ''} •{' '}
                {totalStats.verseCount} verses • {totalStats.wordCount} words
              </Text>
            </View>
          )}

          {/* Ranges list */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}>
            {memorizedRanges.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No ranges selected. Tap verses to create ranges.
                </Text>
              </View>
            ) : (
              memorizedRanges.map(range => (
                <MemorizedRangeItem
                  key={range.id}
                  range={range}
                  onDelete={handleDelete}
                  showDeleteButton={true}
                />
              ))
            )}
          </ScrollView>

          {/* Save button */}
          {memorizedRanges.length > 0 && (
            <View style={styles.footer}>
              <Pressable
                onPress={handleSave}
                style={styles.saveButton}
                disabled={memorizedRanges.length === 0}>
                <Text style={styles.saveButtonText}>Save</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayPressable: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  closeButton: {
    width: 32,
    height: 32,
  },
  summary: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.text.light,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
