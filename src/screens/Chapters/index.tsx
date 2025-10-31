import React, {useEffect, useMemo} from 'react';
import {StyleSheet, ScrollView, SafeAreaView, I18nManager} from 'react-native';
import {colors} from '../../styles/colors';
import ChapterListItem from '../../components/ChapterListItem';
import {surah} from '../../content/surah_data';

export default function Chapters() {
  useEffect(() => {
    // Force RTL layout
    I18nManager.forceRTL(true);
  }, []);

  // Transform local surah data to match API Chapter structure
  const chapters = useMemo(
    () =>
      surah.map(s => ({
        id: s.id,
        name_arabic: s.arabic,
        verses_count: s.aya,
        revelation_place: s.place.toLowerCase(),
      })),
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        {chapters.map(chapter => (
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
