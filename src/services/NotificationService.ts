import notifee, { AuthorizationStatus } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

export const enableNotificationsForRoomID = async (roomID: string) => {
    const hasPermission = await getNotificationPermission();

    if (!hasPermission) {
        return;
    }
    const token = await getFCMDeviceToken();
    console.log(token)
 // TO-DO check if current user has a token, otherwise get one
 // TO-DO add the user to the notification list for the specific roomID
 // TO-DO handle notifications
}

export const getNotificationPermission = async (): Promise<boolean> => {
    const settings = await notifee.requestPermission();

    if (settings.authorizationStatus == AuthorizationStatus.AUTHORIZED) {
        console.log('Notification permissions has been authorized');
        return true;
    }

    console.log('Notification permissions has been denied');

    return false;
}

export const getFCMDeviceToken = async () => {
    if (!messaging().isDeviceRegisteredForRemoteMessages) {
        await messaging().registerDeviceForRemoteMessages();
    }

    return await messaging().getToken();
}