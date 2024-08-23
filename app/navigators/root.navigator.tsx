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
import { useNotificationContext } from "../contexts/notification.context";

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
    const { setNotificationURL } = useNotificationContext();

    const linkingConfig = {
        prefixes: ["pentiamobileapptask://"],
        config: {
            screens: {
                App: {
                    path: "app",
                    screens: {
                        Chat: "chat/:chat_id"
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
        getInitialURL: async () => {
            const initialNotification = await messaging().getInitialNotification();
            console.log("initialNotification", initialNotification);

            if (initialNotification) {
                const url = await getSupportedNotificationURL(initialNotification);

                if (url) {
                    console.log("isloaded nav", isLoaded);
                    console.log("user nav", user);
                    if (!isLoaded || !user) {
                        setNotificationURL(url);
                    } else {
                        console.log("what about here?")
                        Linking.openURL(url);
                    }
                }
            }

            return await Linking.getInitialURL();
        },
        subscribe: (listener) => {

            const linkingSubscription = Linking.addEventListener("url", ({ url }) => listener(url));

            const unsubscribeNotification = messaging().onNotificationOpenedApp((message) => {
                const url = message.data?.url;

                if (url) {
                    listener(url);
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