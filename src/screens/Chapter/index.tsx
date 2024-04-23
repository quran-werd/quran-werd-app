import {StyleSheet, ScrollView, View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {fetchVersesFullInfo} from '../../features/Chapter/chapterAction';
import {ChapterProps} from '../../routes/ChaptersStack';
import {PagerView} from '../../components/PagerView';

export default function Chapter({route}: ChapterProps) {
  const {verses, versesInfo} = useAppSelector(state => state.chapter);

  const {chapterNumber} = route.params;

  const dispatch = useAppDispatch();

  console.log(1111, {verses, versesInfo, chapterNumber});

  useEffect(() => {
    dispatch(fetchVersesFullInfo(602));
  }, []);

  return (
    <PagerView>
      <View key="1">
        <Text>1111</Text>
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
});
