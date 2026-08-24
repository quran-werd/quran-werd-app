import React from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import Typography from '../../../components/shared/Typography';
import {colors} from '../../../styles/colors';
import {spacing} from '../../../styles/spacing';

interface RowProps {
  label: string;
  sublabel?: string;
  trailing?: React.ReactNode;
  destructive?: boolean;
  onPress?: () => void;
}

export default function Row({
  label,
  sublabel,
  trailing,
  destructive,
  onPress,
}: RowProps) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={styles.row}>
      <View style={styles.rowTextWrap}>
        <Typography
          family="cairo"
          style={[styles.rowLabel, destructive && styles.destructiveLabel]}>
          {label}
        </Typography>
        {sublabel ? (
          <Typography family="cairo" style={styles.rowSublabel}>
            {sublabel}
          </Typography>
        ) : null}
      </View>
      {trailing}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: spacing[14],
    paddingHorizontal: spacing[16],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing[12],
  },
  rowTextWrap: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    fontSize: 15,
    color: colors.foreground,
  },
  rowSublabel: {
    fontSize: 12,
    color: 'rgba(138,154,184,0.6)',
  },
  destructiveLabel: {
    color: colors.destructiveSettings,
  },
});
