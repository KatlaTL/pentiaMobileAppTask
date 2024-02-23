import React from "react";
import { Button, View } from "react-native";
import auth from '@react-native-firebase/auth';
import { useAppDispatch } from "../../redux/store/store";
import { logout } from "../../redux/reducers/userSlice";

type signOut = {
    signOutClick: () => void
}
const SignOut = ({ signOutClick }: signOut): React.JSX.Element => {
    const appDispatch = useAppDispatch();

    const handleClick = async () => {
        auth().signOut()
        .then(() => {
            appDispatch(logout());
            signOutClick();
        })
        .catch(err => console.error("Can't log out", err));
    }

    return (
        <View>
            <Button title="Sign Out" onPress={handleClick} />
        </View>
    )
}

export default SignOut;