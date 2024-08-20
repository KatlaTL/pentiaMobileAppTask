import React from "react";
import { ActivityIndicator, View } from "react-native";
import SignInScreen from "../screens/signin/signin.screen";
import useAuthStatus from "../hooks/useAuthStatus";
import { globalStyle } from "../assets/styles/global";
import { colors } from "../assets/styles/colors";
import ChatRoomsScreen from "../screens/chat-rooms/chat-rooms.screen";
import ChatScreen from "../screens/chat/chat.screen";
import { signOut } from "../services/AuthService";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DrawerContentScrollView, DrawerItem, DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";
import SplashScreen from "../screens/splash/Splash";

export type RootStackParamList = {
    SignIn: undefined,
    ChatRooms: undefined,
    Chat: { chat_id: string, chat_name: string },
    Root: undefined,
    Splash: undefined
}

export type RootDrawerParamList = {
    Logout: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<RootDrawerParamList>();

const Root = (): React.JSX.Element => {
    return (
        <Drawer.Navigator screenOptions={{
            headerStyle: colors.orangeBackgroundColor,
            headerTintColor: colors.whiteTextColor.color,
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            headerTitleAlign: "center"
        }}
            drawerContent={(props) => {
                //Overrides the content of the drawer. DrawerItemList renders all of the existing screens and DrawerItem adds a new custom item
                return (
                    <DrawerContentScrollView {...props}>
                        <DrawerItemList {...props} />
                        <DrawerItem label={"Logout"} onPress={signOut} />
                    </DrawerContentScrollView>
                )
            }}
        >
            <Stack.Screen name="ChatRooms" component={ChatRoomsScreen} options={{ title: "Chat Rooms" }} />
        </Drawer.Navigator>
    )
}

const Main = (): React.JSX.Element => {
    const { user, initializing } = useAuthStatus();

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: colors.orangeBackgroundColor,
                    headerTintColor: colors.whiteTextColor.color,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerTitleAlign: "center",
                    animation: "slide_from_right"
                }}
                initialRouteName={user ? "Root" : "SignIn"}
            >
                {initializing ? (
                    <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
                ) : (
                    user ? (
                        <>
                            <Stack.Screen name="Root" component={Root} options={{ headerShown: false }} />
                            <Stack.Screen name="Chat" component={ChatScreen} options={({ route }) => ({ title: route.params.chat_name })} />
                        </>
                    ) : (
                        <>
                            <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: "Sign In" }} />
                        </>
                    )
                )}
            </Stack.Navigator>
        </NavigationContainer >
    )
}

export default Main;