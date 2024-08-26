import { useEffect } from "react";
import messaging from '@react-native-firebase/messaging';
import { NotificationStateType, useNotificationContext } from "../contexts/notification.context"
import { getSupportedNotificationURL, onDisplayNotification } from "../services/NotificationService";
import { Linking } from "react-native";
import notifee, { EventType } from '@notifee/react-native';

interface INotificationType extends NotificationStateType {
    doesURLRequiresAuth: (url: string) => boolean;
}

/**
 * Notification hook.
 * @returns {object} URLRequiresAuth(). Check if an URL requires the user to be authorized
 */
const useNotification = (): INotificationType => {
    const notificationContext = useNotificationContext();

    /**
     * Check if an URL requires the user to be authorized
     */
    const doesURLRequiresAuth = (url: string): boolean => url.startsWith("pentiamobileapptask://app");

    /**
     * Listens to notifee foreground notifications press
     */
    useEffect(() => {
        return notifee.onForegroundEvent(async ({ type, detail }) => {
            if (type === EventType.PRESS) {
                const url = await getSupportedNotificationURL(detail.notification);

                if (url) {
                    Linking.openURL(url);
                }
            }
        });
    }, []);

    /**
     * Listens on foreground FCM notifications.
     * Creates a new Notifee notification if a FCM notification has been sent, to show a notification icon to the user
     */
    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            const title = remoteMessage.notification?.title || "";
            const body = remoteMessage.notification?.body || "";
            const data = remoteMessage.data;

            onDisplayNotification(title, body, data);
        });

        return unsubscribe;
    }, [])

    return {
        doesURLRequiresAuth,
        ...notificationContext
    }

}

export default useNotification;