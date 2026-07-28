import React from 'react';
import {Pressable, View, StyleSheet} from 'react-native';
import {colors} from '../../../styles/colors';
import {radius} from '../../../styles/radius';
import Typography from '../Typography';

interface SegmentOption<T extends string> {
  label: string;
  value: T;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

// Segmented control (theme toggle, daily/weekly view) — see docs/design.md §2.15.
export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <View style={styles.outer}>
      {options.map(option => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.segment, active && styles.segmentActive]}>
            <Typography
              variant="small"
              weight={active ? 'semibold' : 'regular'}
              color={active ? 'primary' : 'muted'}>
              {option.label}
            </Typography>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: 'rgba(8,14,24,0.8)',
    borderRadius: radius.xs,
    padding: 3,
    gap: 2,
    borderWidth: 1,
    borderColor: 'rgba(196,154,60,0.12)',
  },
  segment: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: radius.tiny,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  segmentActive: {
    backgroundColor: colors.goldWashStrong,
    borderColor: 'rgba(196,154,60,0.32)',
  },
});
