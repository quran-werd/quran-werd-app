import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Chapters from '../screens/Chapters';
import Page from '../screens/Page';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

type RootStackParamList = {
  Chapters: undefined;
  Page: {chapterNumber: number};
};

export type ChapterProps = NativeStackScreenProps<RootStackParamList, 'Page'>;

export type ChaptersProps = NativeStackScreenProps<
  RootStackParamList,
  'Chapters'
>;

const Stack = createStackNavigator<RootStackParamList>();

function ChaptersStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Chapters"
        component={Chapters}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Page"
        component={Page}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default ChaptersStack;
