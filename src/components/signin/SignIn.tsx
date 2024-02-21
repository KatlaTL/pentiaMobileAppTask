import React, { useState } from "react";
import auth from '@react-native-firebase/auth';
import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { signInStyle as styles } from "../../styles/signInStyle";
import { colors } from "../../styles/colors";
import ToggleSignInRegister from "./ToggleSignInRegister";

type SignIn = {
    registerClick: () => void
}

const SignIn = ({ registerClick }: SignIn): React.JSX.Element => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleSignInClick = async () => {
        if (email.length === 0 || password.length === 0) {
            return
        }
        auth().signInWithEmailAndPassword(email, password)
            .then(() => console.log("signed in!"))
            .catch((err) => {
                console.log(err.code);
                switch (err.code) {
                    case "auth/invalid-email":
                        console.log("invalid email!")
                        break;
                    case "auth/invalid-credential":
                        console.log("invalid password!")
                        break;
                    default:
                        console.log("default error")
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
                    onChangeText={text => setEmail(text)}
                    defaultValue={email}
                    autoComplete="email"
                />
            </View>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Password:</Text>
                <TextInput
                    style={styles.inputField}
                    placeholder="Password"
                    placeholderTextColor={"gray"}
                    onChangeText={text => setPassword(text)}
                    defaultValue={password}
                    secureTextEntry={true}
                    autoComplete="current-password"
                />
            </View>
            <TouchableOpacity style={[styles.button, colors.purpleBackgroundColor]} onPress={handleSignInClick}>
                <Text style={[styles.buttonText, colors.whiteTextColor]}>Sign In</Text>
            </TouchableOpacity>

            <ToggleSignInRegister text="Not a user?" buttonText="Register here!" handleClick={registerClick}/>

        </KeyboardAvoidingView>
    )
}

export default SignIn;