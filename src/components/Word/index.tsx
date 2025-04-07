import React from 'react';
import {PageTypes} from '../../types/page.types';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import {IMAGES} from '../../common';
import VerseNumber from '../VerseNumber';

interface IProps {
  word: PageTypes.Word;
  isLastWord: boolean;
}
export default function Word({word, isLastWord}: IProps) {
  const {text, isVerseEnd, verseNumber} = word;

  const wordStyle = {...styles.word, fontSize: RFValue(15)};

  return (
    <>
      {!!text && <Text style={wordStyle}>{`${text}`}</Text>}
      {isVerseEnd && <VerseNumber verseNumber={verseNumber} />}
    </>
  );
}

const styles = StyleSheet.create({
  word: {
    fontSize: 18,
    color: '#0f0f0f',
    fontFamily: 'ScheherazadeNew-Regular',
  },
});
