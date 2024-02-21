import React, { useReducer } from "react";
import auth from '@react-native-firebase/auth';
import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { signInStyle as styles } from "../../styles/signInStyle";
import { colors } from "../../styles/colors";
import ToggleSignInRegister from "./ToggleSignInRegister";
import AuthError from "./AuthError";
import ErrorMessages from "../../constants/errorMessages.json"

type Register = {
    signInClick: () => void
}

type reducerAction = {
    type: string,
    value: string | null,
    inputName: string
}

type reducerState = {
    [key: string]: {
        value: string,
        error: string | null
    }
}

const initialState: reducerState = {
    email: {
        value: "",
        error: null
    },
    password: {
        value: "",
        error: null
    },
    displayName: {
        value: "",
        error: null
    }
}

const Register = ({ signInClick }: Register): React.JSX.Element => {
    const [state, dispatch] = useReducer((state: reducerState, action: reducerAction): reducerState => {
        switch (action.type) {
            case "update_value":
                return {
                    ...state,
                    [action.inputName]: {
                        ...state[action.inputName],
                        value: action.value || ""
                    }
                }
            case "update_error":
                return {
                    ...state,
                    [action.inputName]: {
                        ...state[action.inputName],
                        error: action.value
                    }
                }
            case "remove_error":
                return {
                    ...state,
                    [action.inputName]: {
                        ...state[action.inputName],
                        error: action.value
                    }
                }
        }
        throw Error("Unknow action: " + action.type); //Should be caught somewhere
    }, initialState)

    const handleRegisterClick = () => {
        let isEmpty = false;
        for (const [key, value] of Object.entries(state)) {
            if (value.value?.length === 0) {
                dispatch({ type: "update_error", inputName: key, value: ErrorMessages[key] || `${key} can't be empty` });
                isEmpty = true;
            } else {
                dispatch({ type: "remove_error", inputName: key, value: null });
            }
        }
        if (isEmpty) {
            return;
        }
        auth().createUserWithEmailAndPassword(state.email.value, state.password.value)
            .then(async () => {
                await auth().currentUser?.updateProfile({
                    displayName: state.displayName.value
                })
            })
            .catch((err) => {
                switch (err.code) {
                    case "auth/invalid-email":
                        dispatch({ type: "update_error", inputName: "email", value: "Invalid email address" });
                        break;
                    case "auth/email-already-in-use":
                        dispatch({ type: "update_error", inputName: "email", value: "Email address already in use" });
                        break;
                    case "auth/weak-password":
                        dispatch({ type: "update_error", inputName: "password", value: "Weak password" });
                        break;
                    default:
                        console.error("default error")
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
                <Text style={styles.label}>Display name:</Text>
                <TextInput
                    style={styles.inputField}
                    placeholder="Display Name"
                    placeholderTextColor={"gray"}
                    onChangeText={text => dispatch({ type: "update_value", inputName: "displayName", value: text })}
                    defaultValue={state.displayName.value}
                    autoComplete="name"
                />
                {state.displayName.error && <AuthError message={state.displayName.error} />}
            </View>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Email:</Text>
                <TextInput
                    style={styles.inputField}
                    placeholder="Email"
                    placeholderTextColor={"gray"}
                    onChangeText={text => dispatch({ type: "update_value", inputName: "email", value: text })}
                    defaultValue={state.email.value}
                    autoComplete="email"
                />
                {state.email.error && <AuthError message={state.email.error} />}
            </View>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Password:</Text>
                <TextInput
                    style={styles.inputField}
                    placeholder="Password"
                    placeholderTextColor={"gray"}
                    onChangeText={text => dispatch({ type: "update_value", inputName: "password", value: text })}
                    defaultValue={state.password.value}
                    secureTextEntry={true}
                    autoComplete="current-password"
                />
                {state.password.error && <AuthError message={state.password.error} />}
            </View>

            <TouchableOpacity style={[styles.button, colors.blueBackgroundColor]} onPress={handleRegisterClick}>
                <Text style={[styles.buttonText, colors.whiteTextColor]}>Register</Text>
            </TouchableOpacity>

            <ToggleSignInRegister text="Already a user?" buttonText="Sign in here!" handleClick={signInClick} />

        </KeyboardAvoidingView>
    )
}

export default Register;