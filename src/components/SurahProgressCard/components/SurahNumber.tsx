import React from 'react';
import {Badge, Typography} from '../../shared';
import {colors} from '../../../styles/colors';
import {StyleSheet} from 'react-native';

export default function SurahNumber({surahNumber}: {surahNumber: number}) {
  return (
    <Badge variant="light" size="medium" style={styles.surahNumber}>
      <Typography variant="small" weight="semibold" color="primary">
        {surahNumber}
      </Typography>
    </Badge>
  );
}

const styles = StyleSheet.create({
  surahNumber: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 10,
  },
});
