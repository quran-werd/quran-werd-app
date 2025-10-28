import {StyleSheet, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {fetchVersesFullInfo} from '../../features/Chapter/chapterAction';
import {ChapterProps} from '../../routes/ChaptersStack';
import Chapter from '../../components/Chapter';
import {getPageQCFontName} from '../../content';

const PAGE_NUMBER = 5;

export default function Page({route}: ChapterProps) {
  const {content: page} = useAppSelector(state => state.chapter);
  const lineNumber = useRef(0);

  const {chapterNumber} = route.params;

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchVersesFullInfo(PAGE_NUMBER));
  }, []);

  return (
    <View style={[styles.container]}>
      {page.map(chapter => (
        <Chapter key={chapter.chapterNumber} chapter={chapter} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 16,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    direction: 'rtl',
    textAlign: 'right',
  },
});
