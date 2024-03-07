import React from "react";
import { Text, TextInput, TouchableOpacity, View, ScrollView } from "react-native";
import { signInStyle as styles } from "../../styles/signInStyle";
import { colors } from "../../styles/colors";
import ToggleSignInRegister from "./ToggleSignInRegister";
import AuthError from "./AuthError";
import useSignInForm from "../../hooks/useSignInForm";
import { useAppDispatch } from "../../redux/store/store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Main";
import { register } from "../../services/AuthService";

type NavigationProps = NativeStackScreenProps<RootStackParamList, "Register">;

const Register = ({ navigation }: NavigationProps): React.JSX.Element => {
    const { reducerState, reducerDispatch, actionCreators, validateForm } = useSignInForm();
    const appDispatch = useAppDispatch();

    const handleRegisterClick = (): void => {
        if (validateForm()) {
            return;
        }
        register({
            email: reducerState.email.value,
            password: reducerState.password.value,
            userName: reducerState.userName.value,
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

            <ToggleSignInRegister text="Already a user?" buttonText="Sign in here!" handleClick={() => navigation.navigate("SignIn")} />
        </ScrollView>
    )
}

export default Register;