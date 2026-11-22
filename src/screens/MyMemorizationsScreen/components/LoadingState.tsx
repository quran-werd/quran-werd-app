import React from 'react';
import {View, StyleSheet} from 'react-native';
import Skeleton from '../../../components/shared/Skeleton';
import {radius} from '../../../styles/radius';
import {spacing} from '../../../styles/spacing';

export default function LoadingState() {
  return (
    <View style={styles.container}>
      {[0, 1, 2].map(i => (
        <View key={i} style={styles.card}>
          <Skeleton width={120} height={16} style={styles.title} />
          <Skeleton width="100%" height={40} borderRadius={radius.md} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[24],
    paddingTop: spacing[24],
    gap: spacing[20],
  },
  card: {
    gap: spacing[12],
  },
  title: {
    marginBottom: spacing[4],
  },
});
