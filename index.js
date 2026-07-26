/**
 * @format
 */

import {registerRootComponent} from 'expo';
import notifee from '@notifee/react-native';
import App from './App';
import 'react-native-gesture-handler';
import {handleNotificationEvent} from './src/services/notifications.service';

notifee.onBackgroundEvent(handleNotificationEvent);

registerRootComponent(App);
