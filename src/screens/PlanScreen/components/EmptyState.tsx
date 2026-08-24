import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {useTranslation} from 'react-i18next';
import {LinearGradient} from 'expo-linear-gradient';
import Svg, {Path} from 'react-native-svg';
import Typography from '../../../components/shared/Typography';
import {colors} from '../../../styles/colors';
import {radius} from '../../../styles/radius';
import {spacing} from '../../../styles/spacing';
import {shadows} from '../../../styles/shadows';

function EmptyIcon() {
  return (
    <Svg width={44} height={44} viewBox="0 0 48 48" fill="none">
      <Path
        d="M8 40V12a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4v28l-8-4-8 4-8-4-8 4z"
        stroke="rgba(196,154,60,0.5)"
        strokeWidth={1.5}
      />
      <Path
        d="M16 18h16"
        stroke="rgba(196,154,60,0.4)"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path
        d="M16 24h10"
        stroke="rgba(196,154,60,0.4)"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

interface EmptyStateProps {
  onGenerate: () => void;
  loading: boolean;
}

export default function EmptyState({onGenerate, loading}: EmptyStateProps) {
  const {t} = useTranslation();
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyCircleWrap}>
        <View style={styles.emptyDashedRing} />
        <View style={styles.emptyCircle}>
          <EmptyIcon />
        </View>
      </View>
      <View style={styles.emptyTextBlock}>
        <Typography
          variant="subtitle"
          family="amiri"
          weight="bold"
          align="center">
          {t('plan.emptyTitle')}
        </Typography>
        <Typography
          variant="caption"
          family="cairo"
          color="muted"
          align="center"
          style={styles.emptyBody}>
          {t('plan.emptyBodyLine1')}
          {'\n'}
          {t('plan.emptyBodyLine2')}
        </Typography>
      </View>
      <Pressable
        onPress={onGenerate}
        disabled={loading}
        style={styles.emptyCta}>
        <LinearGradient
          colors={[colors.primaryHighlight, colors.primary]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.emptyCtaGradient}>
          <Typography
            variant="body"
            family="cairo"
            weight="semibold"
            style={[styles.emptyCtaText, {fontSize: 15}]}>
            {t('plan.generate')}
          </Typography>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[32],
    gap: spacing[24],
  },
  emptyCircleWrap: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyDashedRing: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 58,
    borderWidth: 1,
    borderColor: 'rgba(196,154,60,0.12)',
    borderStyle: 'dashed',
  },
  emptyCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(196,154,60,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(196,154,60,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTextBlock: {
    gap: spacing[8],
  },
  emptyBody: {
    fontSize: 13,
    lineHeight: 13 * 1.7,
  },
  emptyCta: {
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadows.primaryCta,
  },
  emptyCtaGradient: {
    paddingVertical: spacing[14] - 1,
    paddingHorizontal: spacing[32],
  },
  emptyCtaText: {
    color: colors.background,
  },
});
