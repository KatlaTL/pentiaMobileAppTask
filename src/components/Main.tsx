import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import SignIn from "./signin/SignIn";
import useAuthStatus from "../hooks/useAuthStatus";
import Register from "./signin/Register";
import { globalStyle } from "../styles/global";
import { colors } from "../styles/colors";
import RoomsList from "./rooms/RoomsList";
import Room from "./rooms/Room";
import { signOut } from "../services/AuthService";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DrawerContentScrollView, DrawerItem, DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";
import NotificationsSwitch from "./NotificationSwitch";
import { useAppDispatch } from "../redux/store/store";
import { useSelector } from "react-redux";
import { selectUser, toggleNotifications } from "../redux/reducers/userSlice";

export type RootStackParamList = {
    SignIn: undefined,
    Register: undefined,
    RoomsList: undefined,
    Room: { room_id: string, room_name: string },
    Root: undefined
}

export type RootDrawerParamList = {
    Notifications: undefined,
    Logout: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<RootDrawerParamList>();

const Root = (): React.JSX.Element => {
    const appDispatch = useAppDispatch();
    const user = useSelector(selectUser);

    //TO-DO: save user notification value in DB and register all users with notifications enabled 
    const onToggleSwitch = () => appDispatch(toggleNotifications());
    
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
                        <DrawerItem label={({ color }) => <NotificationsSwitch color={color} notifications={user?.notificationsEnabled || false} onToggleSwitch={onToggleSwitch} />} onPress={onToggleSwitch} />
                        <DrawerItem label={"Logout"} onPress={signOut} />
                    </DrawerContentScrollView>
                )
            }}
        >
            <Stack.Screen name="RoomsList" component={RoomsList} options={{ title: "Chat Rooms" }} />
        </Drawer.Navigator>
    )
}

const Main = (): React.JSX.Element => {
    const { user, initializing } = useAuthStatus();

    if (initializing) {
        return (
            <View style={globalStyle.activityIndicator}>
                <ActivityIndicator size={100} color="#0000ff" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: colors.orangeBackgroundColor,
                    headerTintColor: colors.whiteTextColor.color,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerTitleAlign: "center"
                }}
                initialRouteName={user ? "Root" : "SignIn"}
            >
                {user ? (
                    <>
                        <Stack.Screen name="Root" component={Root} options={{ headerShown: false }} />
                        <Stack.Screen name="Room" component={Room} options={({ route }) => ({ title: route.params.room_name })} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="SignIn" component={SignIn} options={{ title: "Sign In", headerStyle: colors.purpleBackgroundColor }} />
                        <Stack.Screen name="Register" component={Register} options={{ title: "Register", headerStyle: colors.blueBackgroundColor }} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Main;