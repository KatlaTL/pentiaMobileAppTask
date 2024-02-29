import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import SignIn from "./signin/SignIn";
import useAuthStatus from "../hooks/useAuthStatus";
import SignOut from "./signin/SingOut";
import Register from "./signin/Register";
import { globalStyle } from "../styles/global";
import RoomsList from "./rooms/RoomsList";
import Room from "./rooms/Room";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export type RootStackParamList = {
    SignIn: undefined,
    Register: undefined,
    RoomsList: undefined,
    Room: { room_id: string, room_name: string }
}

const Stack = createNativeStackNavigator<RootStackParamList>();

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
            <Stack.Navigator screenOptions={{
                headerStyle: {
                    backgroundColor: '#f4511e',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerTitleAlign: "center"
            }}>
                {user ? (
                    <>
                        <Stack.Screen name="RoomsList" component={RoomsList} options={{ title: "Chat Rooms" }} />
                        <Stack.Screen name="Room" component={Room} options={({ route }) => ({ title: route.params.room_name })} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="SignIn" component={SignIn} />
                        <Stack.Screen name="Register" component={Register} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Main;