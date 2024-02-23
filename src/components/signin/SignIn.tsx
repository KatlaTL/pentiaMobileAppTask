import React from "react";
import auth from '@react-native-firebase/auth';
import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { signInStyle as styles } from "../../styles/signInStyle";
import { colors } from "../../styles/colors";
import ToggleSignInRegister from "./ToggleSignInRegister";
import useSignInForm, { reducerState } from "../../hooks/useSignInForm";
import AuthError from "./AuthError";
import { useAppDispatch } from "../../redux/store/store";
import { login } from "../../redux/reducers/userSlice";

type SignIn = {
    registerClick: () => void
}

const initialValue: reducerState = {
    email: {
        value: "",
        error: null
    },
    password: {
        value: "",
        error: null
    }
}

const SignIn = ({ registerClick }: SignIn): React.JSX.Element => {
    const { reducerState, reducerDispatch, actionCreators, validateForm } = useSignInForm(initialValue);
    const appDispatch = useAppDispatch();

    const handleSignInClick = async () => {
        if (validateForm()) {
            return;
        }

        auth().signInWithEmailAndPassword(reducerState.email.value, reducerState.password.value)
            .then((userCredential) => {
                appDispatch(
                    login({
                        email: userCredential.user.email,
                        uid: userCredential.user.uid,
                        displayName: userCredential.user.displayName,
                        photoURL: userCredential.user.photoURL
                    }))
            })
            .catch((err) => {
                switch (err.code) {
                    case "auth/invalid-email":
                        reducerDispatch(actionCreators.setError("email", "Invalid email address"));
                        break;
                    case "auth/invalid-credential":
                        reducerDispatch(actionCreators.setError("password", "Email and password doesn't match"));
                        break;
                    default:
                        console.error(err, "Unhandled error");
                        break;
                }
            });
    }

    return (
        <KeyboardAvoidingView
            style={styles.signInWrapper}
            behavior={Platform.OS === "android" ? "height" : "padding"}
        >
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Email:</Text>
                <TextInput
                    style={styles.inputField}
                    placeholder="Email"
                    placeholderTextColor={"gray"}
                    onChangeText={text => reducerDispatch(actionCreators.setInputName("email", text))}
                    defaultValue={reducerState.email.value}
                    autoComplete="email"
                />
                {reducerState.email.error && <AuthError message={reducerState.email.error} />}
            </View>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Password:</Text>
                <TextInput
                    style={styles.inputField}
                    placeholder="Password"
                    placeholderTextColor={"gray"}
                    onChangeText={text => reducerDispatch(actionCreators.setInputName("password", text))}
                    defaultValue={reducerState.password.value}
                    secureTextEntry={true}
                    autoComplete="current-password"
                />
                {reducerState.password.error && <AuthError message={reducerState.password.error} />}
            </View>
            <TouchableOpacity style={[styles.button, colors.purpleBackgroundColor]} onPress={handleSignInClick}>
                <Text style={[styles.buttonText, colors.whiteTextColor]}>Sign In</Text>
            </TouchableOpacity>

            <ToggleSignInRegister text="Not a user?" buttonText="Register here!" handleClick={registerClick} />

        </KeyboardAvoidingView>
    )
}

export default SignIn;