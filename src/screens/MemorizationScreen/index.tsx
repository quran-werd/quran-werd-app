import React, {useCallback} from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import QuranPager from '../../components/QuranPager';
import {MemorizationScreenProps} from '../../navigation/MemorizationStack';
import {SaveMemorizationRange} from '../../types/memorization.types';
import {addMemorizationRange} from '../../features/Memorization/memorizationAction';
import {useAppDispatch} from '../../store/hooks';

export default function MemorizationScreen({route}: MemorizationScreenProps) {
  const initialPage = route.params?.initialPage || 1;
  const dispatch = useAppDispatch();

  const handleSave = useCallback(
    async (ranges: SaveMemorizationRange[]) => {
      for (const range of ranges) {
        await dispatch(
          addMemorizationRange({
            surah: range.chapterId,
            from: range.startVerse,
            to: range.endVerse,
          }),
        ).unwrap();
      }
    },
    [dispatch],
  );

  return (
    <SafeAreaView style={styles.container}>
      <QuranPager
        initialPage={initialPage}
        fontSize={22}
        showHeader={true}
        selectionMode={true}
        onSave={handleSave}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
});
