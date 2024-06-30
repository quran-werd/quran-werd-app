import React from 'react';
import {PageTypes} from '../../types/page.types';
import {StyleSheet, Text} from 'react-native';

interface IProps {
  word: PageTypes.Word;
}
export default function Word({word}: IProps) {
  const {text, isVerseEnd, verseNumber} = word;

  return (
    <>
      {isVerseEnd && <Text>({verseNumber})</Text>}
      <Text style={styles.word}>{text}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  word: {
    fontSize: 20,
    fontFamily: 'ScheherazadeNew-Regular',
  },
});
