import React from 'react';
import {PageTypes} from '../../types/page.types';
import Word from '../Word';
import {StyleSheet, View} from 'react-native';

interface IProps {
  line: PageTypes.Line;
}
export default function Line({line}: IProps) {
  const {words} = line;

  return (
    <View style={styles.container}>
      {words.map((word, idx) => (
        <Word key={word.id} word={word} isLastWord={idx === words.length - 1} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    width: '100%',
  },
});
