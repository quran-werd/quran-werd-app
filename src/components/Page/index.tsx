import React, {useEffect, useMemo} from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import Line from '../Line';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {RootState} from '../../store';
import {fetchVersesFullInfo} from '../../features/Page/pageAction';
import {IMAGES} from '../../common';

const Page: React.FC<{pageNumber: number}> = ({pageNumber}) => {
  const {pages} = useAppSelector((state: RootState) => state.page);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (pages[pageNumber]) {
      return;
    }

    dispatch(fetchVersesFullInfo(pageNumber));
  }, [pageNumber]);

  return (
    <ImageBackground
      style={styles.container}
      source={IMAGES.mushafFrame}
      resizeMode="cover">
      {pages[pageNumber]?.map((chapter, index) => (
        <View style={styles.page} key={`${chapter.chapterNumber}-${index}`}>
          {chapter.lines.map((line, lineIndex) => (
            <Line key={`${line.lineNumber}-${lineIndex}`} line={line} />
          ))}
        </View>
      ))}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  page: {
    flex: 1,
    justifyContent: 'space-between',
  },
});

export default Page;
