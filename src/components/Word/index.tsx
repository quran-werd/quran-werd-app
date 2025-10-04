import React from 'react';
import {PageTypes} from '../../types/page.types';
import {StyleSheet, Text} from 'react-native';

interface IProps {
  word: PageTypes.Word;
  isLastWord: boolean;
}
export default function Word({word, isLastWord}: IProps) {
  const {text, isVerseEnd, verseNumber} = word;

  return (
    <>
      {!!text && <Text style={styles.word}>{` ${text}`}</Text>}
      {isVerseEnd && <Text style={styles.word}>({verseNumber}) </Text>}
      {isLastWord && <Text> </Text>}
    </>
  );
}

const styles = StyleSheet.create({
  word: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'ScheherazadeNew-Regular',
  },
});
