import React from 'react';
import {View, StyleSheet} from 'react-native';
import Skeleton from '../../../components/shared/Skeleton';
import {radius} from '../../../styles/radius';
import {spacing} from '../../../styles/spacing';

export default function LoadingState() {
  return (
    <View style={styles.container}>
      <Skeleton width="100%" height={88} borderRadius={radius.lg} />
      <View style={styles.list}>
        {[0, 1, 2, 3].map(i => (
          <Skeleton
            key={i}
            width="100%"
            height={64}
            borderRadius={radius.md}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[16],
    paddingTop: spacing[16],
    gap: spacing[16],
  },
  list: {
    gap: spacing[12],
  },
});
