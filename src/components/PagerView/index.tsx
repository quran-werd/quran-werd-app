import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import PagerViewer from 'react-native-pager-view';
import {useAppSelector} from '../../store/hooks';
import {RootState} from '../../store';

export default function PagerView({children}: {children: React.ReactNode}) {
  const {currentPage} = useAppSelector((state: RootState) => state.pager);

  return (
    <PagerViewer style={styles.container} initialPage={currentPage}>
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
