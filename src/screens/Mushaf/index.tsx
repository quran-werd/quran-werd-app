import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PagerView from '../../components/PagerView';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {RootState} from '../../store';
import Page from '../../components/Page';
import {MushafProps} from '../../routes/ChaptersStack';
import {setCurrentPage} from '../../features/Pager/pagerSlice';

const PAGES_COUNT = 604;

const QURAN_PAGES = [...Array(PAGES_COUNT)];

export const Mushaf = ({route}: MushafProps) => {
  const [pages, setPages] = useState<number[]>([]);
  const {currentPage} = useAppSelector((state: RootState) => state.pager);

  const {pageNumber} = route.params;

  const dispatch = useAppDispatch();

  const handlePageChange = (pageNumber: number) => {
    setPages(_getSroundingPages(pageNumber));

    dispatch(setCurrentPage(pageNumber));
  };

  useEffect(() => {
    pageNumber && setPages(_getSroundingPages(pageNumber));
  }, [pageNumber]);

  useEffect(() => {
    console.log(1111, {currentPage});
  }, [currentPage]);

  return (
    <PagerView initialPage={pageNumber} onPageSelected={handlePageChange}>
      {QURAN_PAGES.map((_, index) => (
        <View key={`${index}`} style={styles.page}>
          {index + 1 >= currentPage - 2 && index + 1 <= currentPage + 2 && (
            <Page pageNumber={index + 1} />
          )}
        </View>
      ))}
    </PagerView>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#444',
  },
});

function _getSroundingPages(currentPage: number) {
  return Array.from({length: 5}, (_, i) => currentPage + i - 2);
}
