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
      {words.map(word => (
        <Word key={word.id} word={word} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    gap: 8,
  },
});
