import React, { useState } from "react";
import auth from '@react-native-firebase/auth';
import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { signInStyle as styles } from "../../styles/signInStyle";
import { colors } from "../../styles/colors";

const Register = () :React.JSX.Element => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [displayName, setDisplayName] = useState<string>("");
 
    const handleRegisterClick = async () => {
        try {
            if (email.length === 0 || password.length === 0) {
                return
            }
            await auth().createUserWithEmailAndPassword(email, password);

            await auth().currentUser?.updateProfile({
                displayName: displayName
            })
        } catch (err) {
            //TODO add validation to register
            console.error(err)
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.signInWrapper}
            behavior={Platform.OS === "android" ? "height" : "padding"}
            keyboardVerticalOffset={Platform.OS === "android" ? 75 : 0}
        >
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Display name:</Text>
                <TextInput
                    style={styles.inputField}
                    placeholder="Display Name"
                    placeholderTextColor={"gray"}
                    onChangeText={text => setDisplayName(text)}
                    defaultValue={displayName}
                    autoComplete="name"
                />
            </View>
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

            <TouchableOpacity style={[styles.button, colors.blueBackgroundColor]} onPress={handleRegisterClick}>
                <Text style={[styles.buttonText, colors.whiteTextColor]}>Register</Text>
            </TouchableOpacity>

        </KeyboardAvoidingView>
    )
}

export default Register;