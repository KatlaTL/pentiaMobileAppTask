import React, { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import SignIn from "./signin/SignIn";
import useAuthStatus from "../hooks/useAuthStatus";
import SignOut from "./signin/SingOut";
import Register from "./signin/Register";
import { globalStyle } from "../styles/global";
import RoomsList from "./rooms/RoomsList";
import { useSelector } from "react-redux";
import { selectRoomId } from '../redux/reducers/roomSlice';
import Room from "./rooms/Room";

const Main = (): React.JSX.Element => {
    const [isNewUser, setIsNewUser] = useState<boolean>(false);
    const { user, initializing } = useAuthStatus();
    const room_id = useSelector(selectRoomId)

    if (initializing) {
        return (
            <View style={globalStyle.activityIndicator}>
                <ActivityIndicator size={100} color="#0000ff" />
            </View>
        );
    }

    if (!user) {
        return (
            <View style={globalStyle.flex1}>
                {isNewUser ? (
                    <Register signInClick={() => setIsNewUser(false)} />
                ) : (
                    <SignIn registerClick={() => setIsNewUser(true)} />
                )}
            </View>
        )
    }

    return (
        <View style={globalStyle.flex1}>
            {room_id ? (
                <Room room_id={room_id} />
            ) : (
                <RoomsList />
            )}
            <SignOut signOutClick={() => setIsNewUser(false)} />
        </View>
    )
}

export default Main;