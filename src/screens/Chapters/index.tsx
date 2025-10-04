import React, {useEffect} from 'react';
import {StyleSheet, ScrollView, SafeAreaView, I18nManager} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {fetchChapters} from '../../features/Chapters/chaptersAction';
import {colors} from '../../styles/colors';
import ChapterListItem from '../../components/ChapterListItem';

export default function Chapters() {
  const {list} = useAppSelector(state => state.chapters);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Force RTL layout
    I18nManager.forceRTL(true);
    dispatch(fetchChapters());
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        {list.map(chapter => (
          <ChapterListItem key={chapter.id} chapter={chapter} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
  },
});
