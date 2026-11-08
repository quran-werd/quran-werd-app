import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '../../../styles/colors';
import {fontFamilies} from '../../../styles/typography';
import {radius} from '../../../styles/radius';

export default function SurahHeader({name}: {name: string}) {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(139,105,20,0.2)',
    backgroundColor: 'rgba(139,105,20,0.06)',
    borderRadius: radius.md,
    height: 40,
    marginVertical: 4,
  },
  name: {
    fontFamily: fontFamilies.amiriBold,
    fontSize: 16,
    color: colors.mushafBrown,
  },
});
