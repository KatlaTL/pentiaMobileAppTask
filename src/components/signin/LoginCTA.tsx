import React from "react";
import Icon from 'react-native-vector-icons/FontAwesome';
import { signInStyle as styles } from "../../styles/signInStyle";
import { globalStyle } from "../../styles/global";
import { Text, TouchableOpacity, View } from "react-native";

type LoginCTAType = {
    onPress: () => void,
    backgroundColorHex: string,
    iconColorHex: string,
    iconName: string,
    buttonText: string,
    textColorHex: string
}

const LoginCTA = ({ onPress, backgroundColorHex, iconColorHex, iconName, buttonText, textColorHex }: LoginCTAType): React.JSX.Element => {
    return (
        <TouchableOpacity style={[styles.button, { backgroundColor: backgroundColorHex }]} onPress={async () => await onPress()}>
            <Icon name={iconName} size={30} style={[globalStyle.flex1, { marginLeft: 15 }]} color={iconColorHex} />
            <Text style={[styles.buttonText, { flex: 4, color: textColorHex }]}>{buttonText}</Text>
        </TouchableOpacity>
    )
}

export default LoginCTA;