import React from 'react';
import {StyleSheet, View, Text, NativeSyntheticEvent} from 'react-native';
import PagerViewer, {
  PagerViewOnPageSelectedEventData,
} from 'react-native-pager-view';

type Props = {
  initialPage: number;
  onPageSelected: (pageNumber: number) => void;
  children: React.ReactNode;
};

export default function PagerView({
  children,
  initialPage,
  onPageSelected,
}: Props) {
  const handlePageChange = (
    e: NativeSyntheticEvent<PagerViewOnPageSelectedEventData>,
  ) => onPageSelected(e.nativeEvent.position + 1);

  return (
    <PagerViewer
      style={styles.container}
      onPageSelected={handlePageChange}
      initialPage={initialPage - 1}>
      {children}
    </PagerViewer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#444',
  },
});
