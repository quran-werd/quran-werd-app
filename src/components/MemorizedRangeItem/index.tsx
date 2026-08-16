import React, {useEffect, useState} from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import Svg, {Path} from 'react-native-svg';
import {colors} from '../../styles/colors';
import {radius} from '../../styles/radius';
import {MemorizedRange} from '../../types/memorization.types';
import Typography from '../shared/Typography';
import {fetchAyahByKey} from '../../services/clients/quranCdnClient';
import {toArabicNumerals} from '../../content';

interface MemorizedRangeItemProps {
  range: MemorizedRange;
  surahNumber: number;
  onDelete?: () => void;
  showDeleteButton?: boolean;
}

function VerseBadge({label, tone}: {label: number; tone: 'from' | 'to'}) {
  return (
    <View
      style={[
        styles.verseBadge,
        tone === 'from' ? styles.verseBadgeFrom : styles.verseBadgeTo,
      ]}>
      <Typography
        family="cairo"
        weight="bold"
        style={
          tone === 'from' ? styles.verseBadgeTextFrom : styles.verseBadgeTextTo
        }>
        {toArabicNumerals(label)}
      </Typography>
    </View>
  );
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
        <View style={styles.rangeRow}>
          <VerseBadge label={range.startVerse} tone="from" />
          <Typography family="cairo" style={styles.rowLabel}>
            {hasRange
              ? t('memorization.surah.from')
              : t('memorization.surah.single')}
          </Typography>
          <Typography
            family="amiriQuran"
            numberOfLines={1}
            style={[styles.verseText, styles.verseTextFrom]}>
            {startVerse}
          </Typography>
        </View>
        {hasRange ? (
          <View style={styles.rangeRow}>
            <VerseBadge label={range.endVerse} tone="to" />
            <Typography family="cairo" style={styles.rowLabel}>
              {t('memorization.surah.to')}
            </Typography>
            <Typography
              family="amiriQuran"
              numberOfLines={1}
              style={[styles.verseText, styles.verseTextTo]}>
              {endVerse}
            </Typography>
          </View>
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
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verseBadge: {
    width: 20,
    height: 20,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  verseBadgeFrom: {
    backgroundColor: 'rgba(196,154,60,0.12)',
  },
  verseBadgeTo: {
    backgroundColor: colors.mutedTintSubtle,
  },
  verseBadgeTextFrom: {
    color: colors.primary,
    fontSize: 8,
    lineHeight: 20,
  },
  verseBadgeTextTo: {
    color: colors.mutedForeground,
    fontSize: 8,
    lineHeight: 20,
  },
  rowLabel: {
    fontSize: 10,
    color: colors.mutedForeground,
  },
  verseText: {
    flex: 1,
    fontSize: 12,
  },
  verseTextFrom: {
    color: colors.dimmedForeground,
  },
  verseTextTo: {
    color: colors.dimmedForeground,
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
