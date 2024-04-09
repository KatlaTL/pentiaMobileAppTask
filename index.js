import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';

// Ignore log notification by message
LogBox.ignoreLogs([
    // Exact message
    'If you want to use Reanimated 2 then go through our installation steps',
]);

AppRegistry.registerComponent(appName, () => App);