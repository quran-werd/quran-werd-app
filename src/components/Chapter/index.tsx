import {StyleSheet, ScrollView, View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {fetchVersesFullInfo} from '../../features/Chapter/chapterAction';
import {ChapterProps} from '../../routes/ChaptersStack';

export default function Chapter({route}: ChapterProps) {
  const {verses, versesInfo} = useAppSelector(state => state.chapter);

  const {chapterNumber} = route.params;

  const dispatch = useAppDispatch();

  console.log(1111, {verses, versesInfo, chapterNumber});

  useEffect(() => {
    dispatch(fetchVersesFullInfo(chapterNumber));
  }, []);

  return (
    <View>
      {verses.map(verse => (
        <Text>{verse.text_uthmani}</Text>
      ))}
    </View>
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
});
