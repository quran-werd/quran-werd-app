import React from 'react';
import {StyleSheet} from 'react-native';
import Typography from '../../../components/shared/Typography';
import {spacing} from '../../../styles/spacing';

interface SectionLabelProps {
  children: React.ReactNode;
}

export default function SectionLabel({children}: SectionLabelProps) {
  return (
    <Typography family="cairo" weight="bold" style={styles.sectionLabel}>
      {children}
    </Typography>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 11,
    color: 'rgba(138,154,184,0.55)',
    letterSpacing: 0.07 * 11,
    paddingTop: spacing[22],
    paddingBottom: spacing[8],
    paddingHorizontal: spacing[4],
  },
});
