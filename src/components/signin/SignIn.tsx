import React from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { signInStyle as styles } from "../../styles/signInStyle";
import { colors } from "../../styles/colors";
import ToggleSignInRegister from "./ToggleSignInRegister";
import useSignInForm, { ReducerState } from "../../hooks/useSignInForm";
import { useAppDispatch } from "../../redux/store/store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Main";
import { signIn } from "../../services/AuthService";
import InputField from "./InputField";
import FacebookSingIn from "./FacebookSingIn";

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
        <FacebookSingIn />
            <InputField
                name="Email"
                onChangeFn={text => reducerDispatch(actionCreators.setInputName("email", text))}
                inputValue={reducerState.email.value}
                errorMessage={reducerState.email.error}
                autoCompleteField="email"
            />

            <InputField
                name="Password"
                onChangeFn={text => reducerDispatch(actionCreators.setInputName("password", text))}
                inputValue={reducerState.password.value}
                errorMessage={reducerState.password.error}
                autoCompleteField="current-password"
                secure={true}
            />

            <TouchableOpacity style={[styles.button, colors.purpleBackgroundColor]} onPress={handleSignInClick}>
                <Text style={[styles.buttonText, colors.whiteTextColor]}>Sign In</Text>
            </TouchableOpacity>

            <ToggleSignInRegister text="Not a user?" buttonText="Register here!" handleClick={() => navigation.navigate("Register")} />

        </ScrollView>
    )
}

export default SignIn;