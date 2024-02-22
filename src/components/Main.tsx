import React, { useState } from "react";
import { Text, View } from "react-native";
import SignIn from "./signin/SignIn";
import useAuthStatus from "../hooks/useAuthStatus";
import SignOut from "./signin/SingOut";
import Register from "./signin/Register";
import { globalStyle } from "../styles/global";

const Main = (): React.JSX.Element | null => {
    const [isNewUser, setIsNewUser] = useState<boolean>(false);
    const { user, initializing } = useAuthStatus();

    if (initializing) {
        console.log("initializing...")
        return null;
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
            <Text>YOU ARE SIGNED IN</Text>
            <SignOut signOutClick={() => setIsNewUser(false)} />
        </View>
    )
}

export default Main;