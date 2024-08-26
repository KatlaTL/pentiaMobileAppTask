import { NavigationContainer } from "@react-navigation/native"
import useAuth from "../hooks/useAuth";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppNavigator } from "./app.navigator";
import SplashScreen from "../screens/splash/splash.screen";
import { AuthNavigator } from "./auth.navigator";
import { useLoadingContext } from "../contexts/loading.context";
import { Linking } from "react-native";
import { getSupportedNotificationURL } from "../services/NotificationService";
import messaging from '@react-native-firebase/messaging';
import useNotification from "../hooks/useNotification";
import { useEffect } from "react";

type RootStackParamList = {
    Splash: undefined;
    App: undefined;
    Auth: undefined;
}

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Root Navigation
 */
export const RootNavigator = () => {
    const { user } = useAuth();
    const { isLoaded } = useLoadingContext();
    const { doesURLRequiresAuth, notificationState, actionsDispatch } = useNotification();

    /**
     * Redirect the user to the stored deeplink URL after the user has logged in
     * and then reset the notification stored in notification context
     */
    useEffect(() => {
        if (notificationState.requiresAuth && notificationState.notificationURL) {
            Linking.openURL(notificationState.notificationURL);
            actionsDispatch?.reset();
        }
    }, [user]);

    /**
     * Redirect the user to the stored deeplink URL after the application has loaded if the route doesn't require authorization
     * and then reset the notification stored in notification context
     */
    useEffect(() => {
        if (!notificationState.requiresAuth && notificationState.notificationURL) {
            Linking.openURL(notificationState.notificationURL);
            actionsDispatch?.reset();
        }
    }, [isLoaded]);

    /**
     * Runs everytime Linking.openURL() has been called 
     */
    const linkingSubscriberFunction = (url: string, listener: (url: string) => void) => {
        const requiresAuth = doesURLRequiresAuth(url);

        if (!!requiresAuth && !user) {
            actionsDispatch?.requiresAuth(requiresAuth, url);
        } else {
            listener(url);
        }
    }

    const linkingConfig = {
        prefixes: ["pentiamobileapptask://"],
        config: {
            screens: {
                App: {
                    path: "app",
                    initialRouteName: "AppDrawer",
                    screens: {
                        Chat: "chat/:chat_id/:chat_name"
                    }
                },
                Auth: {
                    path: "signin",
                    screens: {
                        Signin: {
                            exact: true,
                            path: "signin"
                        }
                    }
                }
            }
        },
        //The initial URL the app uses when it loads
        getInitialURL: async () => {
            const initialNotification = await messaging().getInitialNotification();

            if (!!initialNotification) {
                const url = await getSupportedNotificationURL(initialNotification);

                if (url) {
                    const requiresAuth = doesURLRequiresAuth(url);
                    if (!isLoaded || (requiresAuth && !user)) {
                        actionsDispatch?.requiresAuth(requiresAuth, url);
                    } else {
                        Linking.openURL(url);
                    }
                }
            }

            return await Linking.getInitialURL();
        },
        /**
         * The subscribe function is used to handle incoming links instead of the default deeplink handling.
         * It's called when Linking.openURL() is used.
         * @param Listener The subscribe function will recieve a listener function as an argument, which is used to let React Navigation handle the incoming URL
         */
        subscribe: (listener) => {
            const linkingSubscription = Linking.addEventListener("url", ({ url }) => linkingSubscriberFunction(url, listener));

            const unsubscribeNotification = messaging().onNotificationOpenedApp((message) => {
                const url = message.data?.url;

                if (url && typeof url === "string") {
                    linkingSubscriberFunction(url, listener);
                }
            })

            return () => {
                linkingSubscription.remove();
                unsubscribeNotification();
            }
        }

    } as any;

    return (
        <NavigationContainer linking={linkingConfig}>
            {!isLoaded ? (
                <Stack.Navigator>
                    <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
                </Stack.Navigator>
            ) : (
                user ? (
                    <Stack.Navigator>
                        <Stack.Screen name="App" component={AppNavigator} options={{ headerShown: false }} />
                    </Stack.Navigator>
                ) : (
                    <Stack.Navigator>
                        <Stack.Screen name="Auth" component={AuthNavigator} options={{ headerShown: false }} />
                    </Stack.Navigator>
                )
            )}
        </NavigationContainer>
    )
}