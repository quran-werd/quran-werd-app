import {StyleSheet, ScrollView} from 'react-native';
import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {fetchChapters} from '../../features/Chapters/chaptersAction';
import ChapterListItem from '../ChapterListItem';

export default function Chapters() {
  const {list} = useAppSelector(state => state.chapters);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchChapters());
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {list.map(chapter => (
        <ChapterListItem key={chapter.id} chapter={chapter} />
      ))}
    </ScrollView>
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
