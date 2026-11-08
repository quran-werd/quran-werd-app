import React from 'react';
import {
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {colors} from '../../../styles/colors';
import {radius} from '../../../styles/radius';
import {shadows} from '../../../styles/shadows';
import Typography from '../Typography';

type Variant = 'primary' | 'secondary' | 'ghost' | 'ghostActive';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const content = loading ? (
    <ActivityIndicator
      color={variant === 'primary' && !isDisabled ? colors.background : colors.primary}
    />
  ) : (
    <Typography
      variant="body"
      family="cairo"
      weight="semibold"
      color="primary"
      style={[
        variant === 'primary' && !isDisabled && styles.primaryText,
        (variant === 'ghost' || variant === 'ghostActive') && styles.ghostText,
        variant === 'ghostActive' && styles.ghostActiveText,
        textStyle,
      ]}>
      {title}
    </Typography>
  );

  if (variant === 'primary' && !isDisabled) {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        style={({pressed}) => [
          fullWidth && styles.fullWidth,
          pressed && styles.pressed,
          style,
        ]}>
        <LinearGradient
          colors={[colors.primaryHighlight, colors.primary, colors.primaryShadow]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={[styles.button, styles.primaryGradient, shadows.primaryCta]}>
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({pressed}) => [
        styles.button,
        fullWidth && styles.fullWidth,
        variantStyle(variant, isDisabled),
        pressed && !isDisabled && styles.pressed,
        style,
      ]}>
      {content}
    </Pressable>
  );
}

function variantStyle(variant: Variant, isDisabled: boolean): ViewStyle {
  if (isDisabled) {
    return styles.buttonDisabled;
  }
  switch (variant) {
    case 'secondary':
      return styles.buttonSecondary;
    case 'ghostActive':
      return styles.buttonGhostActive;
    case 'ghost':
    default:
      return styles.buttonGhost;
  }
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    minHeight: 44,
  },
  fullWidth: {
    width: '100%',
  },
  pressed: {
    transform: [{scale: 0.97}],
  },
  primaryGradient: {
    borderRadius: radius.xl2,
    paddingVertical: 16,
  },
  primaryText: {
    color: colors.background,
  },
  buttonSecondary: {
    backgroundColor: colors.goldTintMedium,
    borderWidth: 1,
    borderColor: colors.goldBorderStrong,
  },
  buttonGhost: {
    backgroundColor: colors.mutedTintSubtle,
    borderWidth: 1,
    borderColor: colors.mutedBorderMedium,
  },
  buttonGhostActive: {
    backgroundColor: colors.goldTintMedium,
    borderWidth: 1,
    borderColor: colors.goldBorderStrong,
  },
  ghostText: {
    color: colors.mutedForeground,
  },
  ghostActiveText: {
    color: colors.primary,
  },
  buttonDisabled: {
    backgroundColor: colors.mutedTintMedium,
  },
});
