import React from "react";
import { Button, View } from "react-native";
import auth from '@react-native-firebase/auth';

type signOut = {
    signOutClick: () => void
}
const SignOut = ({ signOutClick }: signOut): React.JSX.Element => {
    const handleClick = async () => {
        await auth().signOut();
        signOutClick();
    }

    return (
        <View>
            <Button title="Sign Out" onPress={handleClick} />
        </View>
    )
}

export default SignOut;