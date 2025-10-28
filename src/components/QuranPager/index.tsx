import React from 'react';
import {View, Text, StyleSheet, ScrollView, SafeAreaView} from 'react-native';
import {
  getPageData,
  getPageQCFontName,
  getVerseQCF,
  getJuzNumber,
  getSurahName,
} from '../../content';

export default function QuranPager() {
  // Render page 1 of the Quran
  const pageNumber = 3;
  const pageData = getPageData(pageNumber);
  const fontName = getPageQCFontName(pageNumber);

  // Build all verses as a single string
  const allVerses = pageData
    .map((section, sectionIndex) => {
      const {surah, start, end} = section;

      // Add surah separator if not first section
      const surahSeparator = sectionIndex > 0 ? `${getSurahName(surah)}\n` : '';

      // Get all verses in this section
      const verses = Array.from({length: end - start + 1}, (_, i) => {
        const verseNumber = start + i;
        return getVerseQCF(surah, verseNumber);
      }).join(' '); // Join with space so verses flow naturally

      return surahSeparator + verses;
    })
    .join(' '); // Join all sections with space

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Page {pageNumber} | Juz{' '}
          {getJuzNumber(pageData[0].surah, pageData[0].start)}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}>
        <Text style={[styles.verse, {fontFamily: fontName}]}>{allVerses}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCE7',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  verse: {
    fontSize: 22, // Slightly smaller
    textAlign: 'center', // RIGHT, not center!
    direction: 'rtl', // Explicit RTL
    color: '#1a1a1a',
    lineHeight: 40, // More spacing
    width: '100%',
  },
});
