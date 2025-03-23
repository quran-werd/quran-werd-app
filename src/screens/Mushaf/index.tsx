import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import PagerView from '../../components/PagerView';
import {useAppSelector} from '../../store/hooks';
import {RootState} from '../../store';
import Page from '../../components/Page';

export const Mushaf = () => {
  const {currentPage} = useAppSelector((state: RootState) => state.pager);

  // Ensuring keys are unique and stable
  const pages = useMemo(
    () => Array.from({length: 5}, (_, i) => currentPage + i - 2),
    [currentPage],
  );

  return (
    <PagerView>
      {pages.map((pageNumber, index) => (
        <Page key={`${pageNumber}-${index}`} pageNumber={pageNumber} />
      ))}
    </PagerView>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#222',
  },
});
