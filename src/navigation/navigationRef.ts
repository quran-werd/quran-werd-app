import {createNavigationContainerRef} from '@react-navigation/native';
import type {RootStackParamList} from './index';

export const navigationRef =
  createNavigationContainerRef<RootStackParamList>();
