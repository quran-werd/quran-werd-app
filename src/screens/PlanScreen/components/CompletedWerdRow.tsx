import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import Svg, {Path} from 'react-native-svg';
import Typography from '../../../components/shared/Typography';
import {colors} from '../../../styles/colors';
import {radius} from '../../../styles/radius';
import {spacing} from '../../../styles/spacing';
import {getSurahNameArabic, toArabicNumerals} from '../../../content';
import type {CompletedWerd} from '../../../services/revisionPlan.service';

function verseCount(werd: CompletedWerd) {
  return werd.range.to - werd.range.from + 1;
}

function CheckIcon({size = 14, color = colors.mergeSuccess}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 13l4 4L19 7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

interface CompletedWerdRowProps {
  werd: CompletedWerd;
}

export default function CompletedWerdRow({werd}: CompletedWerdRowProps) {
  const {t} = useTranslation();

  return (
    <View style={styles.row}>
      <View style={styles.orderBadge}>
        <Typography family="cairo" variant="caption">
          {toArabicNumerals(werd.order)}
        </Typography>
      </View>
      <View style={styles.textWrap}>
        <Typography family="amiri" weight="bold" style={styles.surahName}>
          {getSurahNameArabic(werd.surah)}
        </Typography>
        <Typography family="cairo" style={styles.range}>
          {t('plan.verseRange', {
            from: toArabicNumerals(werd.range.from),
            to: toArabicNumerals(werd.range.to),
            n: toArabicNumerals(verseCount(werd)),
          })}
        </Typography>
      </View>
      <View style={styles.checkBadge}>
        <CheckIcon size={12} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[12],
    paddingVertical: spacing[8],
    paddingHorizontal: spacing[12],
    borderRadius: radius.lg,
    backgroundColor: colors.mutedTintFaint,
  },
  orderBadge: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.mutedTintMedium,
  },
  textWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing[8],
  },
  surahName: {
    fontSize: 13,
    color: colors.mutedForeground,
  },
  range: {
    fontSize: 10,
    color: colors.mutedForeground,
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.mergeIconBg,
  },
});
