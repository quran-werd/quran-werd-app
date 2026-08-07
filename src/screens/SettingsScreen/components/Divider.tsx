import React from 'react';
import {View, StyleSheet} from 'react-native';
import {colors} from '../../../styles/colors';
import {spacing} from '../../../styles/spacing';

export default function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: colors.goldBorderFaint,
    marginHorizontal: spacing[16],
  },
});
