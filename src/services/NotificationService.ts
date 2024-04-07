import notifee, { AuthorizationStatus } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { getAllFCMTokensByUserIDs, getUserByID, updateUserByID } from './AuthService';
import { addUserToRoomSubscriberList, getRoomSubscriberList } from './RoomService';

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

        const roomNotificationUpdateError = await addUserToRoomSubscriberList(roomID, userID);

        if (roomNotificationUpdateError) {
            throw "Something went wrong while updating room notification list";
        }
    } catch (err) {
        console.error(err); // TO-DO handle exceptions 
    }
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

export const sendNotificationOnNewMessage = async (roomID: string) => {
    try {
        // Get list of users that are to receive notifications
        const subscriberList = await getRoomSubscriberList(roomID);

        if (subscriberList.error) {
            throw "Problem with receiving subscriber list";
        }

        // Get all FCM tokens
        let FCMTokens: string[] = [];

        if (subscriberList.subscribersList) {
            FCMTokens = await getAllFCMTokensByUserIDs(subscriberList.subscribersList);
        }

        //TO-DO send push notification using REST api v1
    } catch (err) {
        console.error(err);
    }
}