import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import SignIn from "./src/components/signin/SignIn";
import useSignedInStatus from "./src/hooks/useSignedInStatus";
import SignOut from "./src/components/signin/SingOut";
import Register from "./src/components/signin/Register";
import { globalStyle } from "./src/styles/global";

const App = (): React.JSX.Element | null => {
    const [initializing, setInitializing] = useState<boolean>(true);
    const [isNewUser, setIsNewUser] = useState<boolean>(false);
    const user = useSignedInStatus(newInitializingState => setInitializing(newInitializingState));

    if (initializing) {
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

export default App;