import React, { useState } from "react";
import auth from '@react-native-firebase/auth';
import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { signInStyle as styles } from "../../styles/signInStyle";
import { colors } from "../../styles/colors";

type SignIn = {
    registerClick: () => void
}

const SignIn = ({ registerClick }: SignIn): React.JSX.Element => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleSignInClick = async () => {
        try {
            if (email.length === 0 || password.length === 0) {
                return
            }
            await auth().signInWithEmailAndPassword(email, password);
        } catch (err) {
            //TODO add validation to sign in
            console.error(err);
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.signInWrapper}
            behavior={Platform.OS === "android" ? "height" : "padding"}
            keyboardVerticalOffset={Platform.OS === "android" ? 75 : 0}
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

            <View style={styles.registerWrapper}>
                <Text style={styles.label}>Not a user?</Text>
                <TouchableOpacity onPress={registerClick}>
                    <Text style={[styles.buttonText, colors.blueTextColor]}>Register here!</Text>
                </TouchableOpacity>
            </View>

        </KeyboardAvoidingView>
    )
}

export default SignIn;