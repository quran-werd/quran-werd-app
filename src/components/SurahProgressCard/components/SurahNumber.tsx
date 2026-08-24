import React from 'react';
import {StyleSheet} from 'react-native';
import {Badge, Typography} from '../../shared';
import {radius} from '../../../styles/radius';
import {toArabicNumerals} from '../../../content';

export default function SurahNumber({surahNumber}: {surahNumber: number}) {
  return (
    <Badge
      size={28}
      backgroundColor="rgba(196,154,60,0.1)"
      style={styles.surahNumber}>
      <Typography family="cairo" color="primary" variant="caption">
        {toArabicNumerals(surahNumber)}
      </Typography>
    </Badge>
  );
}

const styles = StyleSheet.create({
  surahNumber: {
    borderRadius: radius.full,
  },
});
