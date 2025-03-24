import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Mushaf} from '../screens/Mushaf';
import Chapters from '../screens/Chapters';

type RootStackParamList = {
  Chapters: undefined;
  Mushaf: {pageNumber: number};
};

export type ChapterProps = NativeStackScreenProps<RootStackParamList, 'Mushaf'>;

export type MushafProps = NativeStackScreenProps<RootStackParamList, 'Mushaf'>;

export type ChaptesrProps = NativeStackScreenProps<
  RootStackParamList,
  'Chapters'
>;

const Stack = createStackNavigator<RootStackParamList>();

function ChaptersStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Chapters" component={Chapters} />
      <Stack.Screen name="Mushaf" component={Mushaf} />
    </Stack.Navigator>
  );
}

export default ChaptersStack;
