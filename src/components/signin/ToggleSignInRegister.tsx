import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { signInStyle as styles } from "../../styles/signInStyle";
import { colors } from "../../styles/colors";

type ToggleSignInRegister = {
    handleClick: () => void,
    text: string,
    buttonText: string
}
const ToggleSignInRegister = ({ handleClick, text, buttonText }: ToggleSignInRegister): React.JSX.Element => {
    return (
        <View style={styles.registerWrapper}>
            <Text style={styles.label}>{text}</Text>
            <TouchableOpacity onPress={handleClick}>
                <Text style={[styles.buttonText, colors.blueTextColor]}>{buttonText}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ToggleSignInRegister;