/**
 * @format
 */

import {AppRegistry} from 'react-native';
import notifee from '@notifee/react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import {handleNotificationEvent} from './src/services/notifications.service';

notifee.onBackgroundEvent(handleNotificationEvent);

AppRegistry.registerComponent(appName, () => App);
