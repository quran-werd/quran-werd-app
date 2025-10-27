import React from 'react';
import {View, Text, StyleSheet, ScrollView, SafeAreaView} from 'react-native';
import {getPageQCFontName, getVerseQCF} from '../../content';

export default function QuranPager() {
  // Render first chapter (Al-Fatiha) - 7 verses
  const surahNumber = 2;
  const verseCount = 286;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Surah Al-Fatiha</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}>
        {Array.from({length: verseCount}, (_, i) => {
          const verseNumber = i + 1;
          const verseText = getVerseQCF(surahNumber, verseNumber);

          return (
            <View key={`verse-${verseNumber}`} style={styles.verseContainer}>
              <Text style={[styles.verse, {fontFamily: getPageQCFontName(3)}]}>
                {verseText}
              </Text>
            </View>
          );
        })}
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  verseContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingVertical: 8,
  },
  verseNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginRight: 12,
    width: 30,
    textAlign: 'center',
  },
  verse: {
    flex: 1,
    fontSize: 24,
    lineHeight: 36,
    textAlign: 'right',
    color: '#1a1a1a',
    fontFamily: 'ScheherazadeNew-Regular',
  },
});
