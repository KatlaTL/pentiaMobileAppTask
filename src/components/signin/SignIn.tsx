import React from "react";
import auth from '@react-native-firebase/auth';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { signInStyle as styles } from "../../styles/signInStyle";
import { colors } from "../../styles/colors";
import ToggleSignInRegister from "./ToggleSignInRegister";
import useSignInForm, { ReducerState } from "../../hooks/useSignInForm";
import AuthError from "./AuthError";
import { useAppDispatch } from "../../redux/store/store";
import { login } from "../../redux/reducers/userSlice";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Main";
import { signIn } from "../../services/AuthService";

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
    const { reducerState, reducerDispatch, actionCreators, validateForm } = useSignInForm(initialValue);
    const appDispatch = useAppDispatch();

    const handleSignInClick = async () => {
        if (validateForm()) {
            return;
        }

        signIn({
            email: reducerState.email.value,
            password: reducerState.password.value,
            appDispatch,
            validate: {
                reducerDispatch,
                actionCreators
            }
        });
    }

    return (
        <ScrollView contentContainerStyle={styles.signInWrapper} keyboardShouldPersistTaps="handled">
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

            <ToggleSignInRegister text="Not a user?" buttonText="Register here!" handleClick={() => navigation.navigate("Register")} />

        </ScrollView>
    )
}

export default SignIn;