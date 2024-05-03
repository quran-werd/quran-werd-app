import {StyleSheet, ScrollView, View, Text} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {fetchVersesFullInfo} from '../../features/Chapter/chapterAction';
import {ChapterProps} from '../../routes/ChaptersStack';
import {PagerView} from '../../components/PagerView';
import {preparePageLines} from '../../features/Chapter/utils';

const PAGE_NUMBER = 602;

export default function Chapter({route}: ChapterProps) {
  const {lines} = useAppSelector(state => state.chapter);
  const lineNumber = useRef(0);

  const {chapterNumber} = route.params;

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchVersesFullInfo(PAGE_NUMBER));
  }, []);

  return (
    <PagerView>
      <View key="1">
        {Object.keys(lines).map(lineNumber => {
          const lineWords = lines[+lineNumber];

          const isNewChapter = lineWords[0].isNewChapter;

          if (isNewChapter) {
            return <Text>{lineWords[0].chapterNumber}</Text>;
          }

          return (
            <View key={lineNumber} style={styles.line}>
              {lineWords.map(word => {
                if (word.isVerseEnd) {
                  return (
                    <Text key={word.verseNumber}>({word.verseNumber})</Text>
                  );
                }

                return <Text key={word.text}>{word.text} </Text>;
              })}
            </View>
          );
        })}
      </View>
      <View key="2">
        <Text>2222</Text>
      </View>
    </PagerView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    gap: 4,
    padding: 4,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    direction: 'rtl',
    textAlign: 'right',
  },
});
