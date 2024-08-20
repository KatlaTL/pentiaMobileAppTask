import { NavigationContainer } from "@react-navigation/native"
import useAuth from "../hooks/useAuth";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppNavigator } from "./app.navigator";
import SplashScreen from "../screens/splash/splash.screen";
import { AuthNavigator } from "./auth.navigator";
import { useLoadingContext } from "../contexts/loading.context";

type RootStackParamList = {
    Splash: undefined;
    App: undefined;
    Auth: undefined;
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
    const { user } = useAuth();
    const { isLoaded } = useLoadingContext();

    return (
        <NavigationContainer>
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