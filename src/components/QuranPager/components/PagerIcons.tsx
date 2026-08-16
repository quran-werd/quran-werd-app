import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {colors} from '../../../styles/colors';

export function CloseIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 6l12 12M18 6 6 18"
        stroke={colors.mutedForeground}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function SearchIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.35-4.35"
        stroke={colors.foreground}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function UndoIcon({disabled}: {disabled?: boolean}) {
  return (
    <Svg width={16} height={16} viewBox="0 2.5 24 24" fill="none">
      <Path
        d="M9 7 4 12l5 5M4 12h11a5 5 0 0 1 0 10h-1"
        stroke={disabled ? colors.mutedForeground : colors.foreground}
        strokeOpacity={disabled ? 0.4 : 1}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function RedoIcon({disabled}: {disabled?: boolean}) {
  return (
    <Svg width={16} height={16} viewBox="0 2.5 24 24" fill="none">
      <Path
        d="M15 7l5 5-5 5M20 12H9a5 5 0 0 0 0 10h1"
        stroke={disabled ? colors.mutedForeground : colors.foreground}
        strokeOpacity={disabled ? 0.4 : 1}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

interface IconButtonProps {
  onPress: () => void;
  disabled?: boolean;
  size?: number;
  children: React.ReactNode;
}

export function IconButton({
  onPress,
  disabled,
  size = 36,
  children,
}: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.iconButton,
        {width: size, height: size, borderRadius: size / 2},
        disabled && styles.iconButtonDisabled,
      ]}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    backgroundColor: colors.mutedTintSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonDisabled: {
    opacity: 0.3,
  },
});
