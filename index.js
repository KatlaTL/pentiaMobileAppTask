import { AppRegistry } from 'react-native';
import App from './app/App';
import { name as appName } from './app.json';
import { listenForNotificationBackground } from './app/services/NotificationService';

listenForNotificationBackground();

AppRegistry.registerComponent(appName, () => App);