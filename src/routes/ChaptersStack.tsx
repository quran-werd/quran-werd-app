import {createStackNavigator} from '@react-navigation/stack';
import Chapters from '../components/Chapters';
import Chapter from '../components/Chapter';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

type RootStackParamList = {
  Chapters: undefined;
  Chapter: {chapterNumber: number};
};

export type ChapterProps = NativeStackScreenProps<
  RootStackParamList,
  'Chapter'
>;

export type ChaptesrProps = NativeStackScreenProps<
  RootStackParamList,
  'Chapters'
>;

const Stack = createStackNavigator<RootStackParamList>();

function ChaptersStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Chapters" component={Chapters} />
      <Stack.Screen name="Chapter" component={Chapter} />
    </Stack.Navigator>
  );
}

export default ChaptersStack;
