import React from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { signInStyle as styles } from "../../styles/signInStyle";
import { colors } from "../../styles/colors";
import ToggleSignInRegister from "./ToggleSignInRegister";
import useSignInForm, { ReducerState } from "../../hooks/useSignInForm";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Main";
import { onFacebookSignIn, onGoogleSignIn } from "../../services/AuthService";

const initialValue: ReducerState = {
    email: {
        value: "",
        error: null
    },
    password: {
        value: "",
        error: null
    }
}

type NavigationProps = NativeStackScreenProps<RootStackParamList, "SignIn">;

const SignIn = ({ navigation }: NavigationProps): React.JSX.Element => {
    const { reducerDispatch, actionCreators } = useSignInForm(initialValue);

    const handleFacebookSignInClick = async () => {
        const error = await onFacebookSignIn();

        if (error) {
            switch (error.code) {
                /* case "auth/invalid-credential":
                    reducerDispatch(actionCreators.setError("", "Invalid credentials"));
                    break;
                case "auth/user-disabled":
                    reducerDispatch(actionCreators.setError("", "User is disabled"));
                    break;
                case "auth/account-exists-with-different-credential":
                    console.error("auth/account-exists-with-different-credential")
                    reducerDispatch(actionCreators.setError("", "Account already exist with different credentials"));
                    break; */
                default:
                    console.error(error, "Unhandled error");
                    break;
            }
        }
    }

    const handleGoogleSignInClick = async () => {
        await onGoogleSignIn();
    }

    return (
        <ScrollView contentContainerStyle={styles.signInWrapper} keyboardShouldPersistTaps="handled">

            <TouchableOpacity style={[styles.button, colors.facebookBackgroundColor]} onPress={handleFacebookSignInClick}>
                <Text style={[styles.buttonText, colors.whiteTextColor]}>Sign In with Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, colors.purpleBackgroundColor]} onPress={handleGoogleSignInClick}>
                <Text style={[styles.buttonText, colors.whiteTextColor]}>Sign In with Google</Text>
            </TouchableOpacity>

        </ScrollView>
    )
}

export default SignIn;