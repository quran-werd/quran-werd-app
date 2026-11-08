import React, {useEffect, useMemo, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {useTranslation} from 'react-i18next';
import Svg, {Path} from 'react-native-svg';
import BottomSheet from '../../shared/BottomSheet';
import Button from '../../shared/Button';
import Typography from '../../shared/Typography';
import {colors} from '../../../styles/colors';
import {radius} from '../../../styles/radius';
import {Verse} from '../../../types/quran-pager.types';
import {
  MemorizedRange,
  SaveMemorizationRange,
} from '../../../types/memorization.types';
import {useAppSelector, useAppDispatch} from '../../../store/hooks';
import {
  selectRanges,
  removeRange,
  clearRanges,
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
  onSaved?: () => void;
  verses: Verse[]; // All verses from current page(s) for text extraction
}

/**
 * Bottom sheet component for displaying and managing selected memorization ranges
 */
export const MemorizationSelectionSheet: React.FC<
  MemorizationSelectionSheetProps
> = ({visible, onClose, onSave, onSaved, verses}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const ranges = useAppSelector(selectRanges);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSucceeded, setSaveSucceeded] = useState(false);

  // Reset the success view whenever the sheet is dismissed, so reopening it
  // for a new selection starts back on the ranges list.
  useEffect(() => {
    if (!visible) {
      setSaveSucceeded(false);
    }
  }, [visible]);

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
    setIsSaving(true);
    try {
      await onSave(
        mapMemorizedRangesToSaveMemorizationRequest(memorizedRanges),
      );
      dispatch(clearRanges());
      setSaveSucceeded(true);
    } catch (error) {
      // Save failed, don't close the sheet
      console.error('Failed to save memorization ranges:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Close this sheet's Modal first and only navigate once it has finished
  // dismissing — closing a Modal and unmounting the screen in the same tick
  // (e.g. via navigation.goBack) can freeze the app.
  const handleSuccessConfirm = () => {
    onClose();
    setTimeout(() => onSaved?.(), 300);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title={t('memorization.selection.title')}>
      {saveSucceeded ? (
        <View style={styles.successState}>
          <View style={styles.successIconCircle}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M5 13l4 4L19 7"
                stroke={colors.primary}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
          <Typography
            variant="subtitle"
            family="amiri"
            weight="bold"
            align="center"
            style={styles.successTitle}>
            {t('memorization.selection.successTitle')}
          </Typography>
          <Typography color="muted" align="center" variant="caption">
            {t('memorization.selection.successMessage')}
          </Typography>
          <View style={styles.footer}>
            <Button
              title={t('common.ok')}
              onPress={handleSuccessConfirm}
              fullWidth
            />
          </View>
        </View>
      ) : (
        <>
          {memorizedRanges.length > 0 ? (
            <View style={styles.summary}>
              <Typography variant="caption" color="muted">
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
                  <Typography variant="caption" family="amiriBold" style={styles.groupLabel}>
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
                loading={isSaving}
                fullWidth
              />
            </View>
          ) : null}
        </>
      )}
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
  successState: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  successIconCircle: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: 'rgba(196,154,60,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(196,154,60,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  successTitle: {
    marginBottom: 8,
  },
});
