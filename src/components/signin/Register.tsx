import React from "react";
import { Text, TouchableOpacity, ScrollView } from "react-native";
import { signInStyle as styles } from "../../styles/signInStyle";
import { colors } from "../../styles/colors";
import ToggleSignInRegister from "./ToggleSignInRegister";
import useSignInForm from "../../hooks/useSignInForm";
import { useAppDispatch } from "../../redux/store/store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Main";
import { register } from "../../services/AuthService";
import InputField from "./InputField";

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
            <InputField 
                name="User Name"
                onChangeFn={text => reducerDispatch(actionCreators.setInputName("userName", text))} 
                inputValue={reducerState.userName.value}
                errorMessage={reducerState.userName.error}
                autoCompleteField="name"
            />
            
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

            <TouchableOpacity style={[styles.button, colors.blueBackgroundColor]} onPress={handleRegisterClick}>
                <Text style={[styles.buttonText, colors.whiteTextColor]}>Register</Text>
            </TouchableOpacity>

            <ToggleSignInRegister text="Already a user?" buttonText="Sign in here!" handleClick={() => navigation.navigate("SignIn")} />
        </ScrollView>
    )
}

export default Register;