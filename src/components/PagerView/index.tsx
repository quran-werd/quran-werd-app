import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import PagerViewer from 'react-native-pager-view';

export const PagerView = ({children}) => {
  return (
    <PagerViewer style={styles.container} initialPage={0}>
      {children}
    </PagerViewer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#444',
  },
});
