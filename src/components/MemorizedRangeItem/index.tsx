import React, {useEffect, useState} from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import Svg, {Path} from 'react-native-svg';
import {colors} from '../../styles/colors';
import {radius} from '../../styles/radius';
import {MemorizedRange} from '../../types/memorization.types';
import Typography from '../shared/Typography';
import VerseRangeRow from '../shared/VerseRangeRow';
import {fetchAyahByKey} from '../../services/clients/quranCdnClient';

interface MemorizedRangeItemProps {
  range: MemorizedRange;
  surahNumber: number;
  onDelete?: () => void;
  showDeleteButton?: boolean;
}

function TrashIcon() {
  return (
    <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-.8 12.1a2 2 0 0 1-2 1.9H9.8a2 2 0 0 1-2-1.9L7 7"
        stroke={colors.destructive}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function MemorizedRangeItem({
  range,
  surahNumber,
  onDelete,
  showDeleteButton = false,
}: MemorizedRangeItemProps) {
  const [startVerse, setStartVerse] = useState<string | null>(null);
  const [endVerse, setEndVerse] = useState<string | null>(null);
  const hasRange = range.startVerse !== range.endVerse;

  const {t} = useTranslation();

  useEffect(() => {
    fetchAyahByKey(surahNumber, range.startVerse).then(setStartVerse);
  }, [surahNumber, range.startVerse]);

  useEffect(() => {
    if (hasRange) {
      fetchAyahByKey(surahNumber, range.endVerse).then(setEndVerse);
    }
  }, [surahNumber, range.endVerse, hasRange]);

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <VerseRangeRow
          verseNumber={range.startVerse}
          tone={hasRange ? 'from' : 'single'}
          text={startVerse}
        />
        {hasRange ? (
          <VerseRangeRow
            verseNumber={range.endVerse}
            tone="to"
            text={endVerse}
          />
        ) : null}
      </View>
      {showDeleteButton && onDelete ? (
        <View style={styles.footer}>
          <Typography family="cairo" style={styles.verseCountLabel}>
            {t('memorization.surah.verseCountShort', {
              count: range.endVerse - range.startVerse + 1,
            })}
          </Typography>
          <Pressable style={styles.deleteButton} onPress={onDelete}>
            <TrashIcon />
            <Typography style={styles.deleteLabel}>
              {t('common.delete')}
            </Typography>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.md,
    backgroundColor: colors.insetSubCard,
    borderWidth: 1,
    borderColor: colors.goldBorderSubtle,
    overflow: 'hidden',
  },
  body: {
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  footer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: colors.goldBorderFaint,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verseCountLabel: {
    fontSize: 11,
    color: colors.mutedForeground,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    borderRadius: radius.xxs,
    backgroundColor: colors.deleteButtonBg,
    borderWidth: 1,
    borderColor: colors.deleteButtonBorder,
  },
  deleteLabel: {
    color: colors.destructive,
    fontSize: 11,
  },
});
