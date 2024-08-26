import notifee, { AuthorizationStatus, Notification } from '@notifee/react-native';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { getAllFCMTokensByUserIDs, getUserByID, updateUserByID } from './AuthService';
import { addUserToChatRoomSubscriberList, getChatRoomSubscriberList } from './ChatRoomService';
import { Linking } from 'react-native';

/**
 * If the user accepts notifications, then get FCM Token and save it on the user in Firestore and add the user to the chat rooms notification subscriber list
 */
export const enableNotificationsForRoomID = async (roomID: string, userID: string): Promise<void> => {
    try {
        // Check for notification permissions
        const hasPermission = await getNotificationPermission();

        if (!hasPermission) {
            throw "Notification permissions has been denied";
        }

        // Check if a FCMToken is saved on the current user
        const user = await getUserByID(userID);

        if (user.error) {
            throw "User not found";
        }

        // If the user doesn't have a FCMToken, get a new token and save it on the user
        if (user.user && (!Object.hasOwn(user.user, "FCMToken") || user.user.FCMToken.length === 0)) {
            const token = await getFCMDeviceToken();

            if (!token) {
                throw "FCM device token missing";
            }

            const userUpdateError = await updateUserByID(userID, {
                FCMToken: token
            });

            if (userUpdateError) {
                throw "Something went wrong while updating user";
            }
        }

        const roomNotificationUpdateError = await addUserToChatRoomSubscriberList(roomID, userID);

        if (roomNotificationUpdateError) {
            throw "Something went wrong while updating room notification list";
        }
    } catch (err) {
        console.error(err); // TO-DO handle exceptions 
    }
}

/**
 * Ask the user for permission to send notifications.
 */
export const getNotificationPermission = async (): Promise<boolean> => {
    const settings = await notifee.requestPermission();

    if (settings.authorizationStatus == AuthorizationStatus.AUTHORIZED) {
        console.log('Notification permissions has been authorized');
        return true;
    }

    console.log('Notification permissions has been denied');

    return false;
}

/**
 * Get the FCM device token
 * @returns FCM Token
 */
export const getFCMDeviceToken = async (): Promise<string> => {
    try {
        if (!messaging().isDeviceRegisteredForRemoteMessages) {
            await messaging().registerDeviceForRemoteMessages();
        }

        return await messaging().getToken();
    } catch (err) {
        console.error("Problem with receiving FCM device token", err);
        return "";
    }
}

/**
 * Send notifications to all notification subscribers for the chat room
 */
export const sendNotificationOnNewMessage = async (roomID: string) => {
    try {
        // Get list of users that are to receive notifications
        const subscriberList = await getChatRoomSubscriberList(roomID);

        if (subscriberList.error) {
            throw "Problem with receiving subscriber list";
        }

        // Get all FCM tokens
        let FCMTokens: string[] = [];

        if (subscriberList.subscribersList) {
            FCMTokens = await getAllFCMTokensByUserIDs(subscriberList.subscribersList);
        }

        console.log("FCMTokens", FCMTokens);

        //TO-DO send push notification using REST api v1

    } catch (err) {
        console.error(err);
    }
}

/**
 * Listen for notification when the app is in the background or terminated.
 * Listens for both FCM and Notifee notifications
 * Must be called outside of the applications lifecycle, e.g. alongside your AppRegistry.registerComponent() method call at the the entry point of your application code.
 */
export const listenForNotificationBackground = async () => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
        const url = await getSupportedNotificationURL(remoteMessage);

        if (url) {
            Linking.openURL(url);
        }
    });

    notifee.onBackgroundEvent(async ({ detail }) => {
        const url = await getSupportedNotificationURL(detail.notification);

        if (url) {
            Linking.openURL(url);
        }
    });
}

/**
 * Check if the notification URL can be opened.
 * @returns {string} The notification URL or null if the URL is invalid
 */
export const getSupportedNotificationURL = async (message: FirebaseMessagingTypes.RemoteMessage | (Notification | undefined)): Promise<string | null> => {
    if (!message) {
        return null;
    }

    const url = message.data?.url as string;

    if (url) {
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            return url;
        }
    }
    return null;
}

/**
 *  Creates a notifee notifications 
 */
export const onDisplayNotification = async (title: string, body: string, data: any) => {
    // Request permissions (required for iOS)
    await notifee.requestPermission()

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
        title: title,
        body: body,
        data: data,
        android: {
            channelId,
        },
    });
}