import {BottomTabNavigationOptions} from '@react-navigation/bottom-tabs';
import {ParamListBase, RouteProp} from '@react-navigation/native';

export type BottomTabsScreenOptionsType =
  | BottomTabNavigationOptions
  | ((props: {
      route: RouteProp<ParamListBase, string>;
      navigation: any;
    }) => BottomTabNavigationOptions)
  | undefined;
