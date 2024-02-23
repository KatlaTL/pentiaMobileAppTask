import React from "react";
import auth from '@react-native-firebase/auth';
import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { signInStyle as styles } from "../../styles/signInStyle";
import { colors } from "../../styles/colors";
import ToggleSignInRegister from "./ToggleSignInRegister";
import AuthError from "./AuthError";
import useSignInForm from "../../hooks/useSignInForm";
import { useAppDispatch } from "../../redux/store/store";
import { login } from "../../redux/reducers/userSlice";
import firestore from '@react-native-firebase/firestore';

type Register = {
    signInClick: () => void
}

const Register = ({ signInClick }: Register): React.JSX.Element => {
    const { reducerState, reducerDispatch, actionCreators, validateForm } = useSignInForm();
    const appDispatch = useAppDispatch();

    const handleRegisterClick = (): void => {
        if (validateForm()) {
            return;
        }

        auth().createUserWithEmailAndPassword(reducerState.email.value, reducerState.password.value)
            .then(async (userCredential) => {
                await userCredential.user.updateProfile({
                    displayName: reducerState.userName.value
                });
            })
            .then(async () => {
                const user = auth().currentUser;
                if (!user) throw "User doesn't exist";

                await firestore().collection("users").doc(user.uid).set({
                    email: user.email,
                    uid: user.uid,
                    user_name: user.displayName,
                    photo_url: user.photoURL,
                    date_created: new Date()
                });                

                return user;
            })
            .then((user) => {
                appDispatch(
                    login({
                        email: user.email,
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    }))
            })
            .catch((err) => {
                switch (err.code) {
                    case "auth/invalid-email":
                        reducerDispatch(actionCreators.setError("email", "Invalid email address"));
                        break;
                    case "auth/email-already-in-use":
                        reducerDispatch(actionCreators.setError("email", "Email address already in use"));
                        break;
                    case "auth/weak-password":
                        reducerDispatch(actionCreators.setError("password", "Weak password"));
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
                <Text style={styles.label}>User name:</Text>
                <TextInput
                    style={styles.inputField}
                    placeholder="User Name"
                    placeholderTextColor={"gray"}
                    onChangeText={text => reducerDispatch(actionCreators.setInputName("userName", text))}
                    defaultValue={reducerState.userName.value}
                    autoComplete="name"
                />
                {reducerState.userName.error && <AuthError message={reducerState.userName.error} />}
            </View>
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

            <TouchableOpacity style={[styles.button, colors.blueBackgroundColor]} onPress={handleRegisterClick}>
                <Text style={[styles.buttonText, colors.whiteTextColor]}>Register</Text>
            </TouchableOpacity>

            <ToggleSignInRegister text="Already a user?" buttonText="Sign in here!" handleClick={signInClick} />

        </KeyboardAvoidingView>
    )
}

export default Register;