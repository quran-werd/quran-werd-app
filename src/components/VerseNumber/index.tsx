import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface IProps {
  verseNumber: number;
}
export default function VerseNumber({verseNumber}: IProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.symbol}>&#x06DD;</Text>
      <Text style={styles.verseNumber}>{verseNumber}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  verseNumber: {
    fontSize: 14,
    color: '#0f0f0f',
    position: 'absolute',
    fontFamily: 'ScheherazadeNew-Regular',
  },
  symbol: {
    color: '#0f0f0f',
    fontSize: 22,
  },
});
