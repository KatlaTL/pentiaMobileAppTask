import React from "react";
import { Text, TextInput, View, TextInputAndroidProps } from "react-native";
import { signInStyle as styles } from "../../styles/signInStyle";
import AuthError from "./AuthError";

type InputFieldType = {
    name: string,
    onChangeFn: (text: string) => void,
    inputValue: string,
    errorMessage: string | null,
    autoCompleteField?: "name" | "email" | "current-password" | "password",
    secure?: boolean
}

const InputField = ({ name, onChangeFn, inputValue, errorMessage, autoCompleteField, secure = false }: InputFieldType): React.JSX.Element => {
    return (
        <View style={styles.inputWrapper}>
            <Text style={styles.label}>{name}</Text>
            <TextInput
                style={styles.inputField}
                placeholder={name}
                placeholderTextColor={"gray"}
                onChangeText={onChangeFn}
                defaultValue={inputValue}
                autoComplete={autoCompleteField}
                secureTextEntry={secure}
            />
            {errorMessage && <AuthError message={errorMessage} />}
        </View>
    )
}

export default InputField;